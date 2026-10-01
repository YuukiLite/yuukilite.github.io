// Tracks with true 3D Elevation Levels, Distinct Circuit Shapes, Real Materials & PS2-era aesthetic

const TRACK_PHASES = [
  {
    phase: 1,
    name: "FASE 1: CIUDAD & VIADUCTO HOSPITAL HRT",
    subtitle: "Circuito urbano en cuadrícula con viaducto elevado sobre el Hospital Regional de Talca",
    skyColor: 0x64b5f6,
    fogColor: 0x90caf9,
    groundColor: 0x3d5a24,
    curbColorA: 0xe74c3c,
    curbColorB: 0xffffff,
    sunLight: 0xfff3e0,
    ambientLight: 0x81d4fa,
    roadWidth: 15,
    // Distinct Urban Grid Shape: Long avenue straights, sharp 90-degree city intersections,
    // and a dramatic elevated viaduct flyover loop around Hospital HRT and its helipad
    points: [
      new THREE.Vector3(0, 0.3, -130),     // Start/Finish straight on Avenida O'Higgins
      new THREE.Vector3(0, 0.3, -40),      // Fast braking zone before city corner
      new THREE.Vector3(45, 0.3, -35),     // Sharp 90° right turn into commercial street
      new THREE.Vector3(85, 2.5, -10),     // 90° left turn climbing onto viaduct ramp
      new THREE.Vector3(115, 6.8, 25),     // Elevated viaduct highway climbing up
      new THREE.Vector3(120, 9.8, 75),     // High flyover bridge beside Hospital HRT
      new THREE.Vector3(75, 9.5, 115),     // High sweeping 120° curve overlooking HRT helipad
      new THREE.Vector3(20, 5.5, 110),     // Descending viaduct ramp
      new THREE.Vector3(-30, 0.3, 85),     // Street-level touchdown into avenue
      new THREE.Vector3(-75, 0.3, 75),     // Sharp 90° right corner into South Boulevard
      new THREE.Vector3(-110, 0.3, 20),    // Residential boulevard straight
      new THREE.Vector3(-115, 0.3, -45),   // Sharp 90° left city corner
      new THREE.Vector3(-80, 0.3, -95),    // Technical city chicane
      new THREE.Vector3(-35, 0.3, -125)    // Final 90° right corner onto home straight
    ],
    // Alternative Route (Bypass running under the viaduct past Emergency Bay)
    alternateRoute: {
      name: "Atajo Avenida Urgencias HRT",
      splitU: 0.22,
      mergeU: 0.52,
      points: [
        new THREE.Vector3(50, 0.3, 10),
        new THREE.Vector3(58, 0.3, 55),
        new THREE.Vector3(45, 0.3, 90)
      ],
      isDirt: false
    },
    sceneryType: 'city_hospital',
    dirtZones: []
  },
  {
    phase: 2,
    name: "FASE 2: EL CAMPO // RUTA DOBLE & TIERRA",
    subtitle: "Circuito rural fluido en forma de riñón. Grandes curvas, horquilla del molino y sector de barro",
    skyColor: 0x54a0ff,
    fogColor: 0x74b9ff,
    groundColor: 0x556b2f,
    curbColorA: 0xd35400,
    curbColorB: 0xf5f6fa,
    sunLight: 0xffeaa7,
    ambientLight: 0x81ecec,
    roadWidth: 14.5,
    // Distinct Organic Kidney / Parabolic Countryside Shape:
    // Flowing sweeping high-speed curves across wheat pastures, uphill climb,
    // technical 180° Mill Hairpin, wide mud/dirt flat, and wooden creek bridge
    points: [
      new THREE.Vector3(0, 0.5, -120),     // Start straight between red barns
      new THREE.Vector3(40, 1.2, -105),    // Pasture straight
      new THREE.Vector3(95, 3.5, -70),     // Sweeping high-speed hill climb
      new THREE.Vector3(135, 6.0, -15),    // Wide open banked carousel
      new THREE.Vector3(140, 7.8, 40),     // Hill crest overlooking the valley
      new THREE.Vector3(100, 5.0, 85),     // Approach to Windmill Hairpin
      new THREE.Vector3(55, 2.5, 95),      // "Horquilla del Molino" 180° hairpin bend
      new THREE.Vector3(20, 1.0, 70),      // Hairpin exit into farm soil
      new THREE.Vector3(-15, 0.5, 40),     // Dirt sector S-curve entry
      new THREE.Vector3(-55, 1.0, 15),     // Muddy farmyard S-curve
      new THREE.Vector3(-95, 2.0, 45),     // Rolling dirt ridge
      new THREE.Vector3(-130, 3.5, 15),    // Orchard hill curve
      new THREE.Vector3(-135, 1.0, -45),   // Downhill creek crossing
      new THREE.Vector3(-90, 0.5, -95),    // Pasture chicane
      new THREE.Vector3(-40, 0.5, -118)    // Final bend joining home straight
    ],
    // Alternative Dirt Shortcut cutting through the farm barnyards
    alternateRoute: {
      name: "Atajo de Tierra Entre Graneros",
      splitU: 0.20,
      mergeU: 0.48,
      points: [
        new THREE.Vector3(85, 2.0, -25),
        new THREE.Vector3(70, 0.8, 20),
        new THREE.Vector3(45, 0.8, 55)
      ],
      isDirt: true
    },
    sceneryType: 'countryside',
    dirtZones: [
      { startU: 0.40, endU: 0.65, name: "Sector de Barro Rural" }
    ]
  },
  {
    phase: 3,
    name: "FASE 3: GRAN CORDILLERA & CIRCUITO NOCTURNO",
    subtitle: "Paso alpino de montaña a Y=17.5m con curvas cerradas, túnel y vistas a la metrópolis",
    skyColor: 0x0c1021,
    fogColor: 0x141a30,
    groundColor: 0x222836,
    curbColorA: 0x00f0ff,
    curbColorB: 0xff0055,
    sunLight: 0xfbc531,
    ambientLight: 0x3867d6,
    roadWidth: 15,
    // Distinct Serpentine Touge Pass Shape:
    // Tight mountain switchbacks climbing steep grades to Summit Peak (Y=17.5m),
    // lit Granite Mountain Tunnel arch, high suspension gorge bridge, and gravel runoff descent
    points: [
      new THREE.Vector3(0, 1.0, -135),     // Deep canyon floor starting straight
      new THREE.Vector3(30, 2.5, -125),    // Gorge curve
      new THREE.Vector3(75, 6.0, -95),     // Mountain switchback 1
      new THREE.Vector3(105, 9.5, -60),    // "Curva del Cóndor" technical hairpin
      new THREE.Vector3(70, 12.0, -25),    // Steep cliffside climb
      new THREE.Vector3(110, 14.5, 15),    // Switchback 2 climbing to summit
      new THREE.Vector3(135, 17.5, 65),    // "La Cumbre" Summit Peak (Y = 17.5m!)
      new THREE.Vector3(100, 15.5, 115),   // Summit overlook
      new THREE.Vector3(45, 12.5, 125),    // Granite Mountain Tunnel entry
      new THREE.Vector3(-15, 9.5, 115),    // Tunnel interior curve & exit
      new THREE.Vector3(-65, 7.0, 95),     // Gorge suspension viaduct bridge
      new THREE.Vector3(-115, 4.0, 60),    // Downhill serpentine switchback
      new THREE.Vector3(-130, 2.5, 5),     // Fast mountain chicane
      new THREE.Vector3(-110, 1.5, -55),   // Mountain gravel runoff zone
      new THREE.Vector3(-60, 1.0, -110)    // Canyon floor bridge back to finish straight
    ],
    alternateRoute: {
      name: "Atajo del Cañón de Montaña",
      splitU: 0.18,
      mergeU: 0.45,
      points: [
        new THREE.Vector3(80, 8.0, -40),
        new THREE.Vector3(85, 11.0, 5),
        new THREE.Vector3(105, 14.0, 45)
      ],
      isDirt: true
    },
    sceneryType: 'mountains_city',
    dirtZones: [
      { startU: 0.76, endU: 0.88, name: "Paso de Grava de Montaña" }
    ]
  }
];

