// Procedural 3D Car Models inspired by real vehicles:
// - Peugeot 3008 (SUV)
// - Chevrolet Tahoe / Suburban (SUV)
// - Chevrolet Cruze / Onix RS (Sedán)
// - BMW Serie 3 M-Sport (Sedán de lujo)
// - Mercedes-Benz Clase C/E (Sedán de lujo)
// - Porsche 911 GT (Deportivo de lujo)
// - Chevrolet Corvette C8 (Deportivo)
// - Lamborghini Huracán EVO (Superdeportivo de lujo)

const CAR_CATALOG = [
  {
    id: 'car-suv-peugeot',
    name: 'Lion 3008',
    realModel: 'Inspirado en Peugeot 3008 Crossover',
    category: 'SUV',
    desc: 'SUV crossover francés. Techo flotante y luces LED tipo garra. Gran maniobrabilidad y estabilidad en curvas.',
    color: '#0984e3',
    roofColor: '#1e272e',
    accentColor: '#dcdde1',
    stats: { speed: 43, handling: 95, accel: 64 },
    physics: {
      maxSpeed: 18.8,
      accel: 14.2,
      brake: 24.0,
      reverse: 9.0,
      turnRate: 3.5,
      grip: 0.94,
      driftFriction: 0.88,
      mass: 1.45
    },
    builder: 'buildPeugeot3008'
  },
  {
    id: 'car-suv-chevy',
    name: 'Chevy Tahoe 4x4',
    realModel: 'Inspirado en Chevrolet Tahoe / Suburban',
    category: 'SUV',
    desc: 'SUV imponente americano con doble parrilla cromada. Muy seguro, gira cerrado sin perder tracción.',
    color: '#27ae60',
    roofColor: '#27ae60',
    accentColor: '#f5f6fa',
    stats: { speed: 45, handling: 92, accel: 66 },
    physics: {
      maxSpeed: 19.2,
      accel: 14.6,
      brake: 23.5,
      reverse: 9.0,
      turnRate: 3.38,
      grip: 0.93,
      driftFriction: 0.87,
      mass: 1.55
    },
    builder: 'buildChevyTahoe'
  },
  {
    id: 'car-sedan-chevy',
    name: 'Chevy Bowtie RS',
    realModel: 'Inspirado en Chevrolet Cruze / Onix RS',
    category: 'SEDAN',
    desc: 'Sedán deportivo compacto. Equilibrio ideal entre aceleración, velocidad moderada y control ágil.',
    color: '#e84118',
    roofColor: '#1e272e',
    accentColor: '#111111',
    stats: { speed: 68, handling: 68, accel: 69 },
    physics: {
      maxSpeed: 24.8,
      accel: 16.2,
      brake: 26.0,
      reverse: 10.0,
      turnRate: 2.45,
      grip: 0.88,
      driftFriction: 0.83,
      mass: 1.2
    },
    builder: 'buildChevySedan'
  },
  {
    id: 'car-sedan-bmw',
    name: 'Bavaria 330 M',
    realModel: 'Inspirado en BMW Serie 3 M-Sport',
    category: 'SEDAN',
    desc: 'Sedán de lujo bávaro. Doble riñón característico, distribución de peso 50:50 y manejo refinado.',
    color: '#2980b9',
    roofColor: '#2980b9',
    accentColor: '#1e272e',
    stats: { speed: 70, handling: 66, accel: 71 },
    physics: {
      maxSpeed: 25.2,
      accel: 16.6,
      brake: 26.5,
      reverse: 10.0,
      turnRate: 2.4,
      grip: 0.87,
      driftFriction: 0.82,
      mass: 1.22
    },
    builder: 'buildBMWSedan'
  },
  {
    id: 'car-sedan-mercedes',
    name: 'Stuttgart Star Luxury',
    realModel: 'Inspirado en Mercedes-Benz Clase C/E',
    category: 'SEDAN',
    desc: 'Sedán ejecutivo de alta gama. Líneas aerodinámicas elegantes, suspensión equilibrada y respuesta suave.',
    color: '#bdc3c7',
    roofColor: '#111625',
    accentColor: '#ecf0f1',
    stats: { speed: 69, handling: 67, accel: 70 },
    physics: {
      maxSpeed: 25.0,
      accel: 16.4,
      brake: 26.2,
      reverse: 10.0,
      turnRate: 2.42,
      grip: 0.88,
      driftFriction: 0.83,
      mass: 1.21
    },
    builder: 'buildMercedesSedan'
  },
  {
    id: 'car-sport-porsche',
    name: 'Carrera 911 GT',
    realModel: 'Inspirado en Porsche 911',
    category: 'DEPORTIVO',
    desc: 'Ícono del diseño con caída fastback y pasos de rueda ensanchados. Gran aceleración, exige frenar en curvas.',
    color: '#f1c40f',
    roofColor: '#f1c40f',
    accentColor: '#2c3e50',
    stats: { speed: 94, handling: 38, accel: 91 },
    physics: {
      maxSpeed: 30.5,
      accel: 19.6,
      brake: 28.0,
      reverse: 11.0,
      turnRate: 1.72,
      grip: 0.81,
      driftFriction: 0.77,
      mass: 1.05
    },
    builder: 'buildPorsche911'
  },
  {
    id: 'car-sport-corvette',
    name: 'Vette C8 Sting',
    realModel: 'Inspirado en Chevrolet Corvette C8',
    category: 'DEPORTIVO',
    desc: 'Superdeportivo con motor central. Trompa afilada y tomas de aire laterales agresivas. Vuela en rectas.',
    color: '#c0392b',
    roofColor: '#1e272e',
    accentColor: '#111111',
    stats: { speed: 97, handling: 35, accel: 94 },
    physics: {
      maxSpeed: 31.8,
      accel: 20.2,
      brake: 28.5,
      reverse: 11.0,
      turnRate: 1.63,
      grip: 0.79,
      driftFriction: 0.75,
      mass: 1.02
    },
    builder: 'buildCorvetteC8'
  },
  {
    id: 'car-sport-lambo',
    name: 'Bulls Huracán EVO',
    realModel: 'Inspirado en Lamborghini Huracán EVO',
    category: 'DEPORTIVO',
    desc: 'Hiperdeportivo de lujo extremo. Silueta de cuña afilada y alerón de competencia. Máxima velocidad punta.',
    color: '#8e44ad',
    roofColor: '#111625',
    accentColor: '#00f0ff',
    stats: { speed: 100, handling: 32, accel: 97 },
    physics: {
      maxSpeed: 32.8,
      accel: 20.8,
      brake: 29.0,
      reverse: 11.5,
      turnRate: 1.55,
      grip: 0.78,
      driftFriction: 0.74,
      mass: 0.98
    },
    builder: 'buildLamboHuracan'
  }
];

