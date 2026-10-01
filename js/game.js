// Core 3D Racing Game Engine: Physics, AI, Race Manager, Controls, Mini-map

class RacingGame {
  constructor() {
    this.container = document.getElementById('game-container');
    this.canvas = document.getElementById('game-canvas');
    this.minimapCanvas = document.getElementById('minimap-canvas');
    this.minimapCtx = this.minimapCanvas ? this.minimapCanvas.getContext('2d') : null;

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    this.currentPhaseIndex = 0;
    this.trackData = null;

    this.playerCarData = null;
    this.playerCar = null;
    this.aiCars = [];
    this.allRacers = [];

    this.raceState = 'idle'; // 'countdown', 'racing', 'finished'
    this.countdownTimer = 3;
    this.raceTime = 0;
    this.maxLaps = 2;

    this.input = {
      forward: 0, // 1 = gas, -1 = brake/reverse
      steer: 0,   // -1 = left, 1 = right
      handbrake: false
    };

    this.clock = new THREE.Clock();
    this.animationId = null;

    this.initThree();
    this.initInputListeners();
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.5, 600);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    window.addEventListener('resize', () => this.onWindowResize());
  }

  onWindowResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  setupPhase(phaseIndex, selectedCarId) {
    this.currentPhaseIndex = phaseIndex;
    this.raceState = 'idle';
    this.raceTime = 0;

    // Clear existing scene children
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }

    const phaseConfig = TRACK_PHASES[phaseIndex] || TRACK_PHASES[0];

    // Sky & Fog
    this.scene.background = new THREE.Color(phaseConfig.skyColor);
    this.scene.fog = new THREE.FogExp2(phaseConfig.fogColor, phaseConfig.phase === 3 ? 0.008 : 0.005);

    // Lighting
    const hemiLight = new THREE.HemisphereLight(phaseConfig.sunLight, phaseConfig.ambientLight, 0.7);
    this.scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(phaseConfig.sunLight, 0.9);
    dirLight.position.set(60, 100, 40);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 280;
    const d = 110;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    this.scene.add(dirLight);

    // Build Track
    this.trackData = TrackBuilder.buildTrack(phaseIndex, this.scene);
    this.scene.add(this.trackData.group);

    // Initialize dirt dust particle pool
    this.initDustParticles();

    // Select Player Car & AI Cars
    this.playerCarData = CAR_CATALOG.find(c => c.id === selectedCarId) || CAR_CATALOG[0];
    const remainingCars = CAR_CATALOG.filter(c => c.id !== this.playerCarData.id);

    this.aiCars = [];
    this.allRacers = [];

    // Grid placement (2 columns along finish straight, facing forward)
    const curve = this.trackData.curve;
    const startPt = curve.getPointAt(0);
    const startTan = curve.getTangentAt(0).normalize();
    const startNorm = new THREE.Vector3(-startTan.z, 0, startTan.x).normalize();

    // Grid placement sampled along track curve (facing forward, ready to race)
    const numCP = this.trackData.checkpoints.length;
    const gridPositions = [
      { u: 0.085, col: 1 },
      { u: 0.075, col: -1 },
      { u: 0.065, col: 1 },
      { u: 0.055, col: -1 }, // Player starts in row 2
      { u: 0.045, col: 1 },
      { u: 0.035, col: -1 },
      { u: 0.025, col: 1 },
      { u: 0.015, col: -1 }
    ];

    const playerGridIndex = 3;

    // 1. Create Player Car Entity
    const pMesh = CarModelBuilder.createCarMesh(this.playerCarData);
    const pMarker = CarModelBuilder.createPlayerIndicator();
    pMesh.add(pMarker);
    this.scene.add(pMesh);

    this.playerCar = {
      isPlayer: true,
      data: this.playerCarData,
      mesh: pMesh,
      marker: pMarker,
      pos: new THREE.Vector3(),
      vel: new THREE.Vector3(),
      speed: 0,
      heading: 0,
      lap: 1,
      lastCheckpoint: Math.floor(gridPositions[playerGridIndex].u * numCP),
      checkpointsPassed: 0,
      lapProgress: gridPositions[playerGridIndex].u,
      totalProgress: gridPositions[playerGridIndex].u,
      finished: false,
      finishTime: 0,
      driftFactor: 0,
      gridIndex: playerGridIndex
    };
    this.positionCarOnGrid(this.playerCar, gridPositions[playerGridIndex]);
    this.allRacers.push(this.playerCar);

    // 2. Create 7 AI Cars
    let aiIndex = 0;
    gridPositions.forEach((gridPos, idx) => {
      if (idx === playerGridIndex) return;

      const aiCarData = remainingCars[aiIndex % remainingCars.length];
      aiIndex++;

      const aiMesh = CarModelBuilder.createCarMesh(aiCarData);
      this.scene.add(aiMesh);

      // Distinct AI personality: speed multiplier, lane offset
      const aiSpeedMod = 0.88 + Math.random() * 0.16;
      const laneOffset = (Math.random() - 0.5) * 4.5;

      const aiRacer = {
        isPlayer: false,
        data: aiCarData,
        mesh: aiMesh,
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        speed: 0,
        heading: 0,
        lap: 1,
        lastCheckpoint: Math.floor(gridPos.u * numCP),
        checkpointsPassed: 0,
        lapProgress: gridPos.u,
        totalProgress: gridPos.u,
        finished: false,
        finishTime: 0,
        speedMultiplier: aiSpeedMod,
        laneOffset: laneOffset,
        gridIndex: idx
      };
      this.positionCarOnGrid(aiRacer, gridPos);
      this.aiCars.push(aiRacer);
      this.allRacers.push(aiRacer);
    });

    // Initial Camera position behind player
    this.updateCamera(1.0);
    this.updateHUD();
    this.startCountdown();

    if (!this.animationId) {
      this.clock.start();
      this.animate();
    }
  }

  positionCarOnGrid(car, gridPos) {
    const curve = this.trackData.curve;
    const pt = curve.getPointAt(gridPos.u);
    const tan = curve.getTangentAt(gridPos.u).normalize();
    const norm = new THREE.Vector3(-tan.z, 0, tan.x).normalize();

    const spawnPos = pt.clone().addScaledVector(norm, gridPos.col * 2.8);
    spawnPos.y = pt.y; // Correct 3D track height
    car.pos.copy(spawnPos);
    car.mesh.position.copy(spawnPos);

    car.heading = Math.atan2(tan.x, tan.z);
    car.mesh.rotation.y = car.heading;
  }

  startCountdown() {
    this.raceState = 'countdown';
    this.countdownTimer = 3;
    const overlay = document.getElementById('countdown-overlay');
    const textEl = document.getElementById('countdown-text');

    if (overlay && textEl) {
      overlay.style.display = 'flex';
      textEl.innerText = '3';
      textEl.className = 'countdown-anim';
      window.soundManager.playCountdownBeep(false);

      const interval = setInterval(() => {
        this.countdownTimer--;
        if (this.countdownTimer > 0) {
          textEl.innerText = this.countdownTimer.toString();
          textEl.className = '';
          void textEl.offsetWidth; // retrigger css anim
          textEl.className = 'countdown-anim';
          window.soundManager.playCountdownBeep(false);
        } else if (this.countdownTimer === 0) {
          textEl.innerText = '¡YA!';
          textEl.className = 'countdown-anim go';
          window.soundManager.playCountdownBeep(true);
          this.raceState = 'racing';
        } else {
          clearInterval(interval);
          overlay.style.display = 'none';
        }
      }, 950);
    } else {
      this.raceState = 'racing';
    }
  }

  initInputListeners() {
    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) this.input.forward = 1;
      if (['ArrowDown', 'KeyS'].includes(e.code)) this.input.forward = -1;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) this.input.steer = -1;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.input.steer = 1;
      if (e.code === 'Space') this.input.handbrake = true;
      if (e.code === 'KeyR') this.resetPlayerCar();
    });

    window.addEventListener('keyup', (e) => {
      if (['ArrowUp', 'KeyW'].includes(e.code) && this.input.forward === 1) this.input.forward = 0;
      if (['ArrowDown', 'KeyS'].includes(e.code) && this.input.forward === -1) this.input.forward = 0;
      if (['ArrowLeft', 'KeyA'].includes(e.code) && this.input.steer === -1) this.input.steer = 0;
      if (['ArrowRight', 'KeyD'].includes(e.code) && this.input.steer === 1) this.input.steer = 0;
      if (e.code === 'Space') this.input.handbrake = false;
    });

    // Mobile touch controls setup
    this.bindTouchButton('btn-left', () => { this.input.steer = -1; }, () => { if (this.input.steer === -1) this.input.steer = 0; });
    this.bindTouchButton('btn-right', () => { this.input.steer = 1; }, () => { if (this.input.steer === 1) this.input.steer = 0; });
    this.bindTouchButton('btn-gas', () => { this.input.forward = 1; }, () => { if (this.input.forward === 1) this.input.forward = 0; });
    this.bindTouchButton('btn-brake', () => { this.input.forward = -1; }, () => { if (this.input.forward === -1) this.input.forward = 0; });

    const btnReset = document.getElementById('btn-reset');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        window.soundManager.playClick();
        this.resetPlayerCar();
      });
    }
  }

  bindTouchButton(id, onPress, onRelease) {
    const el = document.getElementById(id);
    if (!el) return;

    const startHandler = (e) => {
      e.preventDefault();
      el.classList.add('active');
      window.soundManager.resume();
      onPress();
    };

    const endHandler = (e) => {
      e.preventDefault();
      el.classList.remove('active');
      onRelease();
    };

    el.addEventListener('touchstart', startHandler, { passive: false });
    el.addEventListener('touchend', endHandler, { passive: false });
    el.addEventListener('touchcancel', endHandler, { passive: false });
    el.addEventListener('mousedown', startHandler);
    el.addEventListener('mouseup', endHandler);
    el.addEventListener('mouseleave', endHandler);
  }

  resetPlayerCar() {
    if (!this.playerCar || !this.trackData) return;
    // Find closest track point and reposition facing track forward
    const curve = this.trackData.curve;
    const u = this.playerCar.lapProgress;
    const pt = curve.getPointAt(u);
    const tan = curve.getTangentAt(u).normalize();

    this.playerCar.pos.set(pt.x, pt.y, pt.z);
    this.playerCar.mesh.position.copy(this.playerCar.pos);
    this.playerCar.heading = Math.atan2(tan.x, tan.z);
    this.playerCar.mesh.rotation.y = this.playerCar.heading;
    this.playerCar.mesh.rotation.x = -Math.asin(tan.y || 0);
    this.playerCar.speed = 0;
    this.playerCar.vel.set(0, 0, 0);
    this.updateCamera(1.0);
  }

  initDustParticles() {
    this.dustParticles = [];
    const geom = new THREE.DodecahedronGeometry(0.24, 0);
    for (let i = 0; i < 40; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0x8d6e63,
        transparent: true,
        opacity: 0.65
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.visible = false;
      this.scene.add(mesh);
      this.dustParticles.push({ mesh, life: 0, maxLife: 0.55, vel: new THREE.Vector3() });
    }
    this.dustIndex = 0;
  }

  spawnDust(pos) {
    if (!this.dustParticles || this.dustParticles.length === 0) return;
    const p = this.dustParticles[this.dustIndex];
    this.dustIndex = (this.dustIndex + 1) % this.dustParticles.length;
    p.mesh.position.set(pos.x + (Math.random() - 0.5) * 0.8, 0.22, pos.z + (Math.random() - 0.5) * 0.8);
    p.mesh.visible = true;
    p.life = 0.55;
    p.maxLife = 0.55;
    p.vel.set((Math.random() - 0.5) * 1.5, 1.2 + Math.random() * 1.5, (Math.random() - 0.5) * 1.5);
    p.mesh.scale.setScalar(0.7 + Math.random() * 0.6);
  }

  updateDustParticles(dt) {
    if (!this.dustParticles) return;
    this.dustParticles.forEach(p => {
      if (p.life > 0) {
        p.life -= dt;
        p.mesh.position.addScaledVector(p.vel, dt);
        p.vel.y -= 2.5 * dt;
        const alpha = Math.max(0, p.life / p.maxLife);
        p.mesh.material.opacity = alpha * 0.65;
        p.mesh.scale.multiplyScalar(1 + dt * 1.6);
        if (p.life <= 0) p.mesh.visible = false;
      }
    });
  }

  update(dt) {
    if (this.raceState === 'racing') {
      this.raceTime += dt;
    }

    // 1. Update Player Car Physics
    this.updatePlayerCar(dt);

    // 2. Update AI Cars
    this.updateAICars(dt);

    // 3. Car-to-Car Collisions
    this.resolveCarCollisions();

    // 4. Update Progress & Race Positions
    this.updateRaceStandings();

    // 5. Update Camera
    this.updateCamera(dt);

    // 6. Sound & HUD Updates
    this.updateAudioAndHUD();

    // 7. Update Dust Particles
    this.updateDustParticles(dt);

    // 8. Render Mini-map
    this.renderMinimap();
  }

  getDirtPenalties(category) {
    switch (category) {
      case 'SUV':
        return {
          speedMult: 0.90,     // 10% penalty
          accelMult: 0.88,
          badgeText: '[ ZONA DE TIERRA // PENALIZACIÓN SUV -10% ]'
        };
      case 'SEDAN':
        return {
          speedMult: 0.75,     // 25% penalty
          accelMult: 0.72,
          badgeText: '[ ZONA DE TIERRA // PENALIZACIÓN SEDÁN -25% ]'
        };
      case 'DEPORTIVO':
      default:
        return {
          speedMult: 0.50,     // 50% penalty
          accelMult: 0.50,
          badgeText: '[ ZONA DE TIERRA // PENALIZACIÓN DEPORTIVO -50% ]'
        };
    }
  }

  updatePlayerCar(dt) {
    const car = this.playerCar;
    if (!car) return;
    const p = car.data.physics;

    // Check if player is currently in a dirt zone
    const inDirt = TrackBuilder.isPointInDirtZone(car.lapProgress, this.trackData.config.dirtZones);
    car.inDirt = inDirt;

    const dirtPen = this.getDirtPenalties(car.data.category);
    const maxAllowedSpeed = inDirt ? (p.maxSpeed * dirtPen.speedMult) : p.maxSpeed;
    const accelRate = inDirt ? (p.accel * dirtPen.accelMult) : p.accel;

    if (this.raceState === 'racing' && !car.finished) {
      // Acceleration & Braking
      if (this.input.forward === 1) {
        if (car.speed < maxAllowedSpeed) {
          car.speed += accelRate * dt;
        } else if (car.speed > maxAllowedSpeed) {
          // Entering mud/dirt causes rapid deceleration down to dirt speed
          car.speed = Math.max(maxAllowedSpeed, car.speed - 22.0 * dt);
        }
      } else if (this.input.forward === -1) {
        if (car.speed > 1) {
          car.speed -= p.brake * dt;
        } else {
          car.speed -= accelRate * 0.8 * dt;
          if (car.speed < -p.reverse) car.speed = -p.reverse;
        }
      } else {
        // Natural friction coasting
        if (car.speed > 0) {
          car.speed = Math.max(0, car.speed - 8.0 * dt);
        } else if (car.speed < 0) {
          car.speed = Math.min(0, car.speed + 8.0 * dt);
        }
      }

      // Handbrake
      if (this.input.handbrake) {
        car.speed *= Math.pow(0.5, dt * 10);
      }

      // Steering (scaled by current speed, turning faster when moving)
      if (this.input.steer !== 0 && Math.abs(car.speed) > 0.3) {
        const speedRatio = Math.min(1, Math.abs(car.speed) / (p.maxSpeed * 0.45));
        const steerDir = Math.sign(car.speed) * this.input.steer;
        car.heading -= steerDir * p.turnRate * speedRatio * dt;
      }
    } else if (car.finished) {
      // Auto-brake upon finishing
      car.speed = Math.max(0, car.speed - 12.0 * dt);
    } else {
      car.speed = 0;
    }

    // Forward direction vector
    const forwardX = Math.sin(car.heading);
    const forwardZ = Math.cos(car.heading);

    // Lateral slide & drift physics
    const targetVelX = forwardX * car.speed;
    const targetVelZ = forwardZ * car.speed;

    const dirtGrip = car.data.category === 'SUV' ? 0.94 : (car.data.category === 'SEDAN' ? 0.86 : 0.72);
    const grip = (this.input.handbrake || (car.data.category === 'DEPORTIVO' && Math.abs(this.input.steer) > 0.5 && car.speed > 18) || inDirt)
      ? p.driftFriction * (inDirt ? dirtGrip : 1.0)
      : p.grip;

    car.vel.x = THREE.MathUtils.lerp(car.vel.x, targetVelX, grip);
    car.vel.z = THREE.MathUtils.lerp(car.vel.z, targetVelZ, grip);

    // Calculate drift factor for tire screech sound
    const lateralSpeed = Math.abs(-forwardZ * car.vel.x + forwardX * car.vel.z);
    car.driftFactor = Math.min(1, lateralSpeed / 5.5);

    // Off-road check & 3D track elevation tracking
    if (this.trackData) {
      const u = this.getClosestSplineU(car.pos);
      const trackPt = this.trackData.curve.getPointAt(u);
      const trackTan = this.trackData.curve.getTangentAt(u).normalize();
      const distFromCenter = car.pos.distanceTo(new THREE.Vector3(trackPt.x, car.pos.y, trackPt.z));
      const halfRoad = this.trackData.config.roadWidth / 2 + 1.2;

      if (distFromCenter > halfRoad) {
        car.speed *= Math.pow(0.85, dt * 8); // off-road grass friction
        const groundTargetY = distFromCenter > (halfRoad + 6) ? 0.2 : trackPt.y;
        car.pos.y = THREE.MathUtils.lerp(car.pos.y, groundTargetY, Math.min(1, 8.0 * dt));
      } else {
        // Track surface 3D elevation
        car.pos.y = THREE.MathUtils.lerp(car.pos.y, trackPt.y, Math.min(1, 18.0 * dt));
      }

      // Slope pitch tilt (up / down hills)
      const targetPitch = -Math.asin(Math.max(-0.6, Math.min(0.6, trackTan.y)));
      car.mesh.rotation.x = THREE.MathUtils.lerp(car.mesh.rotation.x, targetPitch, Math.min(1, 10.0 * dt));
    }

    // Apply movement
    car.pos.x += car.vel.x * dt;
    car.pos.z += car.vel.z * dt;
    car.mesh.position.copy(car.pos);
    car.mesh.rotation.y = car.heading;

    // Dirt dust emission
    if (inDirt && Math.abs(car.speed) > 3) {
      this.spawnDust(car.pos);
    }

    // Animate wheels
    if (car.mesh.userData.wheels) {
      const wheelSpin = (car.speed / 0.4) * dt;
      car.mesh.userData.wheels.forEach((w, idx) => {
        w.rotation.x += wheelSpin;
        // Front wheels turn with steer
        if (idx < 2) {
          w.rotation.y = -this.input.steer * 0.38;
        }
      });
    }

    // Rotate player marker
    if (car.marker) {
      car.marker.rotation.y += dt * 3;
    }
  }

  updateAICars(dt) {
    if (this.raceState !== 'racing') return;
    const curve = this.trackData.curve;
    const roadWidth = this.trackData.config.roadWidth;

    this.aiCars.forEach(ai => {
      if (ai.finished) {
        ai.speed = Math.max(0, ai.speed - 10.0 * dt);
        return;
      }

      const p = ai.data.physics;
      const inDirt = TrackBuilder.isPointInDirtZone(ai.lapProgress, this.trackData.config.dirtZones);
      ai.inDirt = inDirt;

      const aiDirtPen = this.getDirtPenalties(ai.data.category);
      const targetMaxSpeed = inDirt
        ? (p.maxSpeed * aiDirtPen.speedMult * ai.speedMultiplier)
        : (p.maxSpeed * ai.speedMultiplier);
      const accelRate = inDirt ? (p.accel * aiDirtPen.accelMult) : (p.accel * 0.9);

      // Follow track spline forward
      let lookAheadU = (ai.lapProgress + 0.04) % 1.0;
      const lookPt = curve.getPointAt(lookAheadU);
      const lookTan = curve.getTangentAt(lookAheadU).normalize();
      const lookNorm = new THREE.Vector3(-lookTan.z, 0, lookTan.x).normalize();

      // Apply assigned lane offset
      const targetPos = lookPt.clone().addScaledVector(lookNorm, ai.laneOffset);

      // Desired angle
      const diffX = targetPos.x - ai.pos.x;
      const diffZ = targetPos.z - ai.pos.z;
      const desiredAngle = Math.atan2(diffX, diffZ);

      // Smoothly steer towards desired angle
      let angleDiff = desiredAngle - ai.heading;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

      const steerAmount = Math.max(-1, Math.min(1, angleDiff * 3.5));
      ai.heading += steerAmount * p.turnRate * dt;

      // Speed control: AI brakes on sharp turns and slows on dirt
      let adjustedTargetSpeed = targetMaxSpeed;
      if (Math.abs(angleDiff) > 0.4) {
        const cornerPenalty = ai.data.category === 'DEPORTIVO' ? 0.6 : (ai.data.category === 'SUV' ? 0.85 : 0.72);
        adjustedTargetSpeed *= cornerPenalty;
      }

      if (ai.speed < adjustedTargetSpeed) {
        ai.speed = Math.min(adjustedTargetSpeed, ai.speed + accelRate * dt);
      } else {
        ai.speed = Math.max(adjustedTargetSpeed, ai.speed - p.brake * dt);
      }

      if (inDirt && Math.abs(ai.speed) > 4 && Math.random() > 0.65) {
        this.spawnDust(ai.pos);
      }

      // Move forward in 3D
      const fwdX = Math.sin(ai.heading);
      const fwdZ = Math.cos(ai.heading);
      ai.pos.x += fwdX * ai.speed * dt;
      ai.pos.z += fwdZ * ai.speed * dt;
      ai.pos.y = THREE.MathUtils.lerp(ai.pos.y, targetPos.y, Math.min(1, 18.0 * dt));

      ai.mesh.position.copy(ai.pos);
      ai.mesh.rotation.y = ai.heading;
      ai.mesh.rotation.x = THREE.MathUtils.lerp(ai.mesh.rotation.x, -Math.asin(Math.max(-0.6, Math.min(0.6, lookTan.y))), Math.min(1, 10.0 * dt));

      // Wheels
      if (ai.mesh.userData.wheels) {
        const spin = (ai.speed / 0.4) * dt;
        ai.mesh.userData.wheels.forEach((w, idx) => {
          w.rotation.x += spin;
          if (idx < 2) w.rotation.y = THREE.MathUtils.clamp(angleDiff, -0.35, 0.35);
        });
      }
    });
  }

  resolveCarCollisions() {
    const racers = this.allRacers;
    const hitRadius = 1.6;

    for (let i = 0; i < racers.length; i++) {
      for (let j = i + 1; j < racers.length; j++) {
        const r1 = racers[i];
        const r2 = racers[j];

        const dx = r2.pos.x - r1.pos.x;
        const dz = r2.pos.z - r1.pos.z;
        const distSq = dx * dx + dz * dz;

        if (distSq < hitRadius * hitRadius && distSq > 0.001) {
          const dist = Math.sqrt(distSq);
          const overlap = (hitRadius - dist) * 0.5;
          const nx = dx / dist;
          const nz = dz / dist;

          // Push apart
          r1.pos.x -= nx * overlap;
          r1.pos.z -= nz * overlap;
          r2.pos.x += nx * overlap;
          r2.pos.z += nz * overlap;

          r1.mesh.position.copy(r1.pos);
          r2.mesh.position.copy(r2.pos);

          // Elastic bounce
          r1.speed *= 0.92;
          r2.speed *= 0.92;

          if (r1.isPlayer || r2.isPlayer) {
            window.soundManager.playCollision();
          }
        }
      }
    }
  }

  getClosestSplineU(pos) {
    if (!this.trackData) return 0;
    const checkpoints = this.trackData.checkpoints;
    let closestIdx = 0;
    let minDistSq = Infinity;

    for (let i = 0; i < checkpoints.length; i++) {
      const cp = checkpoints[i];
      const dx = pos.x - cp.pos.x;
      const dz = pos.z - cp.pos.z;
      const dSq = dx * dx + dz * dz;
      if (dSq < minDistSq) {
        minDistSq = dSq;
        closestIdx = i;
      }
    }

    return checkpoints[closestIdx].u;
  }

  updateRaceStandings() {
    if (!this.trackData) return;
    const checkpoints = this.trackData.checkpoints;
    const numCP = checkpoints.length;

    this.allRacers.forEach(racer => {
      // Find closest checkpoint using 2D horizontal distance (ignoring vertical elevation difference)
      let closestIdx = racer.lastCheckpoint;
      let minDistSq = Infinity;

      // Look in window around last checkpoint for robust sequential progression
      for (let offset = -2; offset <= 5; offset++) {
        const idx = (racer.lastCheckpoint + offset + numCP) % numCP;
        const cp = checkpoints[idx];
        const dx = racer.pos.x - cp.pos.x;
        const dz = racer.pos.z - cp.pos.z;
        const dSq = dx * dx + dz * dz;
        if (dSq < minDistSq) {
          minDistSq = dSq;
          closestIdx = idx;
        }
      }

      // Checkpoint increment logic with forward progress validation
      let forwardStep = (closestIdx - racer.lastCheckpoint + numCP) % numCP;

      if (forwardStep === 1 || forwardStep === 2) {
        // Advanced forward
        racer.checkpointsPassed += forwardStep;
        racer.lastCheckpoint = closestIdx;

        // Check if completing lap (crossing CP 0 having visited majority of track)
        const crossedFinish = (closestIdx === 0 || (racer.lastCheckpoint >= numCP - 3 && closestIdx <= 2)) && racer.checkpointsPassed >= Math.floor(numCP * 0.65);
        if (crossedFinish) {
          racer.lap++;
          racer.checkpointsPassed = 0;
          if (racer.lap > this.maxLaps) {
            racer.finished = true;
            racer.finishTime = this.raceTime;
            if (racer.isPlayer) {
              window.soundManager.playVictory();
              setTimeout(() => this.showRaceResults(), 1200);
            }
          }
        }
      } else if (forwardStep === 0 || forwardStep === numCP - 1) {
        // Slight drift or minor backward correction
        racer.lastCheckpoint = closestIdx;
      }

      racer.lapProgress = checkpoints[racer.lastCheckpoint].u;
      racer.totalProgress = Math.min(this.maxLaps, (racer.lap - 1) + racer.lapProgress);
    });

    // Sort: Finished racers ranked by their finishTime, ongoing racers by totalProgress
    this.allRacers.sort((a, b) => {
      if (a.finished && b.finished) {
        return a.finishTime - b.finishTime;
      }
      if (a.finished) return -1;
      if (b.finished) return 1;
      return b.totalProgress - a.totalProgress;
    });
  }

  updateCamera(dt) {
    if (!this.playerCar || !this.camera) return;
    const car = this.playerCar;

    // Follow camera: behind and slightly above the car
    const dist = 7.8 + (car.speed / car.data.physics.maxSpeed) * 2.6;
    const height = 3.6 + Math.max(0, -car.mesh.rotation.x * 2.2);

    const fwdX = Math.sin(car.heading);
    const fwdZ = Math.cos(car.heading);

    const targetCamX = car.pos.x - fwdX * dist;
    const targetCamY = Math.max(1.2, car.pos.y + height);
    const targetCamZ = car.pos.z - fwdZ * dist;

    // Smooth lerp
    const lerpSpeed = 7.5 * dt;
    this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, targetCamX, Math.min(1, lerpSpeed));
    this.camera.position.y = Math.max(1.0, THREE.MathUtils.lerp(this.camera.position.y, targetCamY, Math.min(1, lerpSpeed)));
    this.camera.position.z = THREE.MathUtils.lerp(this.camera.position.z, targetCamZ, Math.min(1, lerpSpeed));

    // Look ahead of car in 3D
    const lookTarget = new THREE.Vector3(
      car.pos.x + fwdX * 4.2,
      car.pos.y + 1.2 + car.mesh.rotation.x * 1.5,
      car.pos.z + fwdZ * 4.2
    );
    this.camera.lookAt(lookTarget);
  }

  updateAudioAndHUD() {
    if (!this.playerCar) return;
    const car = this.playerCar;
    const speedRatio = Math.abs(car.speed) / car.data.physics.maxSpeed;

    // Update sound engine
    window.soundManager.updateEngine(speedRatio, this.input.forward === 1, this.raceState === 'racing');
    window.soundManager.setTireScreech(car.driftFactor);

    // Update HUD DOM
    const posIndex = this.allRacers.indexOf(car) + 1;
    const suffixes = ['ST', 'ND', 'RD', 'TH', 'TH', 'TH', 'TH', 'TH'];
    const sfx = suffixes[posIndex - 1] || 'TH';
    const hudPos = document.getElementById('hud-pos');
    if (hudPos) hudPos.innerText = `${posIndex}${sfx} / 8`;

    const hudLap = document.getElementById('hud-lap');
    if (hudLap) {
      hudLap.innerText = car.lap > this.maxLaps ? 'FINAL' : `${Math.min(this.maxLaps, car.lap)} / ${this.maxLaps}`;
    }

    const kmh = Math.round(Math.abs(car.speed) * 3.6);
    const hudSpeed = document.getElementById('hud-speed');
    if (hudSpeed) {
      hudSpeed.innerText = kmh;
    }

    // Gear indicator
    const hudGear = document.getElementById('hud-gear');
    if (hudGear) {
      if (car.speed < -0.5) hudGear.innerText = 'R';
      else if (kmh < 18) hudGear.innerText = '1';
      else if (kmh < 36) hudGear.innerText = '2';
      else if (kmh < 58) hudGear.innerText = '3';
      else if (kmh < 80) hudGear.innerText = '4';
      else hudGear.innerText = '5';
    }

    const hudPhase = document.getElementById('hud-phase');
    if (hudPhase && this.trackData) {
      hudPhase.innerText = this.trackData.config.name;
    }

    const hudDirt = document.getElementById('hud-dirt-badge');
    if (hudDirt) {
      if (car.inDirt) {
        const dirtPen = this.getDirtPenalties(car.data.category);
        hudDirt.innerText = dirtPen.badgeText;
        hudDirt.style.display = 'flex';
      } else {
        hudDirt.style.display = 'none';
      }
    }
  }

  renderMinimap() {
    if (!this.minimapCtx || !this.trackData) return;
    const ctx = this.minimapCtx;
    const w = this.minimapCanvas.width;
    const h = this.minimapCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Compute or retrieve cached bounding box for accurate dynamic minimap fitting
    if (!this.trackData.bounds) {
      let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
      for (let i = 0; i <= 60; i++) {
        const pt = this.trackData.curve.getPointAt(i / 60);
        if (pt.x < minX) minX = pt.x;
        if (pt.x > maxX) maxX = pt.x;
        if (pt.z < minZ) minZ = pt.z;
        if (pt.z > maxZ) maxZ = pt.z;
      }
      const pad = 16;
      this.trackData.bounds = {
        minX: minX - pad,
        maxX: maxX + pad,
        minZ: minZ - pad,
        maxZ: maxZ + pad
      };
    }

    const { minX, maxX, minZ, maxZ } = this.trackData.bounds;
    const toMapX = (x) => ((x - minX) / (maxX - minX)) * (w - 20) + 10;
    const toMapY = (z) => ((z - minZ) / (maxZ - minZ)) * (h - 20) + 10;

    // Draw main track curve
    const curve = this.trackData.curve;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const pt = curve.getPointAt(i / 60);
      const mx = toMapX(pt.x);
      const my = toMapY(pt.z);
      if (i === 0) ctx.moveTo(mx, my);
      else ctx.lineTo(mx, my);
    }
    ctx.closePath();
    ctx.stroke();

    // Highlight dirt zones on the minimap line with bright orange
    if (this.trackData.config.dirtZones && this.trackData.config.dirtZones.length > 0) {
      ctx.strokeStyle = '#e67e22';
      ctx.lineWidth = 7;
      for (let zone of this.trackData.config.dirtZones) {
        ctx.beginPath();
        const startStep = Math.floor(zone.startU * 60);
        const endStep = Math.floor(zone.endU * 60);
        for (let s = startStep; s <= endStep; s++) {
          const pt = curve.getPointAt(s / 60);
          const mx = toMapX(pt.x);
          const my = toMapY(pt.z);
          if (s === startStep) ctx.moveTo(mx, my);
          else ctx.lineTo(mx, my);
        }
        ctx.stroke();
      }
    }

    // Draw finish line marker
    const startPt = curve.getPointAt(0);
    ctx.fillStyle = '#ffeb3b';
    ctx.beginPath();
    ctx.arc(toMapX(startPt.x), toMapY(startPt.z), 4, 0, Math.PI * 2);
    ctx.fill();

    // Draw AI cars
    this.aiCars.forEach(ai => {
      ctx.fillStyle = ai.data.color;
      ctx.beginPath();
      ctx.arc(toMapX(ai.pos.x), toMapY(ai.pos.z), 3.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Player car (pulsing green/cyan with white border)
    if (this.playerCar) {
      const px = toMapX(this.playerCar.pos.x);
      const py = toMapY(this.playerCar.pos.z);
      ctx.fillStyle = '#00ff88';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px, py, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  showRaceResults() {
    this.raceState = 'finished';
    window.soundManager.updateEngine(0, false, false);

    const modal = document.getElementById('results-modal');
    if (!modal) return;

    const playerPos = this.allRacers.indexOf(this.playerCar) + 1;
    const titleEl = document.getElementById('results-title');
    const tableBody = document.getElementById('results-tbody');
    const btnNext = document.getElementById('btn-next-phase');

    if (titleEl) {
      if (playerPos === 1) {
        titleEl.innerHTML = `¡VICTORIA! // 1ST PLACE`;
      } else if (playerPos <= 3) {
        titleEl.innerHTML = `PODIO FINAL // POS ${playerPos}`;
      } else {
        titleEl.innerHTML = `ETAPA COMPLETADA // POS ${playerPos}`;
      }
    }

    if (tableBody) {
      tableBody.innerHTML = '';
      this.allRacers.forEach((racer, idx) => {
        const tr = document.createElement('tr');
        if (racer.isPlayer) tr.className = 'player-row';

        const place = idx + 1;
        const placeBadge = place < 10 ? `[ 0${place} ]` : `[ ${place} ]`;
        const typeBadge = `<span class="type-tag ${racer.data.category.toLowerCase()}">${racer.data.category}</span>`;

        tr.innerHTML = `
          <td>${placeBadge}</td>
          <td><strong>${racer.data.name}</strong> ${racer.isPlayer ? '(TÚ)' : ''}</td>
          <td>${typeBadge}</td>
        `;
        tableBody.appendChild(tr);
      });
    }

    if (btnNext) {
      if (this.currentPhaseIndex < 2) {
        btnNext.innerText = `AVANZAR A FASE ${this.currentPhaseIndex + 2} >>`;
        btnNext.onclick = () => {
          window.soundManager.playClick();
          modal.style.display = 'none';
          this.setupPhase(this.currentPhaseIndex + 1, this.playerCarData.id);
        };
      } else {
        btnNext.innerText = `VER GRAN PREMIO FINAL >>`;
        btnNext.onclick = () => {
          window.soundManager.playClick();
          modal.style.display = 'none';
          window.showGrandFinale(this.playerCarData);
        };
      }
    }

    modal.style.display = 'flex';
  }

  updateHUD() {
    this.updateAudioAndHUD();
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    const dt = Math.min(0.05, this.clock.getDelta());
    this.update(dt);
    this.renderer.render(this.scene, this.camera);
  }
}

window.RacingGame = RacingGame;
