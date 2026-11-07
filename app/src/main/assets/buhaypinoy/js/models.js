// BUHAY PINOY - 3D Low-Poly Procedural Philippine Models
const ModelBuilder = {
  // Shared materials for performance and low-poly aesthetic
  materials: {
    asphalt: new THREE.MeshLambertMaterial({ color: 0x27272a }),
    roadLineYellow: new THREE.MeshLambertMaterial({ color: 0xfacc15 }),
    roadLineWhite: new THREE.MeshLambertMaterial({ color: 0xf8fafc }),
    concrete: new THREE.MeshLambertMaterial({ color: 0x94a3b8 }),
    grass: new THREE.MeshLambertMaterial({ color: 0x22c55e }),
    paddyGrass: new THREE.MeshLambertMaterial({ color: 0x16a34a }),
    mud: new THREE.MeshLambertMaterial({ color: 0x78350f }),
    bamboo: new THREE.MeshLambertMaterial({ color: 0xd97706 }),
    nipaRoof: new THREE.MeshLambertMaterial({ color: 0xb45309 }),
    woodDark: new THREE.MeshLambertMaterial({ color: 0x451a03 }),
    tinRoofBlue: new THREE.MeshLambertMaterial({ color: 0x1e3a8a }),
    tinRoofRed: new THREE.MeshLambertMaterial({ color: 0x991b1b }),
    tinRoofGreen: new THREE.MeshLambertMaterial({ color: 0x065f46 }),
    wallWhite: new THREE.MeshLambertMaterial({ color: 0xf1f5f9 }),
    wallYellow: new THREE.MeshLambertMaterial({ color: 0xfef08a }),
    wallCyan: new THREE.MeshLambertMaterial({ color: 0xbae6fd }),
    chrome: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.85 }),
    tire: new THREE.MeshLambertMaterial({ color: 0x18181b }),
    rim: new THREE.MeshLambertMaterial({ color: 0xd4d4d8 }),
    glass: new THREE.MeshLambertMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.65 }),
    lampGlow: new THREE.MeshBasicMaterial({ color: 0xfef08a }),
    redLight: new THREE.MeshBasicMaterial({ color: 0xef4444 }),
    palmTrunk: new THREE.MeshLambertMaterial({ color: 0x78350f }),
    palmFrond: new THREE.MeshLambertMaterial({ color: 0x15803d }),
    coconut: new THREE.MeshLambertMaterial({ color: 0x451a03 }),
    bougainvillea: new THREE.MeshLambertMaterial({ color: 0xdb2777 }), // Magenta
    cocaColaRed: new THREE.MeshLambertMaterial({ color: 0xdc2626 }),
    plasticBlue: new THREE.MeshLambertMaterial({ color: 0x2563eb }),
    plasticRed: new THREE.MeshLambertMaterial({ color: 0xe11d48 }),
    metalKaldero: new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.3, metalness: 0.7 }),
    bballCourtBlue: new THREE.MeshLambertMaterial({ color: 0x1d4ed8 }),
    bballCourtYellow: new THREE.MeshLambertMaterial({ color: 0xeab308 }),
    bballBackboard: new THREE.MeshLambertMaterial({ color: 0xffffff }),
    bballRim: new THREE.MeshLambertMaterial({ color: 0xf97316 }),
  },

  // 1. PHILIPPINE JEEPNEY
  createJeepney: function(colorHex = 0xdc2626, routeText = "CALAMBA - LOS BAÑOS") {
    const group = new THREE.Group();
    const jeepMat = new THREE.MeshLambertMaterial({ color: colorHex });

    // Chassis & Hood
    const hoodGeo = new THREE.BoxGeometry(1.6, 0.9, 2.0);
    const hood = new THREE.Mesh(hoodGeo, jeepMat);
    hood.position.set(0, 0.85, 1.4);
    hood.castShadow = true;
    group.add(hood);

    // Front Chrome Grille
    const grilleGeo = new THREE.BoxGeometry(1.4, 0.6, 0.1);
    const grille = new THREE.Mesh(grilleGeo, this.materials.chrome);
    grille.position.set(0, 0.8, 2.45);
    group.add(grille);

    // Front Bumper
    const bumperGeo = new THREE.BoxGeometry(1.8, 0.25, 0.3);
    const bumper = new THREE.Mesh(bumperGeo, this.materials.chrome);
    bumper.position.set(0, 0.45, 2.5);
    group.add(bumper);

    // Chrome Horse Ornament on Hood
    const horseGeo = new THREE.ConeGeometry(0.12, 0.25, 5);
    const horse = new THREE.Mesh(horseGeo, this.materials.chrome);
    horse.rotation.x = Math.PI / 2;
    horse.position.set(0, 1.35, 2.3);
    group.add(horse);

    // Round Headlights
    const hlGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.1, 8);
    hlGeo.rotateX(Math.PI / 2);
    const hlLeft = new THREE.Mesh(hlGeo, this.materials.lampGlow);
    hlLeft.position.set(-0.55, 0.85, 2.46);
    const hlRight = new THREE.Mesh(hlGeo, this.materials.lampGlow);
    hlRight.position.set(0.55, 0.85, 2.46);
    group.add(hlLeft, hlRight);

    // Main Passenger Body (Long Cabin)
    const bodyGeo = new THREE.BoxGeometry(1.7, 1.1, 3.8);
    const body = new THREE.Mesh(bodyGeo, jeepMat);
    body.position.set(0, 0.95, -1.2);
    body.castShadow = true;
    group.add(body);

    // Roof Canopy with overhang
    const roofGeo = new THREE.BoxGeometry(1.8, 0.15, 5.4);
    const roof = new THREE.Mesh(roofGeo, this.materials.wallWhite);
    roof.position.set(0, 2.05, -0.2);
    roof.castShadow = true;
    group.add(roof);

    // Roof Luggage Rails
    const railGeo = new THREE.BoxGeometry(1.6, 0.15, 4.6);
    const rail = new THREE.Mesh(railGeo, this.materials.chrome);
    rail.position.set(0, 2.18, -0.3);
    group.add(rail);

    // Roof Signboard (Route)
    const signGeo = new THREE.BoxGeometry(1.4, 0.25, 0.08);
    const sign = new THREE.Mesh(signGeo, this.materials.bballCourtYellow);
    sign.position.set(0, 2.2, 2.0);
    group.add(sign);

    // Windshield
    const windshieldGeo = new THREE.BoxGeometry(1.5, 0.55, 0.05);
    const windshield = new THREE.Mesh(windshieldGeo, this.materials.glass);
    windshield.position.set(0, 1.6, 0.45);
    group.add(windshield);

    // Chrome Pillars supporting roof
    const pillarGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 6);
    const pillarPositions = [
      [-0.8, 1.6, 0.4], [0.8, 1.6, 0.4],
      [-0.8, 1.6, -0.8], [0.8, 1.6, -0.8],
      [-0.8, 1.6, -2.0], [0.8, 1.6, -2.0],
      [-0.8, 1.6, -2.9], [0.8, 1.6, -2.9]
    ];
    pillarPositions.forEach(pos => {
      const p = new THREE.Mesh(pillarGeo, this.materials.chrome);
      p.position.set(pos[0], pos[1], pos[2]);
      group.add(p);
    });

    // Rear Entry Step
    const stepGeo = new THREE.BoxGeometry(1.2, 0.15, 0.4);
    const step = new THREE.Mesh(stepGeo, this.materials.chrome);
    step.position.set(0, 0.35, -3.2);
    group.add(step);

    // 4 Heavy-duty Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.28, 12);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelPositions = [
      [-0.9, 0.38, 1.4], [0.9, 0.38, 1.4],
      [-0.9, 0.38, -1.8], [0.9, 0.38, -1.8]
    ];
    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeo, this.materials.tire);
      wheel.position.set(pos[0], pos[1], pos[2]);
      wheel.castShadow = true;
      const rimMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.3, 8), this.materials.rim);
      rimMesh.rotateZ(Math.PI / 2);
      wheel.add(rimMesh);
      group.add(wheel);
    });

    return group;
  },

  // 2. PHILIPPINE TRICYCLE
  createTricycle: function(sidecarColor = 0x2563eb) {
    const group = new THREE.Group();
    const sidecarMat = new THREE.MeshLambertMaterial({ color: sidecarColor });

    // Motorcycle frame
    const bikeBodyGeo = new THREE.BoxGeometry(0.35, 0.45, 1.6);
    const bikeBody = new THREE.Mesh(bikeBodyGeo, this.materials.asphalt);
    bikeBody.position.set(-0.55, 0.65, 0);
    group.add(bikeBody);

    // Motorcycle Gas Tank & Seat
    const tankGeo = new THREE.BoxGeometry(0.38, 0.3, 0.6);
    const tank = new THREE.Mesh(tankGeo, sidecarMat);
    tank.position.set(-0.55, 0.85, 0.2);
    group.add(tank);

    const seatGeo = new THREE.BoxGeometry(0.32, 0.15, 0.6);
    const seat = new THREE.Mesh(seatGeo, this.materials.tire);
    seat.position.set(-0.55, 0.8, -0.35);
    group.add(seat);

    // Handlebars
    const handleGeo = new THREE.BoxGeometry(0.8, 0.06, 0.06);
    const handle = new THREE.Mesh(handleGeo, this.materials.chrome);
    handle.position.set(-0.55, 1.05, 0.55);
    group.add(handle);

    // Motorcycle Wheels (Front & Rear)
    const mWheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.12, 10);
    mWheelGeo.rotateZ(Math.PI / 2);
    const mFront = new THREE.Mesh(mWheelGeo, this.materials.tire);
    mFront.position.set(-0.55, 0.3, 0.8);
    const mRear = new THREE.Mesh(mWheelGeo, this.materials.tire);
    mRear.position.set(-0.55, 0.3, -0.7);
    group.add(mFront, mRear);

    // Sidecar Passenger Tub
    const tubGeo = new THREE.BoxGeometry(0.95, 0.65, 1.7);
    const tub = new THREE.Mesh(tubGeo, sidecarMat);
    tub.position.set(0.5, 0.65, 0);
    tub.castShadow = true;
    group.add(tub);

    // Sidecar Canopy Roof
    const cRoofGeo = new THREE.BoxGeometry(1.1, 0.1, 1.8);
    const cRoof = new THREE.Mesh(cRoofGeo, this.materials.wallWhite);
    cRoof.position.set(0.5, 1.65, 0);
    group.add(cRoof);

    // Sidecar Windshield
    const cWindGeo = new THREE.BoxGeometry(0.85, 0.45, 0.05);
    const cWind = new THREE.Mesh(cWindGeo, this.materials.glass);
    cWind.position.set(0.5, 1.25, 0.7);
    group.add(cWind);

    // Sidecar 3rd Wheel
    const sideWheel = new THREE.Mesh(mWheelGeo, this.materials.tire);
    sideWheel.position.set(1.05, 0.3, -0.1);
    group.add(sideWheel);

    return group;
  },

  // 3. ALING NENA'S SARI-SARI STORE
  createSariSariStore: function() {
    const group = new THREE.Group();

    // Main concrete / wooden shack building
    const baseGeo = new THREE.BoxGeometry(4.5, 3.2, 4.0);
    const base = new THREE.Mesh(baseGeo, this.materials.wallYellow);
    base.position.set(0, 1.6, 0);
    base.castShadow = true;
    group.add(base);

    // Corrugated GI Roof
    const roofGeo = new THREE.BoxGeometry(5.0, 0.3, 4.8);
    const roof = new THREE.Mesh(roofGeo, this.materials.tinRoofRed);
    roof.position.set(0, 3.35, 0);
    roof.rotation.x = -0.06;
    roof.castShadow = true;
    group.add(roof);

    // Red Coca-Cola Signboard
    const signGeo = new THREE.BoxGeometry(3.6, 0.65, 0.12);
    const sign = new THREE.Mesh(signGeo, this.materials.cocaColaRed);
    sign.position.set(0, 2.7, 2.05);
    group.add(sign);

    // Store Service Window Counter
    const counterGeo = new THREE.BoxGeometry(2.6, 0.9, 0.6);
    const counter = new THREE.Mesh(counterGeo, this.materials.woodDark);
    counter.position.set(0, 0.55, 2.2);
    group.add(counter);

    // Metal Grille / Bars Window (Classic Filipino anti-theft window)
    const barGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.1, 4);
    for (let x = -1.1; x <= 1.1; x += 0.22) {
      const bar = new THREE.Mesh(barGeo, this.materials.chrome);
      bar.position.set(x, 1.55, 2.05);
      group.add(bar);
    }

    // Colorful Hanging Snack Bags (Chippy, Piattos, Mang Juan)
    const snackColors = [0xef4444, 0x3b82f6, 0x10b981, 0xf59e0b];
    for (let i = 0; i < 6; i++) {
      const bagGeo = new THREE.BoxGeometry(0.16, 0.24, 0.05);
      const bagMat = new THREE.MeshLambertMaterial({ color: snackColors[i % snackColors.length] });
      const bag = new THREE.Mesh(bagGeo, bagMat);
      bag.position.set(-0.9 + i * 0.36, 1.9, 2.08);
      group.add(bag);
    }

    // Wooden Bench outside for tambay
    const bench = this.createParkBench();
    bench.position.set(-1.8, 0, 2.6);
    bench.rotation.y = Math.PI / 8;
    group.add(bench);

    return group;
  },

  // 4. NANAY ROSA'S CARINDERIA (EATERY)
  createCarinderia: function() {
    const group = new THREE.Group();

    // Main kitchen structure
    const kitchenGeo = new THREE.BoxGeometry(5.0, 3.2, 3.5);
    const kitchen = new THREE.Mesh(kitchenGeo, this.materials.wallCyan);
    kitchen.position.set(0, 1.6, -1.5);
    kitchen.castShadow = true;
    group.add(kitchen);

    // Dining Covered Awning Roof
    const canopyGeo = new THREE.BoxGeometry(5.4, 0.2, 4.5);
    const canopy = new THREE.Mesh(canopyGeo, this.materials.tinRoofBlue);
    canopy.position.set(0, 3.1, 1.2);
    canopy.rotation.x = 0.05;
    canopy.castShadow = true;
    group.add(canopy);

    // Awning support posts
    const postGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.9, 6);
    const p1 = new THREE.Mesh(postGeo, this.materials.concrete);
    p1.position.set(-2.4, 1.45, 3.2);
    const p2 = new THREE.Mesh(postGeo, this.materials.concrete);
    p2.position.set(2.4, 1.45, 3.2);
    group.add(p1, p2);

    // Food Display Counter
    const counterGeo = new THREE.BoxGeometry(3.6, 0.9, 0.8);
    const counter = new THREE.Mesh(counterGeo, this.materials.wallWhite);
    counter.position.set(0, 0.45, 0.5);
    group.add(counter);

    // Silver Kaldero Pots with Lids
    for (let i = 0; i < 4; i++) {
      const potGeo = new THREE.CylinderGeometry(0.2, 0.18, 0.22, 10);
      const pot = new THREE.Mesh(potGeo, this.materials.metalKaldero);
      pot.position.set(-1.2 + i * 0.8, 1.0, 0.5);
      const lid = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.08, 10), this.materials.metalKaldero);
      lid.position.set(-1.2 + i * 0.8, 1.14, 0.5);
      group.add(pot, lid);
    }

    // Carinderia Signboard
    const signGeo = new THREE.BoxGeometry(4.2, 0.65, 0.1);
    const sign = new THREE.Mesh(signGeo, this.materials.bballCourtYellow);
    sign.position.set(0, 2.65, 1.8);
    group.add(sign);

    // Monobloc Chairs & Dining Table
    const tableGeo = new THREE.BoxGeometry(1.6, 0.75, 1.0);
    const table = new THREE.Mesh(tableGeo, this.materials.plasticBlue);
    table.position.set(0, 0.38, 2.3);
    group.add(table);

    const chairGeo = new THREE.BoxGeometry(0.45, 0.55, 0.45);
    const c1 = new THREE.Mesh(chairGeo, this.materials.plasticRed);
    c1.position.set(-1.1, 0.28, 2.3);
    const c2 = new THREE.Mesh(chairGeo, this.materials.plasticRed);
    c2.position.set(1.1, 0.28, 2.3);
    group.add(c1, c2);

    return group;
  },

  // 5. COVERED BARANGAY BASKETBALL COURT
  createBasketballCourt: function() {
    const group = new THREE.Group();

    // Concrete Painted Court Floor (Standard Philippine barangay court)
    const floorGeo = new THREE.BoxGeometry(16, 0.2, 26);
    const floor = new THREE.Mesh(floorGeo, this.materials.concrete);
    floor.position.set(0, 0.1, 0);
    group.add(floor);

    // Center Circle (Yellow/Blue)
    const centerCircleGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.22, 20);
    const centerCircle = new THREE.Mesh(centerCircleGeo, this.materials.bballCourtYellow);
    centerCircle.position.set(0, 0.11, 0);
    group.add(centerCircle);

    // High Arched Metal Gymnasium Roof
    const roofArches = 5;
    for (let i = 0; i < roofArches; i++) {
      const zPos = -12 + (i * 6);
      // Steel Column Left & Right
      const colGeo = new THREE.CylinderGeometry(0.18, 0.18, 7.5, 6);
      const colL = new THREE.Mesh(colGeo, this.materials.tinRoofBlue);
      colL.position.set(-8.2, 3.75, zPos);
      const colR = new THREE.Mesh(colGeo, this.materials.tinRoofBlue);
      colR.position.set(8.2, 3.75, zPos);
      group.add(colL, colR);

      // Curved / Angled Truss
      const trussGeo = new THREE.BoxGeometry(17, 0.35, 0.35);
      const truss = new THREE.Mesh(trussGeo, this.materials.tinRoofBlue);
      truss.position.set(0, 7.5, zPos);
      group.add(truss);
    }

    // Corrugated Curving Roof Cover
    const roofCoverGeo = new THREE.BoxGeometry(18, 0.25, 27);
    const roofCover = new THREE.Mesh(roofCoverGeo, this.materials.tinRoofGreen);
    roofCover.position.set(0, 7.7, 0);
    roofCover.castShadow = true;
    group.add(roofCover);

    // Basketball Hoops & Backboards (Both ends)
    [-11.5, 11.5].forEach((zPos, idx) => {
      const hoopPostGeo = new THREE.CylinderGeometry(0.12, 0.12, 4.2, 8);
      const hoopPost = new THREE.Mesh(hoopPostGeo, this.materials.chrome);
      hoopPost.position.set(0, 2.1, zPos);
      group.add(hoopPost);

      // Backboard
      const bbGeo = new THREE.BoxGeometry(2.2, 1.4, 0.1);
      const bb = new THREE.Mesh(bbGeo, this.materials.bballBackboard);
      bb.position.set(0, 3.4, zPos + (idx === 0 ? 0.6 : -0.6));
      group.add(bb);

      // Rim
      const rimGeo = new THREE.TorusGeometry(0.35, 0.04, 8, 16);
      rimGeo.rotateX(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, this.materials.bballRim);
      rim.position.set(0, 3.05, zPos + (idx === 0 ? 0.95 : -0.95));
      group.add(rim);
    });

    // Bleachers / Audience Seating (Side)
    const bleacherGeo = new THREE.BoxGeometry(2.4, 1.5, 16);
    const bleacher = new THREE.Mesh(bleacherGeo, this.materials.concrete);
    bleacher.position.set(9.6, 0.75, 0);
    group.add(bleacher);

    return group;
  },

  // 6. BARANGAY HALL
  createBarangayHall: function() {
    const group = new THREE.Group();

    // 2-Story Building
    const bldgGeo = new THREE.BoxGeometry(10, 6.5, 8);
    const bldg = new THREE.Mesh(bldgGeo, this.materials.wallWhite);
    bldg.position.set(0, 3.25, 0);
    bldg.castShadow = true;
    group.add(bldg);

    // Blue/Yellow Accent Fascia
    const fasciaGeo = new THREE.BoxGeometry(10.4, 0.8, 8.4);
    const fascia = new THREE.Mesh(fasciaGeo, this.materials.bballCourtBlue);
    fascia.position.set(0, 6.4, 0);
    group.add(fascia);

    // Front Balcony & Entrance Columns
    const colGeo = new THREE.CylinderGeometry(0.25, 0.25, 3.2, 8);
    [-3.5, 3.5].forEach(x => {
      const col = new THREE.Mesh(colGeo, this.materials.wallYellow);
      col.position.set(x, 1.6, 4.3);
      group.add(col);
    });

    // Front Canopy
    const frontCanopy = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.3, 2.5), this.materials.bballCourtBlue);
    frontCanopy.position.set(0, 3.3, 4.8);
    group.add(frontCanopy);

    // Official Barangay Signboard
    const signGeo = new THREE.BoxGeometry(6.5, 0.9, 0.15);
    const sign = new THREE.Mesh(signGeo, this.materials.bballCourtYellow);
    sign.position.set(0, 5.0, 4.1);
    group.add(sign);

    // Tall Philippine Flagpole with Flag
    const poleGeo = new THREE.CylinderGeometry(0.06, 0.08, 9.5, 8);
    const pole = new THREE.Mesh(poleGeo, this.materials.chrome);
    pole.position.set(6.5, 4.75, 5.0);
    group.add(pole);

    // Flag (Blue top, Red bottom, White triangle)
    const flagGeo = new THREE.BoxGeometry(1.6, 0.9, 0.02);
    const flag = new THREE.Mesh(flagGeo, this.materials.bballCourtBlue);
    flag.position.set(7.3, 8.8, 5.0);
    group.add(flag);

    return group;
  },

  // 7. BAHAY KUBO (TRADITIONAL NIPA HUT)
  createBahayKubo: function() {
    const group = new THREE.Group();

    // Bamboo Stilts
    const stiltGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.4, 6);
    const stiltCoords = [
      [-1.4, 0.7, -1.4], [1.4, 0.7, -1.4],
      [-1.4, 0.7, 1.4], [1.4, 0.7, 1.4]
    ];
    stiltCoords.forEach(pos => {
      const s = new THREE.Mesh(stiltGeo, this.materials.bamboo);
      s.position.set(pos[0], pos[1], pos[2]);
      group.add(s);
    });

    // Wooden Slatted Floor
    const floorGeo = new THREE.BoxGeometry(3.2, 0.2, 3.2);
    const floor = new THREE.Mesh(floorGeo, this.materials.bamboo);
    floor.position.set(0, 1.4, 0);
    group.add(floor);

    // Sawali / Bamboo Woven Walls
    const wallGeo = new THREE.BoxGeometry(3.0, 1.8, 3.0);
    const wall = new THREE.Mesh(wallGeo, this.materials.bamboo);
    wall.position.set(0, 2.4, 0);
    wall.castShadow = true;
    group.add(wall);

    // Steep High-Pitched Nipa Thatched Roof
    const roofGeo = new THREE.ConeGeometry(2.8, 2.2, 4);
    roofGeo.rotateY(Math.PI / 4);
    const roof = new THREE.Mesh(roofGeo, this.materials.nipaRoof);
    roof.position.set(0, 4.2, 0);
    roof.castShadow = true;
    group.add(roof);

    // Small Bamboo Entry Ladder
    const ladderGeo = new THREE.BoxGeometry(0.6, 1.6, 0.15);
    const ladder = new THREE.Mesh(ladderGeo, this.materials.woodDark);
    ladder.position.set(0, 0.7, 1.8);
    ladder.rotation.x = -0.3;
    group.add(ladder);

    return group;
  },

  // 8. FILIPINO RESIDENTIAL HOUSE (BUNGALOW)
  createFilipinoHouse: function(wallMat = null, roofColor = 0x991b1b) {
    const group = new THREE.Group();
    const wMat = wallMat || this.materials.wallYellow;
    const rMat = new THREE.MeshLambertMaterial({ color: roofColor });

    // Main House
    const houseGeo = new THREE.BoxGeometry(6.0, 3.4, 6.0);
    const house = new THREE.Mesh(houseGeo, wMat);
    house.position.set(0, 1.7, 0);
    house.castShadow = true;
    group.add(house);

    // Corrugated GI Hip Roof
    const roofGeo = new THREE.ConeGeometry(4.8, 2.0, 4);
    roofGeo.rotateY(Math.PI / 4);
    const roof = new THREE.Mesh(roofGeo, rMat);
    roof.position.set(0, 4.3, 0);
    roof.castShadow = true;
    group.add(roof);

    // Front Porch & Gate Fence
    const fenceGeo = new THREE.BoxGeometry(7.2, 1.0, 0.2);
    const fence = new THREE.Mesh(fenceGeo, this.materials.concrete);
    fence.position.set(0, 0.5, 4.0);
    group.add(fence);

    // Jalousie Glass Windows
    const winGeo = new THREE.BoxGeometry(1.4, 1.2, 0.1);
    const winL = new THREE.Mesh(winGeo, this.materials.glass);
    winL.position.set(-1.8, 2.0, 3.05);
    const winR = new THREE.Mesh(winGeo, this.materials.glass);
    winR.position.set(1.8, 2.0, 3.05);
    group.add(winL, winR);

    // Front Wooden Door
    const doorGeo = new THREE.BoxGeometry(1.0, 2.0, 0.1);
    const door = new THREE.Mesh(doorGeo, this.materials.woodDark);
    door.position.set(0, 1.0, 3.05);
    group.add(door);

    return group;
  },

  // 9. TALIPAPA / LOCAL MARKET STALLS
  createTalipapa: function() {
    const group = new THREE.Group();

    // 3 Connected Stalls with Striped Canopies
    for (let i = 0; i < 3; i++) {
      const stallX = -3.2 + (i * 3.2);
      const stallGroup = new THREE.Group();
      stallGroup.position.x = stallX;

      // Wooden Table Frame
      const tableGeo = new THREE.BoxGeometry(2.8, 0.85, 1.6);
      const table = new THREE.Mesh(tableGeo, this.materials.woodDark);
      table.position.set(0, 0.42, 0);
      stallGroup.add(table);

      // Wooden Crates of Produce (Yellow Mangoes, Bananas, Greens)
      const crateColors = [0xeab308, 0x16a34a, 0xef4444];
      for (let c = 0; c < 3; c++) {
        const crateGeo = new THREE.BoxGeometry(0.7, 0.35, 0.6);
        const crate = new THREE.Mesh(crateGeo, new THREE.MeshLambertMaterial({ color: crateColors[c] }));
        crate.position.set(-0.8 + c * 0.8, 0.95, 0);
        stallGroup.add(crate);
      }

      // 4 Bamboo Roof Posts
      const postGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.8, 6);
      [[-1.3, -0.7], [1.3, -0.7], [-1.3, 0.7], [1.3, 0.7]].forEach(p => {
        const post = new THREE.Mesh(postGeo, this.materials.bamboo);
        post.position.set(p[0], 1.4, p[1]);
        stallGroup.add(post);
      });

      // Tarp Canopy Awning
      const canopyGeo = new THREE.BoxGeometry(3.0, 0.1, 2.0);
      const canopyMat = i % 2 === 0 ? this.materials.tinRoofRed : this.materials.tinRoofGreen;
      const canopy = new THREE.Mesh(canopyGeo, canopyMat);
      canopy.position.set(0, 2.7, 0);
      canopy.rotation.x = 0.08;
      stallGroup.add(canopy);

      group.add(stallGroup);
    }

    return group;
  },

  // 10. TROPICAL VEGETATION
  createCoconutTree: function(height = 6.5) {
    const group = new THREE.Group();

    // Curved Segmented Trunk
    const segments = 6;
    let currY = 0;
    let currX = 0;
    for (let i = 0; i < segments; i++) {
      const segH = height / segments;
      const segGeo = new THREE.CylinderGeometry(0.22 - (i * 0.015), 0.26 - (i * 0.015), segH, 7);
      const seg = new THREE.Mesh(segGeo, this.materials.palmTrunk);
      const tilt = 0.04 * (i + 1);
      currX += Math.sin(tilt) * segH;
      currY += Math.cos(tilt) * segH;
      seg.position.set(currX, currY - segH / 2, 0);
      seg.rotation.z = -tilt;
      seg.castShadow = true;
      group.add(seg);
    }

    // Top Fronds (Drooping Palm Leaves)
    const frondCount = 7;
    for (let f = 0; f < frondCount; f++) {
      const angle = (f / frondCount) * Math.PI * 2;
      const frondGeo = new THREE.ConeGeometry(0.65, 2.8, 4);
      frondGeo.rotateX(Math.PI / 2.5);
      const frond = new THREE.Mesh(frondGeo, this.materials.palmFrond);
      frond.position.set(currX, currY, 0);
      frond.rotation.y = angle;
      frond.castShadow = true;
      group.add(frond);
    }

    // Coconuts cluster
    for (let c = 0; c < 3; c++) {
      const cGeo = new THREE.SphereGeometry(0.18, 6, 6);
      const coco = new THREE.Mesh(cGeo, this.materials.coconut);
      coco.position.set(currX + Math.cos(c * 2) * 0.25, currY - 0.2, Math.sin(c * 2) * 0.25);
      group.add(coco);
    }

    return group;
  },

  createBananaTree: function() {
    const group = new THREE.Group();
    // Stem
    const stemGeo = new THREE.CylinderGeometry(0.18, 0.24, 2.6, 6);
    const stem = new THREE.Mesh(stemGeo, this.materials.grass);
    stem.position.y = 1.3;
    group.add(stem);

    // Large broad leaves
    for (let i = 0; i < 5; i++) {
      const leafGeo = new THREE.BoxGeometry(0.8, 0.04, 2.2);
      const leaf = new THREE.Mesh(leafGeo, this.materials.palmFrond);
      leaf.position.set(0, 2.5, 0);
      leaf.rotation.y = (i / 5) * Math.PI * 2;
      leaf.rotation.x = 0.45;
      group.add(leaf);
    }
    return group;
  },

  createBougainvillea: function(radius = 1.4) {
    const group = new THREE.Group();
    // Bush base
    const baseBush = new THREE.Mesh(new THREE.DodecahedronGeometry(radius, 1), this.materials.grass);
    baseBush.position.y = radius * 0.8;
    baseBush.scale.set(1.2, 0.9, 1.2);
    group.add(baseBush);

    // Magenta Flower Clusters
    for (let i = 0; i < 8; i++) {
      const flower = new THREE.Mesh(new THREE.DodecahedronGeometry(radius * 0.35, 0), this.materials.bougainvillea);
      const ang = (i / 8) * Math.PI * 2;
      flower.position.set(
        Math.cos(ang) * (radius * 0.9),
        radius * (0.6 + Math.random() * 0.4),
        Math.sin(ang) * (radius * 0.9)
      );
      group.add(flower);
    }
    return group;
  },

  // 11. ELECTRICAL UTILITY POLE ("SPAGHETTI WIRES")
  createUtilityPole: function() {
    const group = new THREE.Group();

    // Concrete Pole
    const poleGeo = new THREE.CylinderGeometry(0.18, 0.24, 9.0, 8);
    const pole = new THREE.Mesh(poleGeo, this.materials.concrete);
    pole.position.y = 4.5;
    pole.castShadow = true;
    group.add(pole);

    // Crossarms
    const arm1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.15, 0.15), this.materials.woodDark);
    arm1.position.set(0, 8.2, 0);
    const arm2 = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.15, 0.15), this.materials.woodDark);
    arm2.position.set(0, 7.4, 0);
    group.add(arm1, arm2);

    // Grey Cylinder Transformer Can
    const transGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.85, 8);
    const trans = new THREE.Mesh(transGeo, this.materials.concrete);
    trans.position.set(0.45, 6.8, 0);
    group.add(trans);

    // Streetlamp attached to pole
    const lampArm = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 0.08), this.materials.chrome);
    lampArm.position.set(-0.6, 6.0, 0);
    const lampHead = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.3, 8), this.materials.chrome);
    lampHead.position.set(-1.1, 5.85, 0);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 6, 6), this.materials.lampGlow);
    bulb.position.set(-1.1, 5.72, 0);
    group.add(lampArm, lampHead, bulb);

    return group;
  },

  createParkBench: function() {
    const group = new THREE.Group();
    // Slats
    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.1, 0.5), this.materials.woodDark);
    seat.position.y = 0.45;
    const back = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.4, 0.08), this.materials.woodDark);
    back.position.set(0, 0.75, -0.22);
    // Iron Legs
    const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.5), this.materials.asphalt);
    leg1.position.set(-0.75, 0.22, 0);
    const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.5), this.materials.asphalt);
    leg2.position.set(0.75, 0.22, 0);
    group.add(seat, back, leg1, leg2);
    return group;
  }
};

window.ModelBuilder = ModelBuilder;