class TrackBuilder {
  static buildTrack(phaseIndex, scene) {
    const config = TRACK_PHASES[phaseIndex] || TRACK_PHASES[0];
    const curve = new THREE.CatmullRomCurve3(config.points, true, 'centripetal', 0.5);
    const divisions = 480; // Dense slices for silky-smooth curves and elevation changes
    const roadWidth = config.roadWidth;
    const halfW = roadWidth / 2;
    const curbW = 1.35;

    const trackGroup = new THREE.Group();

    // 1. Asphalt & Road Ribbon with 3D Elevations
    const roadGeom = new THREE.BufferGeometry();
    const roadIndices = [];
    const roadVertices = [];
    const roadNormals = [];
    const roadUvs = [];
    const roadColors = [];

    // Curbs
    const curbLeftPos = [];
    const curbRightPos = [];
    const curbLeftColors = [];
    const curbRightColors = [];

    const colorA = new THREE.Color(config.curbColorA);
    const colorB = new THREE.Color(config.curbColorB);
    const asphaltColor = new THREE.Color(config.phase === 3 ? 0x222630 : 0x343842);
    const dirtColor = new THREE.Color(0x735338);

    for (let i = 0; i <= divisions; i++) {
      const u = i / divisions;
      const pt = curve.getPointAt(u);
      const tangent = curve.getTangentAt(u).normalize();
      
      // Calculate 3D normal vector perpendicular to tangent and up
      const approxUp = new THREE.Vector3(0, 1, 0);
      const normal = new THREE.Vector3().crossVectors(tangent, approxUp).normalize();
      const trueUp = new THREE.Vector3().crossVectors(normal, tangent).normalize();

      const pLeft = pt.clone().addScaledVector(normal, halfW);
      const pRight = pt.clone().addScaledVector(normal, -halfW);

      roadVertices.push(pLeft.x, pLeft.y, pLeft.z);
      roadVertices.push(pRight.x, pRight.y, pRight.z);

      roadNormals.push(trueUp.x, trueUp.y, trueUp.z, trueUp.x, trueUp.y, trueUp.z);
      roadUvs.push(0, u * 55, 1, u * 55);

      // Color tinting for dirt zones
      const isDirt = TrackBuilder.isPointInDirtZone(u, config.dirtZones);
      const roadTint = isDirt ? dirtColor : asphaltColor;
      roadColors.push(roadTint.r, roadTint.g, roadTint.b, roadTint.r, roadTint.g, roadTint.b);

      // Curbs (elevated slightly above road surface)
      const cLeftOuter = pLeft.clone().addScaledVector(normal, curbW).addScaledVector(trueUp, 0.1);
      const cRightOuter = pRight.clone().addScaledVector(normal, -curbW).addScaledVector(trueUp, 0.1);

      const isA = Math.floor(u * 100) % 2 === 0;
      let c = isA ? colorA : colorB;
      if (isDirt) {
        c = isA ? new THREE.Color(0x8d6e63) : new THREE.Color(0xbcaaa4);
      }

      curbLeftPos.push(pLeft.x, pLeft.y + 0.03, pLeft.z);
      curbLeftPos.push(cLeftOuter.x, cLeftOuter.y, cLeftOuter.z);
      curbLeftColors.push(c.r, c.g, c.b, c.r, c.g, c.b);

      curbRightPos.push(pRight.x, pRight.y + 0.03, pRight.z);
      curbRightPos.push(cRightOuter.x, cRightOuter.y, cRightOuter.z);
      curbRightColors.push(c.r, c.g, c.b, c.r, c.g, c.b);

      // Correct CCW winding order so faces point UPWARDS towards viewer
      if (i < divisions) {
        const v1 = i * 2;
        const v2 = v1 + 1;
        const v3 = (i + 1) * 2;
        const v4 = v3 + 1;
        roadIndices.push(v1, v3, v2, v2, v3, v4);
      }

      // 2. BRIDGE PILLARS & GUARDRAILS for elevated road (Y > 2.0m)
      if (pt.y > 2.0 && i % 10 === 0) {
        TrackBuilder.createBridgeSupportPillar(pt, normal, trackGroup);
      }

      if (pt.y > 1.8 && i % 4 === 0) {
        TrackBuilder.createGuardrailPost(pLeft, normal, 1, trackGroup);
        TrackBuilder.createGuardrailPost(pRight, normal, -1, trackGroup);
      }
    }

    roadGeom.setAttribute('position', new THREE.Float32BufferAttribute(roadVertices, 3));
    roadGeom.setAttribute('normal', new THREE.Float32BufferAttribute(roadNormals, 3));
    roadGeom.setAttribute('uv', new THREE.Float32BufferAttribute(roadUvs, 2));
    roadGeom.setAttribute('color', new THREE.Float32BufferAttribute(roadColors, 3));
    roadGeom.setIndex(roadIndices);
    roadGeom.computeVertexNormals();

    // Procedural High Quality PS2-era Asphalt Texture
    const roadTex = TrackBuilder.createRoadTexture(config);

    const roadMat = new THREE.MeshStandardMaterial({
      map: roadTex,
      vertexColors: true,
      roughness: 0.78,
      metalness: 0.12,
      side: THREE.DoubleSide
    });

    const roadMesh = new THREE.Mesh(roadGeom, roadMat);
    roadMesh.receiveShadow = true;
    trackGroup.add(roadMesh);

    // Build Curbs with correct winding & DoubleSide
    const cIndices = [];
    for (let i = 0; i < divisions; i++) {
      const v1 = i * 2;
      const v2 = v1 + 1;
      const v3 = (i + 1) * 2;
      const v4 = v3 + 1;
      cIndices.push(v1, v3, v2, v2, v3, v4);
    }

    const curbMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.45,
      metalness: 0.1,
      side: THREE.DoubleSide
    });

    const cLeftGeom = new THREE.BufferGeometry();
    cLeftGeom.setAttribute('position', new THREE.Float32BufferAttribute(curbLeftPos, 3));
    cLeftGeom.setAttribute('color', new THREE.Float32BufferAttribute(curbLeftColors, 3));
    cLeftGeom.setIndex(cIndices);
    cLeftGeom.computeVertexNormals();
    trackGroup.add(new THREE.Mesh(cLeftGeom, curbMat));

    const cRightGeom = new THREE.BufferGeometry();
    cRightGeom.setAttribute('position', new THREE.Float32BufferAttribute(curbRightPos, 3));
    cRightGeom.setAttribute('color', new THREE.Float32BufferAttribute(curbRightColors, 3));
    cRightGeom.setIndex(cIndices);
    cRightGeom.computeVertexNormals();
    trackGroup.add(new THREE.Mesh(cRightGeom, curbMat));

    // 3. BUILD ALTERNATE ROUTE (BRANCH / FORK)
    if (config.alternateRoute) {
      TrackBuilder.buildAlternateBranch(config.alternateRoute, curve, trackGroup);
    }

    // 4. Finish Line Arch (at u = 0)
    TrackBuilder.buildFinishLine(curve, roadWidth, trackGroup, config.phase);

    // 5. Giant Solid Ground Plane with Procedural Terrain Texture
    const groundGeom = new THREE.PlaneGeometry(620, 620, 32, 32);
    groundGeom.rotateX(-Math.PI / 2);

    const groundTex = TrackBuilder.createGroundTexture(config);
    const groundMat = new THREE.MeshStandardMaterial({
      color: config.groundColor,
      map: groundTex,
      roughness: 0.92,
      metalness: 0.05,
      side: THREE.DoubleSide
    });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.receiveShadow = true;
    ground.position.y = -0.05; // Slightly below road level to avoid any Z-fighting
    trackGroup.add(ground);

    // 6. Scenery & Surrounding 3D Props
    TrackBuilder.buildScenery(curve, config, trackGroup);

    // Dense checkpoints for accurate 3D position & race standings
    const checkpoints = [];
    const numCheckpoints = 56;
    for (let i = 0; i < numCheckpoints; i++) {
      const u = i / numCheckpoints;
      const pos = curve.getPointAt(u);
      const tan = curve.getTangentAt(u).normalize();
      checkpoints.push({ index: i, u, pos, tangent: tan });
    }

    return {
      group: trackGroup,
      curve: curve,
      checkpoints: checkpoints,
      config: config
    };
  }

  // Generate high quality procedural asphalt road texture
  static createRoadTexture(config) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base road color
    const isNight = config.phase === 3;
    ctx.fillStyle = isNight ? '#1e222d' : '#ffffff';
    ctx.fillRect(0, 0, 512, 512);

    // Aggregate asphalt grain noise
    ctx.fillStyle = isNight ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.14)';
    for (let k = 0; k < 1200; k++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 512;
      const rw = 1 + Math.random() * 2;
      ctx.fillRect(rx, ry, rw, rw);
    }

    // Outer solid white lane borders
    ctx.strokeStyle = isNight ? '#00f0ff' : '#ffffff';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(32, 0); ctx.lineTo(32, 512);
    ctx.moveTo(480, 0); ctx.lineTo(480, 512);
    ctx.stroke();

    // Center dashed overtaking line
    ctx.strokeStyle = isNight ? '#ff0055' : (config.phase === 2 ? '#f5cd79' : '#f1c40f');
    ctx.lineWidth = 10;
    ctx.setLineDash([38, 28]);
    ctx.beginPath();
    ctx.moveTo(256, 0); ctx.lineTo(256, 512);
    ctx.stroke();
    ctx.setLineDash([]);

    const roadTex = new THREE.CanvasTexture(canvas);
    roadTex.wrapS = THREE.RepeatWrapping;
    roadTex.wrapT = THREE.RepeatWrapping;
    roadTex.repeat.set(1, 40);
    roadTex.needsUpdate = true;
    return roadTex;
  }

  // Generate high quality procedural ground terrain texture
  static createGroundTexture(config) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 512);

    if (config.phase === 1) {
      // City: Lawn grass patches with subtle checker paving lines
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      for (let x = 0; x < 512; x += 64) {
        ctx.fillRect(x, 0, 2, 512);
      }
      for (let y = 0; y < 512; y += 64) {
        ctx.fillRect(0, y, 512, 2);
      }
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      for (let k = 0; k < 1000; k++) {
        ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
      }
    } else if (config.phase === 2) {
      // Countryside: Rural earth, organic soil streaks, dry straw blades
      ctx.fillStyle = 'rgba(110, 80, 40, 0.25)';
      for (let i = 0; i < 40; i++) {
        ctx.fillRect(0, i * 13, 512, 6);
      }
      ctx.fillStyle = 'rgba(240, 200, 100, 0.2)';
      for (let k = 0; k < 1200; k++) {
        ctx.fillRect(Math.random() * 512, Math.random() * 512, 3, 2);
      }
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      for (let k = 0; k < 800; k++) {
        ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
      }
    } else {
      // Alpine Mountain: Dark granite fractures, slate rocks and gravel
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      for (let k = 0; k < 1500; k++) {
        const s = 1 + Math.random() * 3;
        ctx.fillRect(Math.random() * 512, Math.random() * 512, s, s);
      }
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.lineWidth = 2;
      for (let j = 0; j < 16; j++) {
        ctx.beginPath();
        let sx = Math.random() * 512;
        let sy = Math.random() * 512;
        ctx.moveTo(sx, sy);
        for (let seg = 0; seg < 4; seg++) {
          sx += (Math.random() - 0.5) * 80;
          sy += (Math.random() - 0.5) * 80;
          ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      }
    }

    const groundTex = new THREE.CanvasTexture(canvas);
    groundTex.wrapS = THREE.RepeatWrapping;
    groundTex.wrapT = THREE.RepeatWrapping;
    groundTex.repeat.set(45, 45);
    groundTex.needsUpdate = true;
    return groundTex;
  }

  static isPointInDirtZone(u, dirtZones) {
    if (!dirtZones || dirtZones.length === 0) return false;
    for (let zone of dirtZones) {
      if (zone.startU <= zone.endU) {
        if (u >= zone.startU && u <= zone.endU) return true;
      } else {
        if (u >= zone.startU || u <= zone.endU) return true;
      }
    }
    return false;
  }

  // Support pillars for elevated bridge sections
  static createBridgeSupportPillar(roadPt, normal, group) {
    const h = roadPt.y;
    if (h < 1.0) return;
    const pillarGeom = new THREE.CylinderGeometry(0.85, 1.1, h, 8);
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x7f8c8d,
      roughness: 0.8,
      metalness: 0.2,
      side: THREE.DoubleSide
    });
    const pillar = new THREE.Mesh(pillarGeom, pillarMat);
    pillar.position.set(roadPt.x, h / 2, roadPt.z);
    pillar.castShadow = true;
    group.add(pillar);

    // Concrete cross-beam cap under the road aligned with road cross-section
    const capGeom = new THREE.BoxGeometry(15.2, 0.7, 2.5);
    const cap = new THREE.Mesh(capGeom, pillarMat);
    cap.position.set(roadPt.x, h - 0.35, roadPt.z);
    if (normal) {
      cap.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), normal);
    }
    group.add(cap);
  }

  // Guardrail post along bridge edges
  static createGuardrailPost(edgePt, normal, side, group) {
    const postMat = new THREE.MeshStandardMaterial({ color: 0xbdc3c7, metalness: 0.8, roughness: 0.2 });
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.1, 0.12), postMat);
    post.position.set(edgePt.x, edgePt.y + 0.55, edgePt.z);
    group.add(post);

    // Red or white reflector plate
    const refColor = side > 0 ? 0xff3838 : 0xffffff;
    const ref = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.22, 0.05),
      new THREE.MeshBasicMaterial({ color: refColor })
    );
    ref.position.set(edgePt.x, edgePt.y + 0.8, edgePt.z);
    group.add(ref);
  }

  // Alternative branch / bifurcation road
  static buildAlternateBranch(routeData, mainCurve, group) {
    const startPt = mainCurve.getPointAt(routeData.splitU);
    const endPt = mainCurve.getPointAt(routeData.mergeU);

    // Combine split point, intermediate points, and merge point
    const allPts = [startPt, ...routeData.points, endPt];
    const branchCurve = new THREE.CatmullRomCurve3(allPts, false, 'centripetal', 0.5);

    const divs = 70;
    const branchW = 10;
    const halfW = branchW / 2;

    const bGeom = new THREE.BufferGeometry();
    const vertices = [];
    const indices = [];
    const colors = [];

    const roadColor = routeData.isDirt ? new THREE.Color(0x735338) : new THREE.Color(0x343842);

    for (let i = 0; i <= divs; i++) {
      const u = i / divs;
      const pt = branchCurve.getPointAt(u);
      const tan = branchCurve.getTangentAt(u).normalize();
      const norm = new THREE.Vector3(-tan.z, 0, tan.x).normalize();

      const pL = pt.clone().addScaledVector(norm, halfW);
      const pR = pt.clone().addScaledVector(norm, -halfW);

      vertices.push(pL.x, pL.y + 0.06, pL.z);
      vertices.push(pR.x, pR.y + 0.06, pR.z);

      colors.push(roadColor.r, roadColor.g, roadColor.b, roadColor.r, roadColor.g, roadColor.b);

      // Correct CCW winding order
      if (i < divs) {
        const v1 = i * 2, v2 = v1 + 1, v3 = (i + 1) * 2, v4 = v3 + 1;
        indices.push(v1, v3, v2, v2, v3, v4);
      }
    }

    bGeom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    bGeom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    bGeom.setIndex(indices);
    bGeom.computeVertexNormals();

    const bMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: routeData.isDirt ? 0.95 : 0.72,
      metalness: 0.1,
      side: THREE.DoubleSide
    });

    const branchMesh = new THREE.Mesh(bGeom, bMat);
    branchMesh.receiveShadow = true;
    group.add(branchMesh);

    // Sign at junction
    TrackBuilder.createRouteJunctionSign(startPt, mainCurve.getTangentAt(routeData.splitU), routeData.name, group);
  }

  static createRouteJunctionSign(pos, tan, routeName, group) {
    const signGroup = new THREE.Group();
    signGroup.position.set(pos.x, pos.y, pos.z);
    signGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tan);

    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 4.0, 6),
      new THREE.MeshStandardMaterial({ color: 0x333333 })
    );
    post.position.y = 2.0;
    signGroup.add(post);

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 96;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0984e3';
    ctx.fillRect(0, 0, 256, 96);
    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SPLIT ROUTE', 128, 36);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(routeName.toUpperCase(), 128, 70);

    const signMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(3.5, 1.4),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), side: THREE.DoubleSide })
    );
    signMesh.position.y = 3.8;
    signGroup.add(signMesh);

    group.add(signGroup);
  }

  // Finish Line Gantry (PS2 Racing Style)
  static buildFinishLine(curve, roadWidth, trackGroup, phase) {
    const pt = curve.getPointAt(0);
    const tan = curve.getTangentAt(0).normalize();
    const norm = new THREE.Vector3(-tan.z, 0, tan.x).normalize();

    const halfW = roadWidth / 2;
    const approxUp = new THREE.Vector3(0, 1, 0);
    const up = new THREE.Vector3().crossVectors(norm, tan).normalize();

    // Checkerboard stripe on road at u = 0 (aligned directly with road surface)
    const p1 = pt.clone().addScaledVector(norm, -halfW).addScaledVector(tan, -1.25).addScaledVector(up, 0.08);
    const p2 = pt.clone().addScaledVector(norm, halfW).addScaledVector(tan, -1.25).addScaledVector(up, 0.08);
    const p3 = pt.clone().addScaledVector(norm, -halfW).addScaledVector(tan, 1.25).addScaledVector(up, 0.08);
    const p4 = pt.clone().addScaledVector(norm, halfW).addScaledVector(tan, 1.25).addScaledVector(up, 0.08);

    const checkGeom = new THREE.BufferGeometry();
    const cVerts = [
      p1.x, p1.y, p1.z,
      p2.x, p2.y, p2.z,
      p3.x, p3.y, p3.z,
      p4.x, p4.y, p4.z
    ];
    const cUvs = [0, 0, 1, 0, 0, 1, 1, 1];
    const cIndices = [0, 2, 1, 1, 2, 3];
    checkGeom.setAttribute('position', new THREE.Float32BufferAttribute(cVerts, 3));
    checkGeom.setAttribute('uv', new THREE.Float32BufferAttribute(cUvs, 2));
    checkGeom.setIndex(cIndices);
    checkGeom.computeVertexNormals();

    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 2; y++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? '#ffffff' : '#111111';
        ctx.fillRect(x * 16, y * 16, 16, 16);
      }
    }
    const checkTex = new THREE.CanvasTexture(canvas);
    const checkMat = new THREE.MeshStandardMaterial({ map: checkTex, roughness: 0.5, side: THREE.DoubleSide });
    const checkMesh = new THREE.Mesh(checkGeom, checkMat);
    trackGroup.add(checkMesh);

    // Arch pillars
    const pLeft = pt.clone().addScaledVector(norm, halfW + 1.4);
    const pRight = pt.clone().addScaledVector(norm, -halfW - 1.4);

    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x1e272e, metalness: 0.8, roughness: 0.2 });
    const pGeom = new THREE.CylinderGeometry(0.4, 0.55, 7.5, 8);
    const pillarLeft = new THREE.Mesh(pGeom, pillarMat);
    pillarLeft.position.set(pLeft.x, pt.y + 3.75, pLeft.z);
    pillarLeft.castShadow = true;
    const pillarRight = new THREE.Mesh(pGeom, pillarMat);
    pillarRight.position.set(pRight.x, pt.y + 3.75, pRight.z);
    pillarRight.castShadow = true;
    trackGroup.add(pillarLeft);
    trackGroup.add(pillarRight);

    // Crossbar Gantry
    const crossBar = new THREE.Mesh(
      new THREE.BoxGeometry(roadWidth + 3.2, 1.6, 0.7),
      new THREE.MeshStandardMaterial({ color: 0x2f3640, roughness: 0.3 })
    );
    crossBar.position.set(pt.x, pt.y + 6.8, pt.z);
    crossBar.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), norm);
    trackGroup.add(crossBar);

    // PS2 Arcade Style Banner: "AUTITOS GRAND PRIX // 30 DE SEPTIEMBRE"
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 512;
    signCanvas.height = 128;
    const sCtx = signCanvas.getContext('2d');
    sCtx.fillStyle = '#0a0d16';
    sCtx.fillRect(0, 0, 512, 128);
    sCtx.fillStyle = '#e74c3c';
    sCtx.fillRect(0, 0, 512, 14);
    sCtx.fillRect(0, 114, 512, 14);

    sCtx.fillStyle = '#f1c40f';
    sCtx.font = 'italic bold 44px sans-serif';
    sCtx.textAlign = 'center';
    sCtx.textBaseline = 'middle';
    sCtx.fillText('30 DE SEPTIEMBRE', 256, 48);

    sCtx.fillStyle = '#00f0ff';
    sCtx.font = 'bold 24px sans-serif';
    sCtx.fillText('GRAND PRIX // SPECIAL STAGE', 256, 88);

    const signMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(roadWidth * 0.75, 1.3),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(signCanvas), side: THREE.DoubleSide })
    );
    signMesh.position.set(pt.x, pt.y + 6.8, pt.z);
    const rotMat = new THREE.Matrix4().makeBasis(norm, new THREE.Vector3(0, 1, 0), tan);
    signMesh.quaternion.setFromRotationMatrix(rotMat);
    trackGroup.add(signMesh);
  }

  static buildScenery(curve, config, trackGroup) {
    // 1. Giant Mountain Horizon
    TrackBuilder.createMountainHorizon(trackGroup, config.phase === 3);

    // 2. Specific Themed Scenery
    if (config.sceneryType === 'city_hospital') {
      TrackBuilder.buildCityAndHospital(curve, config, trackGroup);
    } else if (config.sceneryType === 'countryside') {
      TrackBuilder.buildCountryside(curve, config, trackGroup);
    } else {
      TrackBuilder.buildMountainsAndCity(curve, config, trackGroup);
    }
  }

  // ==========================================
  // SCENERY 1: CIUDAD & HOSPITAL HRT (TALCA)
  // ==========================================
  static buildCityAndHospital(curve, config, trackGroup) {
    // Hospital HRT situated inside the elevated viaduct loop at X=75, Z=70
    const hospitalPos = new THREE.Vector3(75, 0, 70);
    TrackBuilder.createHospitalHRT(hospitalPos, trackGroup);

    // Residential houses, avenue trees, street lights
    const numProps = 55;
    for (let i = 0; i < numProps; i++) {
      const u = i / numProps;
      const pt = curve.getPointAt(u);
      const tan = curve.getTangentAt(u).normalize();
      const norm = new THREE.Vector3(-tan.z, 0, tan.x).normalize();

      const side = (i % 2 === 0) ? 1 : -1;
      const dist = (config.roadWidth / 2 + 8) + (i % 4) * 6;
      const pos = pt.clone().addScaledVector(norm, side * dist);
      pos.y = 0;

      if (pos.distanceTo(hospitalPos) < 45) continue;

      if (i % 3 === 0) {
        TrackBuilder.createHouse(pos, trackGroup, Math.random() * Math.PI * 2);
      } else if (i % 3 === 1) {
        TrackBuilder.createTree(pos, trackGroup);
      } else {
        TrackBuilder.createStreetLight(pos, trackGroup);
      }
    }
  }

  // ==========================================
  // SCENERY 2: EL CAMPO
  // ==========================================
  static buildCountryside(curve, config, trackGroup) {
    // Windmill situated safely in the inner apex of the Mill Hairpin bend
    TrackBuilder.createWindmill(new THREE.Vector3(65, 0, 68), trackGroup);
    TrackBuilder.createBarn(new THREE.Vector3(-35, 0, -40), trackGroup, Math.PI / 4);
    TrackBuilder.createBarn(new THREE.Vector3(75, 0, -20), trackGroup, -Math.PI / 6);

    const numProps = 65;
    for (let i = 0; i < numProps; i++) {
      const u = i / numProps;
      const pt = curve.getPointAt(u);
      const tan = curve.getTangentAt(u).normalize();
      const norm = new THREE.Vector3(-tan.z, 0, tan.x).normalize();

      const side = (i % 2 === 0) ? 1 : -1;
      const dist = (config.roadWidth / 2 + 8) + (i % 4) * 7;
      const pos = pt.clone().addScaledVector(norm, side * dist);
      pos.y = 0;

      if (i % 4 === 0) {
        TrackBuilder.createBarn(pos, trackGroup, Math.random() * Math.PI * 2);
      } else if (i % 4 === 1) {
        TrackBuilder.createHayBale(pos, trackGroup);
      } else if (i % 4 === 2) {
        TrackBuilder.createHouse(pos, trackGroup, Math.random() * Math.PI * 2, 0xdfe6e9, 0xb71540);
      } else {
        TrackBuilder.createTree(pos, trackGroup);
      }
    }
  }

  // ==========================================
  // SCENERY 3: GRAN CORDILLERA & TUNNEL
  // ==========================================
  static buildMountainsAndCity(curve, config, trackGroup) {
    const roadWidth = config.roadWidth;
    const halfW = roadWidth / 2;

    // 1. Concrete tunnel entrance at u = 0.55 (mountain summit pass)
    const tunPt = curve.getPointAt(0.55);
    TrackBuilder.createMountainTunnel(tunPt, curve.getTangentAt(0.55), roadWidth, trackGroup);

    // 2. Pre-sample curve for bulletproof horizontal track clearance checks
    const trackSamples = [];
    const numSamples = 160;
    for (let s = 0; s < numSamples; s++) {
      trackSamples.push(curve.getPointAt(s / numSamples));
    }

    const getMinDistToTrack = (pos) => {
      let minD = Infinity;
      for (let s = 0; s < numSamples; s++) {
        const tp = trackSamples[s];
        const dx = pos.x - tp.x;
        const dz = pos.z - tp.z;
        const d = Math.hypot(dx, dz);
        if (d < minD) minD = d;
      }
      return minD;
    };

    // 3. Majestic Cordillera Mountain Peaks (Guaranteed Zero Track Overlap)
    const numMountainCandidates = 42;
    for (let i = 0; i < numMountainCandidates; i++) {
      const u = i / numMountainCandidates;

      // Keep tunnel approach and exit (u ~ 0.48 to 0.62) completely open with clear sightlines
      if (u > 0.48 && u < 0.62) continue;

      const pt = curve.getPointAt(u);
      const tan = curve.getTangentAt(u).normalize();
      const norm = new THREE.Vector3(-tan.z, 0, tan.x).normalize();

      // Point outwards away from track center
      const toCenter = new THREE.Vector3(-pt.x, 0, -pt.z);
      const outwardNorm = norm.dot(toCenter) < 0 ? norm : norm.clone().negate();

      const scale = 20 + (i % 4) * 5; // radius = scale * 0.9 (18m to 31.5m)
      const radius = scale * 0.9;
      const targetDist = halfW + radius + 15 + (i % 3) * 12;

      const candPos = pt.clone().addScaledVector(outwardNorm, targetDist);
      candPos.y = 0;

      // Strict clearance verification: must be at least (radius + halfW + 12m) from all track points
      const d = getMinDistToTrack(candPos);
      if (d >= radius + halfW + 12.0) {
        TrackBuilder.createMountain(candPos, scale, true, trackGroup);
      }
    }

    // 4. Trackside Props: Pine trees, street lights, mountain chalets, and roadside boulders
    const numProps = 70;
    for (let i = 0; i < numProps; i++) {
      const u = i / numProps;

      // Keep immediate tunnel portal openings clear of clutter
      if (u > 0.53 && u < 0.57) continue;

      const pt = curve.getPointAt(u);
      const tan = curve.getTangentAt(u).normalize();
      const norm = new THREE.Vector3(-tan.z, 0, tan.x).normalize();
      const side = (i % 2 === 0) ? 1 : -1;

      // Roadside street lights at track edge (PS2 Night Touge atmosphere)
      if (i % 3 === 0) {
        const lightPos = pt.clone().addScaledVector(norm, side * (halfW + 3.2));
        lightPos.y = pt.y; // match 3D elevation of current track section
        TrackBuilder.createStreetLight(lightPos, trackGroup);
      }

      // Alpine pine trees along outer shoulders
      if (i % 2 === 1) {
        const treeDist = halfW + 6.0 + (i % 4) * 3.5;
        const treePos = pt.clone().addScaledVector(norm, side * treeDist);
        treePos.y = Math.max(0, pt.y - 0.2);
        if (getMinDistToTrack(treePos) >= halfW + 4.0) {
          TrackBuilder.createPineTree(treePos, trackGroup, 1.0 + (i % 3) * 0.25);
        }
      }

      // Small roadside rock boulders
      if (i % 5 === 2) {
        const rockDist = halfW + 3.8;
        const rockPos = pt.clone().addScaledVector(norm, -side * rockDist);
        rockPos.y = pt.y;
        if (getMinDistToTrack(rockPos) >= halfW + 2.5) {
          TrackBuilder.createRock(rockPos, trackGroup, 1.4 + (i % 3) * 0.4);
        }
      }

      // Alpine Chalets at safe distance
      if (i % 7 === 4) {
        const houseDist = halfW + 16.0;
        const housePos = pt.clone().addScaledVector(norm, side * houseDist);
        housePos.y = Math.max(0, pt.y);
        if (getMinDistToTrack(housePos) >= halfW + 10.0) {
          TrackBuilder.createHouse(housePos, trackGroup, Math.random() * Math.PI * 2, 0x2d3436, 0x0984e3);
        }
      }
    }
  }

  // Concrete Tunnel arch with hollow entrance and exit portals for mountain pass
  static createMountainTunnel(pos, tan, roadWidth, group) {
    const tunGroup = new THREE.Group();
    tunGroup.position.copy(pos);
    tunGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tan);

    const archGeom = new THREE.CylinderGeometry(roadWidth * 0.65, roadWidth * 0.65, 24, 16, 1, true, 0, Math.PI);
    archGeom.rotateZ(Math.PI / 2);
    archGeom.rotateY(Math.PI / 2);
    const archMat = new THREE.MeshStandardMaterial({
      color: 0x2c3e50,
      side: THREE.DoubleSide,
      roughness: 0.9
    });
    const arch = new THREE.Mesh(archGeom, archMat);
    arch.position.y = 1.0;
    tunGroup.add(arch);

    // Hollow Portal Frames on both ends (Open archway so players can see through and drive freely)
    const halfW = roadWidth / 2;
    const createPortal = (zPos) => {
      const portal = new THREE.Group();
      portal.position.set(0, 0, zPos);

      const portalMat = new THREE.MeshStandardMaterial({ color: 0x2f3640, roughness: 0.85 });
      const trimMat = new THREE.MeshStandardMaterial({ color: 0xf39c12, roughness: 0.4 }); // Warning chevron trim

      const pillarW = 2.4;
      const pillarH = 9.5;
      const pillarD = 2.4;

      // Left Pillar (stands safely outside the road width)
      const leftPillar = new THREE.Mesh(
        new THREE.BoxGeometry(pillarW, pillarH, pillarD),
        portalMat
      );
      leftPillar.position.set(-(halfW + pillarW * 0.5), pillarH * 0.5, 0);
      leftPillar.castShadow = true;
      portal.add(leftPillar);

      // Right Pillar (stands safely outside the road width)
      const rightPillar = new THREE.Mesh(
        new THREE.BoxGeometry(pillarW, pillarH, pillarD),
        portalMat
      );
      rightPillar.position.set(halfW + pillarW * 0.5, pillarH * 0.5, 0);
      rightPillar.castShadow = true;
      portal.add(rightPillar);

      // Top Crossbar Lintel above road clearance
      const beamW = roadWidth + pillarW * 2 + 0.6;
      const beamH = 2.2;
      const topBeam = new THREE.Mesh(
        new THREE.BoxGeometry(beamW, beamH, pillarD),
        portalMat
      );
      topBeam.position.set(0, pillarH + beamH * 0.5 - 0.2, 0);
      topBeam.castShadow = true;
      portal.add(topBeam);

      // Reflective amber hazard header border
      const hazardStrip = new THREE.Mesh(
        new THREE.BoxGeometry(beamW * 0.96, 0.45, pillarD + 0.15),
        trimMat
      );
      hazardStrip.position.set(0, pillarH - 0.25, 0);
      portal.add(hazardStrip);

      tunGroup.add(portal);
    };

    createPortal(-12);
    createPortal(12);

    // Sodium-vapor yellow lamps on the tunnel ceiling
    const lampMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    [-7, 0, 7].forEach(z => {
      const lamp = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.25, 1.4), lampMat);
      lamp.position.set(0, roadWidth * 0.65 + 0.8, z);
      tunGroup.add(lamp);
    });

    group.add(tunGroup);
  }

  // ==========================================
  // 3D MODEL: HOSPITAL REGIONAL DE TALCA (HRT)
  // ==========================================
  static createHospitalHRT(pos, group) {
    const hospital = new THREE.Group();
    hospital.position.copy(pos);

    // Main multi-story hospital complex
    const towerGeom = new THREE.BoxGeometry(34, 16, 20);
    const towerMat = new THREE.MeshStandardMaterial({ color: 0xf5f6fa, roughness: 0.3 });
    const tower = new THREE.Mesh(towerGeom, towerMat);
    tower.position.y = 8;
    tower.castShadow = true;
    hospital.add(tower);

    // Blue architectural glass facade
    const winMat = new THREE.MeshStandardMaterial({ color: 0x2980b9, roughness: 0.1, metalness: 0.85 });
    for (let y = 3; y <= 13; y += 3) {
      const winFront = new THREE.Mesh(new THREE.BoxGeometry(32, 1.5, 0.3), winMat);
      winFront.position.set(0, y, 10.15);
      hospital.add(winFront);

      const winBack = new THREE.Mesh(new THREE.BoxGeometry(32, 1.5, 0.3), winMat);
      winBack.position.set(0, y, -10.15);
      hospital.add(winBack);
    }

    // Emergency Wing (Urgencias HRT)
    const urg = new THREE.Mesh(
      new THREE.BoxGeometry(18, 5.5, 12),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    urg.position.set(22, 2.75, 0);
    urg.castShadow = true;
    hospital.add(urg);

    // Emergency Red Awning
    const awning = new THREE.Mesh(
      new THREE.BoxGeometry(10, 0.4, 5),
      new THREE.MeshStandardMaterial({ color: 0xe74c3c })
    );
    awning.position.set(22, 3.8, 7.5);
    hospital.add(awning);

    // Rooftop Helipad with "H"
    const helipad = new THREE.Mesh(
      new THREE.CylinderGeometry(6.5, 6.5, 0.5, 24),
      new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.6 })
    );
    helipad.position.set(0, 16.25, 0);
    hospital.add(helipad);

    // Helipad yellow circle
    const hRing = new THREE.Mesh(
      new THREE.RingGeometry(5.0, 5.5, 24),
      new THREE.MeshBasicMaterial({ color: 0xf1c40f, side: THREE.DoubleSide })
    );
    hRing.rotateX(-Math.PI / 2);
    hRing.position.set(0, 16.52, 0);
    hospital.add(hRing);

    // Helipad white "H"
    const hBarMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const hL = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.05, 3.8), hBarMat);
    hL.position.set(-1.3, 16.53, 0);
    const hR = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.05, 3.8), hBarMat);
    hR.position.set(1.3, 16.53, 0);
    const hMid = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.05, 0.7), hBarMat);
    hMid.position.set(0, 16.53, 0);
    hospital.add(hL);
    hospital.add(hR);
    hospital.add(hMid);

    // Large Signboard: HOSPITAL REGIONAL DE TALCA
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 512;
    signCanvas.height = 110;
    const sCtx = signCanvas.getContext('2d');
    sCtx.fillStyle = '#0984e3';
    sCtx.fillRect(0, 0, 512, 110);
    sCtx.fillStyle = '#ffffff';
    sCtx.font = 'bold 30px sans-serif';
    sCtx.textAlign = 'center';
    sCtx.fillText('+ HOSPITAL REGIONAL DE TALCA +', 256, 42);
    sCtx.font = 'bold 24px sans-serif';
    sCtx.fillStyle = '#f1c40f';
    sCtx.fillText('SERVICIO DE URGENCIAS HRT', 256, 85);

    const signMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(22, 4.2),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(signCanvas), side: THREE.DoubleSide })
    );
    signMesh.position.set(0, 18.2, 10.2);
    hospital.add(signMesh);

    // Parked 3D Ambulances with flashing red lights
    TrackBuilder.createAmbulance(new THREE.Vector3(19, 0, 11), hospital, 0);
    TrackBuilder.createAmbulance(new THREE.Vector3(25, 0, 11), hospital, 0);

    group.add(hospital);
  }

  static createAmbulance(pos, group, rotY = 0) {
    const amb = new THREE.Group();
    amb.position.copy(pos);
    amb.rotation.y = rotY;

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.7, 1.4, 3.4),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    body.position.y = 0.8;
    amb.add(body);

    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(1.72, 0.32, 3.42),
      new THREE.MeshStandardMaterial({ color: 0xe74c3c })
    );
    stripe.position.y = 0.8;
    amb.add(stripe);

    const crossMat = new THREE.MeshBasicMaterial({ color: 0xe74c3c });
    const cV = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.5, 0.2), crossMat);
    cV.position.set(0.87, 0.9, 0);
    const cH = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.2, 0.5), crossMat);
    cH.position.set(0.87, 0.9, 0);
    amb.add(cV);
    amb.add(cH);

    const beacon = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 0.16, 8),
      new THREE.MeshBasicMaterial({ color: 0xe74c3c })
    );
    beacon.position.set(0, 1.6, 0.6);
    amb.add(beacon);

    group.add(amb);
  }

  // ==========================================
  // SCENERY PROPS (HOUSES, BARNS, MOUNTAINS)
  // ==========================================
  static createHouse(pos, group, rotY = 0, wallColor = 0xf5f6fa, roofColor = 0xc0392b) {
    const house = new THREE.Group();
    house.position.copy(pos);
    house.rotation.y = rotY;

    const w = 4.2 + Math.random() * 1.5;
    const h = 2.8;
    const d = 4.0 + Math.random() * 1.2;

    const walls = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.8 })
    );
    walls.position.y = h / 2;
    walls.castShadow = true;
    house.add(walls);

    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(Math.max(w, d) * 0.75, 1.8, 4),
      new THREE.MeshStandardMaterial({ color: roofColor, roughness: 0.6 })
    );
    roof.rotateY(Math.PI / 4);
    roof.position.y = h + 0.9;
    roof.castShadow = true;
    house.add(roof);

    const chim = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 1.2, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x7f8c8d })
    );
    chim.position.set(w * 0.25, h + 1.2, 0);
    house.add(chim);

    group.add(house);
  }

  static createBarn(pos, group, rotY = 0) {
    const barn = new THREE.Group();
    barn.position.copy(pos);
    barn.rotation.y = rotY;

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(8, 4.2, 6.2),
      new THREE.MeshStandardMaterial({ color: 0xb71540, roughness: 0.85 })
    );
    body.position.y = 2.1;
    body.castShadow = true;
    barn.add(body);

    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(6.0, 2.5, 4),
      new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.6 })
    );
    roof.rotateY(Math.PI / 4);
    roof.position.y = 5.2;
    roof.castShadow = true;
    barn.add(roof);

    group.add(barn);
  }

  static createWindmill(pos, group) {
    const mill = new THREE.Group();
    mill.position.copy(pos);

    const tower = new THREE.Mesh(
      new THREE.CylinderGeometry(1.8, 3.2, 9, 8),
      new THREE.MeshStandardMaterial({ color: 0xdfe6e9, roughness: 0.8 })
    );
    tower.position.y = 4.5;
    tower.castShadow = true;
    mill.add(tower);

    const cap = new THREE.Mesh(
      new THREE.ConeGeometry(2.2, 2.4, 8),
      new THREE.MeshStandardMaterial({ color: 0x795548 })
    );
    cap.position.y = 10.2;
    mill.add(cap);

    const sailMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    for (let i = 0; i < 4; i++) {
      const sail = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4.8, 0.08), sailMat);
      sail.position.set(0, 9.5, 2.0);
      sail.rotation.z = (i * Math.PI) / 2;
      mill.add(sail);
    }

    group.add(mill);
  }

  static createHayBale(pos, group) {
    const bale = new THREE.Mesh(
      new THREE.CylinderGeometry(0.85, 0.85, 1.5, 12),
      new THREE.MeshStandardMaterial({ color: 0xf6e58d, roughness: 0.9 })
    );
    bale.rotateZ(Math.PI / 2);
    bale.position.set(pos.x, 0.75, pos.z);
    bale.castShadow = true;
    group.add(bale);
  }

  static createTree(pos, group) {
    const tree = new THREE.Group();
    tree.position.copy(pos);

    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.38, 3.5, 6),
      new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.9 })
    );
    trunk.position.y = 1.75;
    trunk.castShadow = true;
    tree.add(trunk);

    const leafMat = new THREE.MeshStandardMaterial({ color: 0x27ae60, roughness: 0.7 });
    for (let k = 0; k < 3; k++) {
      const foliage = new THREE.Mesh(new THREE.ConeGeometry(1.6 - k * 0.35, 2.2, 7), leafMat);
      foliage.position.y = 3.0 + k * 1.2;
      foliage.castShadow = true;
      tree.add(foliage);
    }

    group.add(tree);
  }

  static createPineTree(pos, group, scale = 1.0) {
    const tree = new THREE.Group();
    tree.position.copy(pos);

    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22 * scale, 0.35 * scale, 3.2 * scale, 6),
      new THREE.MeshStandardMaterial({ color: 0x3d271d, roughness: 0.9 })
    );
    trunk.position.y = 1.6 * scale;
    trunk.castShadow = true;
    tree.add(trunk);

    const needleMat = new THREE.MeshStandardMaterial({ color: 0x1b3a24, roughness: 0.8 });
    for (let k = 0; k < 4; k++) {
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry((2.0 - k * 0.35) * scale, 2.2 * scale, 6),
        needleMat
      );
      cone.position.y = (2.4 + k * 1.1) * scale;
      cone.castShadow = true;
      tree.add(cone);
    }
    group.add(tree);
  }

  static createRock(pos, group, scale = 1.8) {
    const rock = new THREE.Mesh(
      new THREE.DodecahedronGeometry(scale, 1),
      new THREE.MeshStandardMaterial({
        color: 0x535c68,
        flatShading: true,
        roughness: 0.92
      })
    );
    rock.scale.set(1.0, 0.65, 1.15);
    rock.position.set(pos.x, scale * 0.4, pos.z);
    rock.rotation.set(Math.random(), Math.random(), Math.random());
    rock.castShadow = true;
    group.add(rock);
  }

  static createStreetLight(pos, group) {
    const light = new THREE.Group();
    light.position.copy(pos);

    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.12, 6.0, 6),
      new THREE.MeshStandardMaterial({ color: 0x2d3436, metalness: 0.8 })
    );
    pole.position.y = 3.0;
    light.add(pole);

    const arm = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.08, 1.3),
      new THREE.MeshStandardMaterial({ color: 0x2d3436 })
    );
    arm.position.set(0, 5.9, 0.6);
    light.add(arm);

    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xfff9c4 })
    );
    bulb.position.set(0, 5.8, 1.1);
    light.add(bulb);

    group.add(light);
  }

  static createMountain(pos, scale = 14, isSnowy = false, group) {
    const mountain = new THREE.Group();
    mountain.position.copy(pos);

    const rockGeom = new THREE.ConeGeometry(scale * 0.9, scale * 1.6, 7);
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x4a4b4d,
      flatShading: true,
      roughness: 0.95
    });
    const rock = new THREE.Mesh(rockGeom, rockMat);
    rock.position.y = (scale * 1.6) / 2;
    rock.castShadow = true;
    mountain.add(rock);

    if (isSnowy) {
      const snowGeom = new THREE.ConeGeometry(scale * 0.42, scale * 0.55, 7);
      const snowMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        flatShading: true,
        roughness: 0.2
      });
      const snow = new THREE.Mesh(snowGeom, snowMat);
      snow.position.y = scale * 1.6 * 0.82;
      mountain.add(snow);
    }

    group.add(mountain);
  }

  static createMountainHorizon(group, isSnowy = false) {
    const numMountains = 28;
    const radius = 240;
    for (let i = 0; i < numMountains; i++) {
      const angle = (i / numMountains) * Math.PI * 2;
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 30;
      const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 30;
      const hScale = 22 + Math.random() * 20;
      TrackBuilder.createMountain(new THREE.Vector3(x, 0, z), hScale, isSnowy || i % 2 === 0, group);
    }
  }
}

window.TRACK_PHASES = TRACK_PHASES;
window.TrackBuilder = TrackBuilder;
