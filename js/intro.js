// Intro animation with toy cars spinning around, letter delivery, and car selection garage

class IntroManager {
  constructor() {
    this.canvas = document.getElementById('intro-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.animationId = null;
    this.state = 'animating'; // 'animating', 'delivered'
    this.time = 0;

    // 4 cute stylized toy cars spinning around
    this.toyCars = [
      { color: '#e74c3c', stripe: '#f1c40f', angle: 0, radius: 110, speed: 2.2, size: 28 },
      { color: '#3498db', stripe: '#ffffff', angle: Math.PI / 2, radius: 140, speed: 2.5, size: 26 },
      { color: '#f1c40f', stripe: '#e67e22', angle: Math.PI, radius: 120, speed: 2.0, size: 27 },
      { color: '#9b59b6', stripe: '#00d2d3', angle: Math.PI * 1.5, radius: 150, speed: 2.4, size: 29 }
    ];

    this.particles = [];
    this.skidMarks = [];
    this.selectedCarId = CAR_CATALOG[0].id;
    this.garageScene = null;
    this.garageCamera = null;
    this.garageRenderer = null;
    this.garageCarMesh = null;

    this.initCanvas();
    this.startAnimation();
    this.setupLetterTimer();
    this.initGarageTurntable();
  }

  initCanvas() {
    if (!this.canvas) return;
    const resize = () => {
      this.canvas.width = Math.min(window.innerWidth, 600);
      this.canvas.height = 360;
    };
    resize();
    window.addEventListener('resize', resize);
  }

  startAnimation() {
    const loop = () => {
      this.time += 0.025;
      this.render();
      if (this.state === 'animating' || this.particles.length > 0) {
        this.animationId = requestAnimationFrame(loop);
      }
    };
    this.animationId = requestAnimationFrame(loop);
  }

  setupLetterTimer() {
    // After 3.5 seconds of cute drifting, the cars deliver the letter
    setTimeout(() => {
      this.deliverLetter();
    }, 3200);
  }

  deliverLetter() {
    this.state = 'delivered';
    window.soundManager.playHonk();
    window.soundManager.playCardOpen();

    // Spawn confetti & heart particles
    for (let i = 0; i < 60; i++) {
      this.particles.push({
        x: this.canvas.width / 2,
        y: this.canvas.height / 2,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 2,
        color: ['#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#f368e0'][Math.floor(Math.random() * 5)],
        size: 4 + Math.random() * 6,
        life: 1.0
      });
    }

    // Show letter card in DOM
    const letterCard = document.getElementById('letter-card');
    if (letterCard) {
      letterCard.classList.remove('hidden');
      letterCard.classList.add('pop-in');
    }
  }

  render() {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    // Draw asphalt track circle with dashed lane
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 90;
    ctx.beginPath();
    ctx.arc(cx, cy, 130, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(241, 196, 15, 0.3)';
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 12]);
    ctx.beginPath();
    ctx.arc(cx, cy, 130, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw skid marks
    ctx.strokeStyle = 'rgba(20, 20, 20, 0.25)';
    ctx.lineWidth = 4;
    this.skidMarks.forEach(s => {
      ctx.beginPath();
      ctx.arc(cx, cy, s.r, s.angle - 0.15, s.angle);
      ctx.stroke();
    });

    // Center Gift Box / Hot Wheels Delivery Package
    ctx.save();
    ctx.translate(cx, cy);
    if (this.state === 'animating') {
      const wobble = Math.sin(this.time * 8) * 0.06;
      ctx.rotate(wobble);
    }
    // Box shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(0, 32, 38, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Box body
    ctx.fillStyle = '#ff4757';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(-30, -25, 60, 50, 8) : ctx.rect(-30, -25, 60, 50);
    ctx.fill();

    // Golden Ribbon
    ctx.fillStyle = '#ffbe76';
    ctx.fillRect(-8, -25, 16, 50);
    ctx.fillRect(-30, -7, 60, 14);

    // Ribbon Bow
    ctx.fillStyle = '#f6e58d';
    ctx.beginPath();
    ctx.ellipse(-12, -28, 12, 7, -0.4, 0, Math.PI * 2);
    ctx.ellipse(12, -28, 12, 7, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Hot Wheels badge icon on box
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏎️ 30', 0, 0);

    ctx.restore();

    // Draw Toy Cars
    this.toyCars.forEach(car => {
      if (this.state === 'animating') {
        car.angle += car.speed * 0.025;
        // Record skid mark
        if (Math.random() > 0.4) {
          this.skidMarks.push({ r: car.radius, angle: car.angle });
          if (this.skidMarks.length > 50) this.skidMarks.shift();
        }
      }

      const x = cx + Math.cos(car.angle) * car.radius;
      const y = cy + Math.sin(car.angle) * car.radius;
      const heading = car.angle + Math.PI / 2;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(heading);

      // Car shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.ellipse(0, 2, car.size * 0.6, car.size * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();

      // Car Body
      ctx.fillStyle = car.color;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(-car.size * 0.45, -car.size * 0.8, car.size * 0.9, car.size * 1.6, 6) : ctx.rect(-car.size * 0.45, -car.size * 0.8, car.size * 0.9, car.size * 1.6);
      ctx.fill();

      // Racing stripe
      ctx.fillStyle = car.stripe;
      ctx.fillRect(-car.size * 0.12, -car.size * 0.8, car.size * 0.24, car.size * 1.6);

      // Windshield
      ctx.fillStyle = '#1e272e';
      ctx.fillRect(-car.size * 0.32, -car.size * 0.25, car.size * 0.64, car.size * 0.45);

      // Headlight beams
      ctx.fillStyle = 'rgba(255, 242, 0, 0.4)';
      ctx.beginPath();
      ctx.moveTo(-car.size * 0.3, car.size * 0.8);
      ctx.lineTo(-car.size * 0.6, car.size * 1.8);
      ctx.lineTo(car.size * 0.6, car.size * 1.8);
      ctx.lineTo(car.size * 0.3, car.size * 0.8);
      ctx.fill();

      ctx.restore();
    });

    // Update & draw particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15; // gravity
      p.life -= 0.02;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }
  }

  initGarageTurntable() {
    const canvas = document.getElementById('garage-canvas');
    if (!canvas) return;

    // Use non-zero fallback if container is hidden during initial load
    const container = canvas.parentElement;
    const w = (container && container.clientWidth > 0) ? container.clientWidth : (canvas.clientWidth || 440);
    const h = (container && container.clientHeight > 0) ? container.clientHeight : (canvas.clientHeight || 220);

    this.garageScene = new THREE.Scene();
    this.garageCamera = new THREE.PerspectiveCamera(45, (w > 0 && h > 0) ? (w / h) : (16 / 9), 0.1, 100);
    this.garageCamera.position.set(4.5, 3.2, 5.5);
    this.garageCamera.lookAt(0, 0.6, 0);

    this.garageRenderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    this.garageRenderer.setSize(w, h, false);
    this.garageRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.garageRenderer.shadowMap.enabled = true;

    // Turntable platform
    const platGeom = new THREE.CylinderGeometry(2.8, 3.0, 0.25, 32);
    const platMat = new THREE.MeshStandardMaterial({
      color: 0x1f2430,
      metalness: 0.8,
      roughness: 0.2
    });
    const platform = new THREE.Mesh(platGeom, platMat);
    platform.position.y = -0.12;
    this.garageScene.add(platform);

    // Neon ring around turntable
    const ringGeom = new THREE.TorusGeometry(2.9, 0.05, 8, 32);
    ringGeom.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.position.y = 0.01;
    this.garageScene.add(ring);

    // Lights
    const hemi = new THREE.HemisphereLight(0xffffff, 0x334466, 0.9);
    this.garageScene.add(hemi);

    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(5, 10, 7);
    this.garageScene.add(dir);

    const spot = new THREE.SpotLight(0x00f0ff, 2.0);
    spot.position.set(-5, 8, -3);
    spot.lookAt(0, 0, 0);
    this.garageScene.add(spot);

    // Populate car grid UI
    this.populateCarSelectUI();
    this.updateGaragePreview(CAR_CATALOG[0]);

    // Interactive drag to rotate 3D car model in garage
    let isDragging = false;
    let prevX = 0;
    this.garageRotVelocity = 0;

    const onStart = (clientX) => {
      isDragging = true;
      prevX = clientX;
      this.garageRotVelocity = 0;
    };
    const onMove = (clientX) => {
      if (!isDragging || !this.garageCarMesh) return;
      const delta = clientX - prevX;
      prevX = clientX;
      this.garageCarMesh.rotation.y += delta * 0.018;
      this.garageRotVelocity = delta * 0.002;
    };
    const onEnd = () => { isDragging = false; };

    canvas.addEventListener('mousedown', (e) => onStart(e.clientX));
    window.addEventListener('mousemove', (e) => onMove(e.clientX));
    window.addEventListener('mouseup', onEnd);

    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) onStart(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) onMove(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener('touchend', onEnd);

    // Animate turntable
    const renderTurntable = () => {
      requestAnimationFrame(renderTurntable);
      if (this.garageCarMesh) {
        if (!isDragging) {
          this.garageCarMesh.rotation.y += 0.01 + this.garageRotVelocity;
          this.garageRotVelocity *= 0.94;
        }
      }
      this.garageRenderer.render(this.garageScene, this.garageCamera);
    };
    renderTurntable();

    window.addEventListener('resize', () => this.onGarageShown());
  }

  onGarageShown() {
    const canvas = document.getElementById('garage-canvas');
    if (!canvas) return;

    if (!this.garageRenderer) {
      this.initGarageTurntable();
      return;
    }

    const container = canvas.parentElement;
    const w = (container && container.clientWidth > 0) ? container.clientWidth : (canvas.clientWidth || 450);
    const h = (container && container.clientHeight > 0) ? container.clientHeight : (canvas.clientHeight || 220);

    if (this.garageRenderer && this.garageCamera) {
      this.garageCamera.aspect = (w > 0 && h > 0) ? (w / h) : (16 / 9);
      this.garageCamera.updateProjectionMatrix();
      this.garageRenderer.setSize(w, h, false);

      const car = CAR_CATALOG.find(c => c.id === this.selectedCarId) || CAR_CATALOG[0];
      this.updateGaragePreview(car);
    }
  }

  populateCarSelectUI() {
    const listEl = document.getElementById('car-cards-list');
    if (!listEl) return;

    listEl.innerHTML = '';
    CAR_CATALOG.forEach((car, idx) => {
      const card = document.createElement('div');
      card.className = `car-card ${idx === 0 ? 'selected' : ''}`;
      card.dataset.carId = car.id;

      const typeBadgeClass = car.category.toLowerCase();
      card.innerHTML = `
        <div class="card-color-dot" style="background-color: ${car.color}; box-shadow: 0 0 10px ${car.color};"></div>
        <div class="card-info">
          <h4>${car.name}</h4>
          <span class="type-badge ${typeBadgeClass}">${car.category}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        window.soundManager.playClick();
        document.querySelectorAll('.car-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedCarId = car.id;
        this.updateGaragePreview(car);
      });

      listEl.appendChild(card);
    });
  }

  updateGaragePreview(carData) {
    if (!this.garageScene) return;
    if (this.garageCarMesh) {
      this.garageScene.remove(this.garageCarMesh);
    }

    this.garageCarMesh = CarModelBuilder.createCarMesh(carData);
    this.garageCarMesh.position.set(0, 0, 0);
    this.garageScene.add(this.garageCarMesh);

    // Update details in DOM
    const nameEl = document.getElementById('garage-car-name');
    const realEl = document.getElementById('garage-car-real');
    const descEl = document.getElementById('garage-car-desc');
    const badgeEl = document.getElementById('garage-car-badge');
    const statSpeed = document.getElementById('stat-speed');
    const statHandling = document.getElementById('stat-handling');
    const statAccel = document.getElementById('stat-accel');

    if (nameEl) nameEl.innerText = carData.name;
    if (realEl) realEl.innerText = carData.realModel || '';
    if (descEl) descEl.innerText = carData.desc;
    if (badgeEl) {
      badgeEl.innerText = carData.category;
      badgeEl.className = `type-badge large ${carData.category.toLowerCase()}`;
    }

    if (statSpeed) statSpeed.style.width = `${carData.stats.speed}%`;
    if (statHandling) statHandling.style.width = `${carData.stats.handling}%`;
    if (statAccel) statAccel.style.width = `${carData.stats.accel}%`;
  }
}

window.IntroManager = IntroManager;