class CarModelBuilder {
  static createCarMesh(carData) {
    const group = new THREE.Group();
    group.castShadow = true;
    group.receiveShadow = true;

    const bodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(carData.color),
      roughness: 0.22,
      metalness: 0.65
    });

    const roofMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(carData.roofColor || carData.color),
      roughness: 0.25,
      metalness: 0.55
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(carData.accentColor),
      roughness: 0.3,
      metalness: 0.75
    });

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x111625,
      roughness: 0.08,
      metalness: 0.92
    });

    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x1e2022,
      roughness: 0.85,
      metalness: 0.1
    });

    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xdcdde1,
      roughness: 0.15,
      metalness: 0.85
    });

    const lightMat = new THREE.MeshStandardMaterial({
      color: 0xfff9c4,
      emissive: 0xffeb3b,
      emissiveIntensity: 0.9,
      roughness: 0.1
    });

    const tailLightMat = new THREE.MeshStandardMaterial({
      color: 0xff1744,
      emissive: 0xd50000,
      emissiveIntensity: 0.8,
      roughness: 0.1
    });

    const builderMethod = CarModelBuilder[carData.builder] || CarModelBuilder.buildPeugeot3008;
    builderMethod(group, bodyMat, roofMat, accentMat, glassMat, tireMat, rimMat, lightMat, tailLightMat);

    return group;
  }

  static createWheel(tireMat, rimMat, radius = 0.38, width = 0.28) {
    const wheelGroup = new THREE.Group();
    const tireGeom = new THREE.CylinderGeometry(radius, radius, width, 16);
    tireGeom.rotateZ(Math.PI / 2);
    const tire = new THREE.Mesh(tireGeom, tireMat);
    tire.castShadow = true;
    wheelGroup.add(tire);

    const rimGeom = new THREE.CylinderGeometry(radius * 0.58, radius * 0.58, width + 0.02, 12);
    rimGeom.rotateZ(Math.PI / 2);
    const rim = new THREE.Mesh(rimGeom, rimMat);
    wheelGroup.add(rim);

    // Rim spokes detail
    const spokeGeom = new THREE.BoxGeometry(width + 0.03, radius * 1.1, radius * 0.15);
    const spoke1 = new THREE.Mesh(spokeGeom, rimMat);
    const spoke2 = spoke1.clone();
    spoke2.rotateX(Math.PI / 2);
    wheelGroup.add(spoke1);
    wheelGroup.add(spoke2);

    return wheelGroup;
  }

  // 1. PEUGEOT 3008 (SUV Crossover)
  static buildPeugeot3008(group, bodyMat, roofMat, accentMat, glassMat, tireMat, rimMat, lightMat, tailLightMat) {
    // Body base
    const baseGeom = new THREE.BoxGeometry(1.68, 0.44, 3.4);
    const base = new THREE.Mesh(baseGeom, bodyMat);
    base.position.y = 0.52;
    base.castShadow = true;
    group.add(base);

    // Front hood with Peugeot sharp crease
    const hoodGeom = new THREE.BoxGeometry(1.64, 0.28, 1.1);
    const hood = new THREE.Mesh(hoodGeom, bodyMat);
    hood.position.set(0, 0.74, 1.05);
    hood.castShadow = true;
    group.add(hood);

    // Front Peugeot checkered grille
    const grillGeom = new THREE.BoxGeometry(1.1, 0.22, 0.12);
    const grill = new THREE.Mesh(grillGeom, accentMat);
    grill.position.set(0, 0.65, 1.62);
    group.add(grill);

    // Cabin with floating black roof
    const cabinGeom = new THREE.BoxGeometry(1.48, 0.68, 1.95);
    const cabin = new THREE.Mesh(cabinGeom, glassMat);
    cabin.position.set(0, 1.08, -0.4);
    cabin.castShadow = true;
    group.add(cabin);

    // Black floating roof shell
    const roofGeom = new THREE.BoxGeometry(1.5, 0.08, 1.98);
    const roof = new THREE.Mesh(roofGeom, roofMat);
    roof.position.set(0, 1.44, -0.4);
    roof.castShadow = true;
    group.add(roof);

    // Slanted windshield
    const windGeom = new THREE.BoxGeometry(1.42, 0.48, 0.35);
    windGeom.rotateX(Math.PI / 7);
    const windshield = new THREE.Mesh(windGeom, glassMat);
    windshield.position.set(0, 1.1, 0.52);
    group.add(windshield);

    // Peugeot Triple-Claw LED Headlights
    for (let side = -1; side <= 1; side += 2) {
      for (let claw = 0; claw < 3; claw++) {
        const clawGeom = new THREE.BoxGeometry(0.04, 0.18, 0.08);
        clawGeom.rotateZ(side * 0.15);
        const clawMesh = new THREE.Mesh(clawGeom, lightMat);
        clawMesh.position.set(side * (0.62 + claw * 0.07), 0.72, 1.6);
        group.add(clawMesh);
      }
    }

    // Rear light bar with triple claw effect
    const tlGeom = new THREE.BoxGeometry(1.45, 0.12, 0.08);
    const tlBar = new THREE.Mesh(tlGeom, tailLightMat);
    tlBar.position.set(0, 0.85, -1.7);
    group.add(tlBar);

    // Wheels
    const wheels = [];
    [ [0.84, 0.4, 1.05], [-0.84, 0.4, 1.05], [0.84, 0.4, -1.05], [-0.84, 0.4, -1.05] ].forEach(pos => {
      const w = CarModelBuilder.createWheel(tireMat, rimMat, 0.4, 0.3);
      w.position.set(pos[0], pos[1], pos[2]);
      group.add(w);
      wheels.push(w);
    });
    group.userData.wheels = wheels;
  }

  // 2. CHEVROLET TAHOE (American Full-Size SUV)
  static buildChevyTahoe(group, bodyMat, roofMat, accentMat, glassMat, tireMat, rimMat, lightMat, tailLightMat) {
    // Massive boxy lower body
    const baseGeom = new THREE.BoxGeometry(1.78, 0.52, 3.6);
    const base = new THREE.Mesh(baseGeom, bodyMat);
    base.position.y = 0.58;
    base.castShadow = true;
    group.add(base);

    // Tall flat hood
    const hoodGeom = new THREE.BoxGeometry(1.74, 0.32, 1.25);
    const hood = new THREE.Mesh(hoodGeom, bodyMat);
    hood.position.set(0, 0.85, 1.08);
    hood.castShadow = true;
    group.add(hood);

    // Bold Dual Chrome Chevy Grille
    const grillTopGeom = new THREE.BoxGeometry(1.5, 0.18, 0.12);
    const grillTop = new THREE.Mesh(grillTopGeom, accentMat);
    grillTop.position.set(0, 0.88, 1.72);
    const grillBotGeom = new THREE.BoxGeometry(1.5, 0.18, 0.12);
    const grillBot = new THREE.Mesh(grillBotGeom, accentMat);
    grillBot.position.set(0, 0.65, 1.72);
    group.add(grillTop);
    group.add(grillBot);

    // Golden Chevy Bowtie emblem in center
    const bowtieMat = new THREE.MeshBasicMaterial({ color: 0xf1c40f });
    const bowtieGeom = new THREE.BoxGeometry(0.24, 0.08, 0.15);
    const bowtie = new THREE.Mesh(bowtieGeom, bowtieMat);
    bowtie.position.set(0, 0.77, 1.73);
    group.add(bowtie);

    // Large Cabin
    const cabinGeom = new THREE.BoxGeometry(1.62, 0.78, 2.1);
    const cabin = new THREE.Mesh(cabinGeom, bodyMat);
    cabin.position.set(0, 1.2, -0.42);
    cabin.castShadow = true;
    group.add(cabin);

    // Tinted Windows
    const sideWinGeom = new THREE.BoxGeometry(1.66, 0.44, 1.8);
    const sideWin = new THREE.Mesh(sideWinGeom, glassMat);
    sideWin.position.set(0, 1.24, -0.45);
    group.add(sideWin);

    // Roof rack rails
    const railGeom = new THREE.BoxGeometry(0.08, 0.08, 1.8);
    const railL = new THREE.Mesh(railGeom, accentMat);
    railL.position.set(0.68, 1.62, -0.45);
    const railR = new THREE.Mesh(railGeom, accentMat);
    railR.position.set(-0.68, 1.62, -0.45);
    group.add(railL);
    group.add(railR);

    // Vertical Headlights
    [-0.7, 0.7].forEach(x => {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.32, 0.1), lightMat);
      hl.position.set(x, 0.78, 1.72);
      group.add(hl);
    });

    // Vertical Taillights
    [-0.72, 0.72].forEach(x => {
      const tl = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.42, 0.08), tailLightMat);
      tl.position.set(x, 0.88, -1.8);
      group.add(tl);
    });

    // Chunky all-terrain wheels
    const wheels = [];
    [ [0.92, 0.44, 1.15], [-0.92, 0.44, 1.15], [0.92, 0.44, -1.15], [-0.92, 0.44, -1.15] ].forEach(pos => {
      const w = CarModelBuilder.createWheel(tireMat, rimMat, 0.44, 0.34);
      w.position.set(pos[0], pos[1], pos[2]);
      group.add(w);
      wheels.push(w);
    });
    group.userData.wheels = wheels;
  }

  // 3. CHEVROLET CRUZE / ONIX RS (Sporty Sedan)
  static buildChevySedan(group, bodyMat, roofMat, accentMat, glassMat, tireMat, rimMat, lightMat, tailLightMat) {
    const baseGeom = new THREE.BoxGeometry(1.64, 0.36, 3.48);
    const base = new THREE.Mesh(baseGeom, bodyMat);
    base.position.y = 0.44;
    base.castShadow = true;
    group.add(base);

    // Front sloping hood
    const hoodGeom = new THREE.BoxGeometry(1.58, 0.22, 1.12);
    const hood = new THREE.Mesh(hoodGeom, bodyMat);
    hood.position.set(0, 0.62, 1.08);
    hood.castShadow = true;
    group.add(hood);

    // Black RS honeycomb grille with small red badge
    const grillGeom = new THREE.BoxGeometry(1.2, 0.18, 0.1);
    const grill = new THREE.Mesh(grillGeom, accentMat);
    grill.position.set(0, 0.52, 1.68);
    group.add(grill);

    const rsBadge = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.12), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    rsBadge.position.set(0.42, 0.52, 1.69);
    group.add(rsBadge);

    // Sleek aerodynamic cabin
    const cabinGeom = new THREE.BoxGeometry(1.4, 0.55, 1.65);
    const cabin = new THREE.Mesh(cabinGeom, glassMat);
    cabin.position.set(0, 0.92, -0.12);
    cabin.castShadow = true;
    group.add(cabin);

    // Black contrast roof
    const roofGeom = new THREE.BoxGeometry(1.42, 0.06, 1.35);
    const roof = new THREE.Mesh(roofGeom, roofMat);
    roof.position.set(0, 1.2, -0.15);
    group.add(roof);

    // Rear trunk lip spoiler
    const lipGeom = new THREE.BoxGeometry(1.35, 0.06, 0.16);
    const lip = new THREE.Mesh(lipGeom, accentMat);
    lip.position.set(0, 0.72, -1.65);
    group.add(lip);

    // Headlights and taillights
    [-0.6, 0.6].forEach(x => {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.1), lightMat);
      hl.position.set(x, 0.56, 1.68);
      group.add(hl);

      const tl = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.14, 0.08), tailLightMat);
      tl.position.set(x, 0.58, -1.72);
      group.add(tl);
    });

    const wheels = [];
    [ [0.82, 0.35, 1.08], [-0.82, 0.35, 1.08], [0.82, 0.35, -1.08], [-0.82, 0.35, -1.08] ].forEach(pos => {
      const w = CarModelBuilder.createWheel(tireMat, rimMat, 0.35, 0.26);
      w.position.set(pos[0], pos[1], pos[2]);
      group.add(w);
      wheels.push(w);
    });
    group.userData.wheels = wheels;
  }

  // 4. BMW SERIE 3 M-SPORT (German Executive Luxury Sedan)
  static buildBMWSedan(group, bodyMat, roofMat, accentMat, glassMat, tireMat, rimMat, lightMat, tailLightMat) {
    const baseGeom = new THREE.BoxGeometry(1.66, 0.38, 3.52);
    const base = new THREE.Mesh(baseGeom, bodyMat);
    base.position.y = 0.46;
    base.castShadow = true;
    group.add(base);

    // Hood with subtle power dome
    const hoodGeom = new THREE.BoxGeometry(1.58, 0.22, 1.15);
    const hood = new THREE.Mesh(hoodGeom, bodyMat);
    hood.position.set(0, 0.65, 1.1);
    hood.castShadow = true;
    group.add(hood);

    // Iconic BMW Twin Kidney Grille
    [-0.22, 0.22].forEach(x => {
      const kidneyGeom = new THREE.BoxGeometry(0.32, 0.18, 0.1);
      const kidney = new THREE.Mesh(kidneyGeom, accentMat);
      kidney.position.set(x, 0.56, 1.72);
      group.add(kidney);
    });

    // Executive cabin
    const cabinGeom = new THREE.BoxGeometry(1.42, 0.56, 1.72);
    const cabin = new THREE.Mesh(cabinGeom, bodyMat);
    cabin.position.set(0, 0.94, -0.12);
    cabin.castShadow = true;
    group.add(cabin);

    // Glasshouse
    const sideWin = new THREE.Mesh(new THREE.BoxGeometry(1.46, 0.38, 1.38), glassMat);
    sideWin.position.set(0, 0.95, -0.12);
    group.add(sideWin);

    // Dual Halo Headlights
    [-0.6, 0.6].forEach(x => {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.12, 0.1), lightMat);
      hl.position.set(x, 0.58, 1.7);
      group.add(hl);
    });

    // L-shaped taillights
    [-0.6, 0.6].forEach(x => {
      const tl = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.14, 0.08), tailLightMat);
      tl.position.set(x, 0.62, -1.74);
      group.add(tl);
    });

    const wheels = [];
    [ [0.83, 0.36, 1.1], [-0.83, 0.36, 1.1], [0.83, 0.36, -1.1], [-0.83, 0.36, -1.1] ].forEach(pos => {
      const w = CarModelBuilder.createWheel(tireMat, rimMat, 0.36, 0.28);
      w.position.set(pos[0], pos[1], pos[2]);
      group.add(w);
      wheels.push(w);
    });
    group.userData.wheels = wheels;
  }

  // 5. MERCEDES-BENZ CLASE C/E (Prestige Luxury Sedan)
  static buildMercedesSedan(group, bodyMat, roofMat, accentMat, glassMat, tireMat, rimMat, lightMat, tailLightMat) {
    const baseGeom = new THREE.BoxGeometry(1.68, 0.38, 3.55);
    const base = new THREE.Mesh(baseGeom, bodyMat);
    base.position.y = 0.46;
    base.castShadow = true;
    group.add(base);

    // Smooth arched hood
    const hoodGeom = new THREE.BoxGeometry(1.6, 0.24, 1.18);
    const hood = new THREE.Mesh(hoodGeom, bodyMat);
    hood.position.set(0, 0.66, 1.12);
    hood.castShadow = true;
    group.add(hood);

    // Chrome Star Grille with horizontal louvers
    const grillGeom = new THREE.BoxGeometry(1.3, 0.24, 0.1);
    const grill = new THREE.Mesh(grillGeom, accentMat);
    grill.position.set(0, 0.58, 1.74);
    group.add(grill);

    // Mercedes Star emblem hint in center
    const starRing = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.02, 6, 16), accentMat);
    starRing.position.set(0, 0.58, 1.8);
    group.add(starRing);

    // Panoramic glass roof cabin
    const cabinGeom = new THREE.BoxGeometry(1.44, 0.58, 1.75);
    const cabin = new THREE.Mesh(cabinGeom, glassMat);
    cabin.position.set(0, 0.96, -0.1);
    cabin.castShadow = true;
    group.add(cabin);

    // Smooth teardrop tail
    const trunkGeom = new THREE.BoxGeometry(1.58, 0.2, 0.8);
    const trunk = new THREE.Mesh(trunkGeom, bodyMat);
    trunk.position.set(0, 0.64, -1.3);
    group.add(trunk);

    // Sleek LED lights
    [-0.62, 0.62].forEach(x => {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.12, 0.1), lightMat);
      hl.position.set(x, 0.6, 1.72);
      group.add(hl);

      const tl = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.15, 0.08), tailLightMat);
      tl.position.set(x, 0.62, -1.75);
      group.add(tl);
    });

    const wheels = [];
    [ [0.84, 0.36, 1.1], [-0.84, 0.36, 1.1], [0.84, 0.36, -1.1], [-0.84, 0.36, -1.1] ].forEach(pos => {
      const w = CarModelBuilder.createWheel(tireMat, rimMat, 0.36, 0.28);
      w.position.set(pos[0], pos[1], pos[2]);
      group.add(w);
      wheels.push(w);
    });
    group.userData.wheels = wheels;
  }

  // 6. PORSCHE 911 GT (Classic Fastback Luxury Sports Car)
  static buildPorsche911(group, bodyMat, roofMat, accentMat, glassMat, tireMat, rimMat, lightMat, tailLightMat) {
    // Low, wide stance
    const baseGeom = new THREE.BoxGeometry(1.78, 0.32, 3.45);
    const base = new THREE.Mesh(baseGeom, bodyMat);
    base.position.y = 0.4;
    base.castShadow = true;
    group.add(base);

    // Low sloping round nose
    const noseGeom = new THREE.BoxGeometry(1.68, 0.2, 1.1);
    const nose = new THREE.Mesh(noseGeom, bodyMat);
    nose.position.set(0, 0.46, 1.1);
    nose.castShadow = true;
    group.add(nose);

    // Iconic Porsche Rounded Bug-Eye Headlights
    [-0.62, 0.62].forEach(x => {
      const eyeGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.15, 16);
      eyeGeom.rotateX(Math.PI / 3);
      const eye = new THREE.Mesh(eyeGeom, lightMat);
      eye.position.set(x, 0.58, 1.48);
      group.add(eye);
    });

    // Teardrop fastback roof sloping continuously down to rear
    const roofCurveGeom = new THREE.BoxGeometry(1.36, 0.52, 1.6);
    roofCurveGeom.rotateX(-Math.PI / 16);
    const roofMesh = new THREE.Mesh(roofCurveGeom, glassMat);
    roofMesh.position.set(0, 0.78, -0.15);
    roofMesh.castShadow = true;
    group.add(roofMesh);

    // Wide muscular rear fenders (hips)
    [-0.86, 0.86].forEach(x => {
      const hipGeom = new THREE.BoxGeometry(0.2, 0.32, 1.2);
      const hip = new THREE.Mesh(hipGeom, bodyMat);
      hip.position.set(x, 0.48, -1.05);
      group.add(hip);
    });

    // Ducktail / GT rear wing spoiler
    const wingGeom = new THREE.BoxGeometry(1.55, 0.08, 0.32);
    const wing = new THREE.Mesh(wingGeom, accentMat);
    wing.position.set(0, 0.88, -1.55);
    group.add(wing);

    // Full-width continuous Porsche LED tail bar
    const tlGeom = new THREE.BoxGeometry(1.6, 0.08, 0.08);
    const tailBar = new THREE.Mesh(tlGeom, tailLightMat);
    tailBar.position.set(0, 0.58, -1.72);
    group.add(tailBar);

    // Wheels (extra wide rear tires)
    const wheels = [];
    const wFL = CarModelBuilder.createWheel(tireMat, rimMat, 0.35, 0.28);
    wFL.position.set(0.86, 0.35, 1.1);
    const wFR = CarModelBuilder.createWheel(tireMat, rimMat, 0.35, 0.28);
    wFR.position.set(-0.86, 0.35, 1.1);

    const wRL = CarModelBuilder.createWheel(tireMat, rimMat, 0.38, 0.36);
    wRL.position.set(0.92, 0.38, -1.05);
    const wRR = CarModelBuilder.createWheel(tireMat, rimMat, 0.38, 0.36);
    wRR.position.set(-0.92, 0.38, -1.05);

    [wFL, wFR, wRL, wRR].forEach(w => { group.add(w); wheels.push(w); });
    group.userData.wheels = wheels;
  }

  // 7. CHEVROLET CORVETTE C8 (American Mid-Engine Supercar)
  static buildCorvetteC8(group, bodyMat, roofMat, accentMat, glassMat, tireMat, rimMat, lightMat, tailLightMat) {
    const baseGeom = new THREE.BoxGeometry(1.84, 0.3, 3.6);
    const base = new THREE.Mesh(baseGeom, bodyMat);
    base.position.y = 0.38;
    base.castShadow = true;
    group.add(base);

    // Sharp wedge nose with front splitter
    const noseGeom = new THREE.BoxGeometry(1.72, 0.18, 1.25);
    const nose = new THREE.Mesh(noseGeom, bodyMat);
    nose.position.set(0, 0.44, 1.2);
    group.add(nose);

    const splitter = new THREE.Mesh(new THREE.BoxGeometry(1.88, 0.06, 0.3), accentMat);
    splitter.position.set(0, 0.24, 1.76);
    group.add(splitter);

    // Cockpit pushed forward (mid-engine proportions)
    const cabinGeom = new THREE.BoxGeometry(1.36, 0.44, 1.45);
    const cabin = new THREE.Mesh(cabinGeom, glassMat);
    cabin.position.set(0, 0.74, 0.25);
    cabin.castShadow = true;
    group.add(cabin);

    // Massive side air intake scoops behind doors
    [-0.92, 0.92].forEach(x => {
      const scoopGeom = new THREE.BoxGeometry(0.15, 0.28, 0.7);
      const scoop = new THREE.Mesh(scoopGeom, accentMat);
      scoop.position.set(x, 0.45, -0.4);
      group.add(scoop);
    });

    // Glass engine cover over mid-engine V8
    const engBay = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 1.1), glassMat);
    engBay.position.set(0, 0.68, -0.9);
    group.add(engBay);

    // High GT Wing on dual stanchions
    const wingGeom = new THREE.BoxGeometry(1.75, 0.06, 0.35);
    const wing = new THREE.Mesh(wingGeom, accentMat);
    wing.position.set(0, 0.98, -1.65);
    group.add(wing);

    [-0.5, 0.5].forEach(x => {
      const strut = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.32, 0.12), accentMat);
      strut.position.set(x, 0.76, -1.63);
      group.add(strut);
    });

    // Quad square exhaust pipes
    [-0.45, -0.3, 0.3, 0.45].forEach(x => {
      const pipe = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.2), accentMat);
      pipe.position.set(x, 0.32, -1.82);
      group.add(pipe);
    });

    // Sharp slanted LED headlights
    [-0.65, 0.65].forEach(x => {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.09, 0.12), lightMat);
      hl.position.set(x, 0.46, 1.72);
      group.add(hl);
    });

    // C8 double taillights
    [-0.6, 0.6].forEach(x => {
      const tl = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.12, 0.08), tailLightMat);
      tl.position.set(x, 0.54, -1.8);
      group.add(tl);
    });

    const wheels = [];
    const wFL = CarModelBuilder.createWheel(tireMat, rimMat, 0.34, 0.28);
    wFL.position.set(0.88, 0.34, 1.15);
    const wFR = CarModelBuilder.createWheel(tireMat, rimMat, 0.34, 0.28);
    wFR.position.set(-0.88, 0.34, 1.15);

    const wRL = CarModelBuilder.createWheel(tireMat, rimMat, 0.38, 0.36);
    wRL.position.set(0.93, 0.37, -1.08);
    const wRR = CarModelBuilder.createWheel(tireMat, rimMat, 0.38, 0.36);
    wRR.position.set(-0.93, 0.37, -1.08);

    [wFL, wFR, wRL, wRR].forEach(w => { group.add(w); wheels.push(w); });
    group.userData.wheels = wheels;
  }

  // 8. LAMBORGHINI HURACÁN EVO (Exotic Luxury Hypercar)
  static buildLamboHuracan(group, bodyMat, roofMat, accentMat, glassMat, tireMat, rimMat, lightMat, tailLightMat) {
    // Ultra low razor sharp wedge
    const baseGeom = new THREE.BoxGeometry(1.88, 0.28, 3.65);
    const base = new THREE.Mesh(baseGeom, bodyMat);
    base.position.y = 0.36;
    base.castShadow = true;
    group.add(base);

    // Front hexagonal aerodynamic nose
    const noseGeom = new THREE.BoxGeometry(1.75, 0.16, 1.3);
    const nose = new THREE.Mesh(noseGeom, bodyMat);
    nose.position.set(0, 0.4, 1.25);
    group.add(nose);

    // Massive carbon front air intakes
    [-0.55, 0.55].forEach(x => {
      const intake = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.18, 0.15), accentMat);
      intake.position.set(x, 0.28, 1.82);
      group.add(intake);
    });

    // Stealth fighter canopy cockpit
    const cabinGeom = new THREE.BoxGeometry(1.34, 0.42, 1.55);
    const cabin = new THREE.Mesh(cabinGeom, glassMat);
    cabin.position.set(0, 0.7, -0.05);
    cabin.castShadow = true;
    group.add(cabin);

    // Y-shaped daytime LED lights
    [-0.66, 0.66].forEach(x => {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.08, 0.12), lightMat);
      hl.position.set(x, 0.44, 1.72);
      group.add(hl);
    });

    // Huge Rear Diffuser and high-mounted dual sport exhausts
    const diff = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.15, 0.2), accentMat);
    diff.position.set(0, 0.26, -1.82);
    group.add(diff);

    [-0.32, 0.32].forEach(x => {
      const ex = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.25, 8), accentMat);
      ex.rotateX(Math.PI / 2);
      ex.position.set(x, 0.54, -1.84);
      group.add(ex);
    });

    // Wide racing spoiler
    const wingGeom = new THREE.BoxGeometry(1.82, 0.05, 0.38);
    const wing = new THREE.Mesh(wingGeom, accentMat);
    wing.position.set(0, 1.02, -1.62);
    group.add(wing);

    // Y-shaped taillight bar
    const tlGeom = new THREE.BoxGeometry(1.65, 0.08, 0.08);
    const tlBar = new THREE.Mesh(tlGeom, tailLightMat);
    tlBar.position.set(0, 0.58, -1.8);
    group.add(tlBar);

    const wheels = [];
    const wFL = CarModelBuilder.createWheel(tireMat, rimMat, 0.33, 0.28);
    wFL.position.set(0.9, 0.33, 1.18);
    const wFR = CarModelBuilder.createWheel(tireMat, rimMat, 0.33, 0.28);
    wFR.position.set(-0.9, 0.33, 1.18);

    const wRL = CarModelBuilder.createWheel(tireMat, rimMat, 0.38, 0.38);
    wRL.position.set(0.95, 0.36, -1.1);
    const wRR = CarModelBuilder.createWheel(tireMat, rimMat, 0.38, 0.38);
    wRR.position.set(-0.95, 0.36, -1.1);

    [wFL, wFR, wRL, wRR].forEach(w => { group.add(w); wheels.push(w); });
    group.userData.wheels = wheels;
  }

  static createPlayerIndicator() {
    const group = new THREE.Group();
    const geom = new THREE.ConeGeometry(0.35, 0.6, 4);
    geom.rotateX(Math.PI);
    const mat = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
    const cone = new THREE.Mesh(geom, mat);
    group.add(cone);

    const ringGeom = new THREE.RingGeometry(0.28, 0.36, 16);
    ringGeom.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ff88, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.position.y = -0.4;
    group.add(ring);

    group.position.y = 2.4;
    return group;
  }
}

window.CAR_CATALOG = CAR_CATALOG;
window.CarModelBuilder = CarModelBuilder;
