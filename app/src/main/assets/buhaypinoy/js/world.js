// BUHAY PINOY - Laguna Map World Layout & Collision System
class LagunaWorld {
  constructor(scene) {
    this.scene = scene;
    this.colliders = []; // Array of AABB { minX, maxX, minZ, maxZ }
    this.interactiveZones = []; // Array of { id, name, type, x, z, radius, prompt, onInteract }
    this.streetLights = [];
  }

  buildWorld() {
    this.createTerrain();
    this.createRoads();
    this.createBuildings();
    this.createRecreation();
    this.createVehicles();
    this.createVegetation();
    this.createStreetFurniture();
  }

  // 1. TERRAIN & GROUND
  createTerrain() {
    // Main town ground (Lush tropical green grass)
    const groundGeo = new THREE.PlaneGeometry(180, 180);
    groundGeo.rotateX(-Math.PI / 2);
    const ground = new THREE.Mesh(groundGeo, ModelBuilder.materials.grass);
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Rice Fields (Palayan) on the Western outskirts
    const paddyGeo = new THREE.PlaneGeometry(55, 60);
    paddyGeo.rotateX(-Math.PI / 2);
    const paddy = new THREE.Mesh(paddyGeo, ModelBuilder.materials.paddyGrass);
    paddy.position.set(-55, 0.02, 20);
    paddy.receiveShadow = true;
    this.scene.add(paddy);

    // Mud dykes dividing the rice field
    for (let i = -2; i <= 2; i++) {
      const dykeGeo = new THREE.BoxGeometry(55, 0.15, 0.8);
      const dyke = new THREE.Mesh(dykeGeo, ModelBuilder.materials.mud);
      dyke.position.set(-55, 0.08, 20 + i * 12);
      this.scene.add(dyke);
    }
  }

  // 2. ROADS & SIDEWALKS (Rizal Ave & Mabini St)
  createRoads() {
    // East-West Main Highway (Rizal Avenue)
    const mainRoadGeo = new THREE.PlaneGeometry(160, 10);
    mainRoadGeo.rotateX(-Math.PI / 2);
    const mainRoad = new THREE.Mesh(mainRoadGeo, ModelBuilder.materials.asphalt);
    mainRoad.position.set(0, 0.03, 0);
    mainRoad.receiveShadow = true;
    this.scene.add(mainRoad);

    // Double Yellow Centerline
    for (let x = -75; x <= 75; x += 5) {
      const lineGeo = new THREE.PlaneGeometry(3, 0.25);
      lineGeo.rotateX(-Math.PI / 2);
      const line = new THREE.Mesh(lineGeo, ModelBuilder.materials.roadLineYellow);
      line.position.set(x, 0.04, 0);
      this.scene.add(line);
    }

    // Concrete Sidewalks along Main Road (North & South)
    [-5.6, 5.6].forEach(z => {
      const swGeo = new THREE.BoxGeometry(160, 0.2, 1.6);
      const sw = new THREE.Mesh(swGeo, ModelBuilder.materials.concrete);
      sw.position.set(0, 0.1, z);
      this.scene.add(sw);
    });

    // North-South Street (Mabini St towards Barangay Hall)
    const sideRoadGeo = new THREE.PlaneGeometry(8, 80);
    sideRoadGeo.rotateX(-Math.PI / 2);
    const sideRoad = new THREE.Mesh(sideRoadGeo, ModelBuilder.materials.asphalt);
    sideRoad.position.set(20, 0.03, 35);
    sideRoad.receiveShadow = true;
    this.scene.add(sideRoad);

    // White Zebra Pedestrian Crossing at intersection
    for (let z = -4; z <= 4; z += 1.2) {
      const crossGeo = new THREE.PlaneGeometry(1.5, 0.6);
      crossGeo.rotateX(-Math.PI / 2);
      const stripe = new THREE.Mesh(crossGeo, ModelBuilder.materials.roadLineWhite);
      stripe.position.set(15, 0.04, z);
      this.scene.add(stripe);
    }
  }

  // 3. BUILDINGS & PLACES
  createBuildings() {
    // A. ALING NENA'S SARI-SARI STORE (Corner of Rizal & Mabini)
    const sariSari = ModelBuilder.createSariSariStore();
    sariSari.position.set(10, 0, -9);
    this.scene.add(sariSari);
    this.addBoxCollider(10, -9, 5.2, 4.8);
    this.interactiveZones.push({
      id: 'sari_sari_store',
      name: 'Aling Nena\'s Store',
      type: 'store',
      x: 10,
      z: -6.5,
      radius: 3.5,
      prompt: 'Talk to Aling Nena (Pabili / Tindahan)',
      action: 'talk_aling_nena'
    });

    // B. NANAY ROSA'S CARINDERIA (Across the road)
    const carinderia = ModelBuilder.createCarinderia();
    carinderia.position.set(10, 0, 11);
    carinderia.rotation.y = Math.PI;
    this.scene.add(carinderia);
    this.addBoxCollider(10, 11, 5.8, 6.0);
    this.interactiveZones.push({
      id: 'carinderia',
      name: 'Nanay Rosa\'s Carinderia',
      type: 'restaurant',
      x: 10,
      z: 7.5,
      radius: 3.5,
      prompt: 'Kain sa Carinderia (Tapsilog / Ulam)',
      action: 'talk_nanay_rosa'
    });

    // C. TALIPAPA / LOCAL MARKET STALLS
    const talipapa = ModelBuilder.createTalipapa();
    talipapa.position.set(-16, 0, -10);
    this.scene.add(talipapa);
    this.addBoxCollider(-16, -10, 10.5, 3.5);
    this.interactiveZones.push({
      id: 'talipapa_market',
      name: 'Talipapa Market',
      type: 'market',
      x: -16,
      z: -7.5,
      radius: 4.0,
      prompt: 'Talipapa Produce & Job (Mang Kanor)',
      action: 'talk_mang_kanor'
    });

    // D. BARANGAY REAL HALL
    const brgyHall = ModelBuilder.createBarangayHall();
    brgyHall.position.set(20, 0, 60);
    this.scene.add(brgyHall);
    this.addBoxCollider(20, 60, 11.0, 9.5);
    this.interactiveZones.push({
      id: 'brgy_hall',
      name: 'Barangay Real Hall',
      type: 'civic',
      x: 20,
      z: 53.5,
      radius: 4.5,
      prompt: 'Talk to Kapitan Roger (Barangay Office)',
      action: 'talk_kapitan'
    });

    // E. RESIDENTIAL HOUSES
    // House 1 (Yellow House)
    const h1 = ModelBuilder.createFilipinoHouse(ModelBuilder.materials.wallYellow, 0x991b1b);
    h1.position.set(-30, 0, -14);
    this.scene.add(h1);
    this.addBoxCollider(-30, -14, 7.5, 7.5);

    // House 2 (Cyan House)
    const h2 = ModelBuilder.createFilipinoHouse(ModelBuilder.materials.wallCyan, 0x1e3a8a);
    h2.position.set(-42, 0, -14);
    this.scene.add(h2);
    this.addBoxCollider(-42, -14, 7.5, 7.5);

    // House 3 (White Bungalow)
    const h3 = ModelBuilder.createFilipinoHouse(ModelBuilder.materials.wallWhite, 0x065f46);
    h3.position.set(34, 0, -14);
    this.scene.add(h3);
    this.addBoxCollider(34, -14, 7.5, 7.5);

    // F. BAHAY KUBO (Near the Rice Field)
    const kubo = ModelBuilder.createBahayKubo();
    kubo.position.set(-25, 0, 16);
    this.scene.add(kubo);
    this.addBoxCollider(-25, 16, 4.0, 4.0);
    this.interactiveZones.push({
      id: 'bahay_kubo',
      name: 'Bahay Kubo ni Lolo',
      type: 'rest',
      x: -25,
      z: 19,
      radius: 3.0,
      prompt: 'Magpahinga sa Kubo (Rest & Relax)',
      action: 'rest_kubo'
    });
  }

  // 4. COVERED BASKETBALL COURT & PLAZA
  createRecreation() {
    // Covered Basketball Court (A vibrant landmark in every Philippine Barangay!)
    const court = ModelBuilder.createBasketballCourt();
    court.position.set(45, 0, 24);
    court.rotation.y = -Math.PI / 2;
    this.scene.add(court);
    this.addBoxCollider(45, 24, 28, 18);

    this.interactiveZones.push({
      id: 'basketball_court',
      name: 'Barangay Basketball Court',
      type: 'game',
      x: 45,
      z: 24,
      radius: 12.0,
      prompt: 'Mag-Shoot ng Bola kay Kuya Jun! [₱100 Shootout]',
      action: 'play_basketball'
    });

    // Town Plaza Park
    const plazaCenter = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.5, 0.25, 16), ModelBuilder.materials.concrete);
    plazaCenter.position.set(2, 0.12, 25);
    this.scene.add(plazaCenter);

    // Rizal Monument replica in Plaza
    const basePillar = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 1.6), ModelBuilder.materials.concrete);
    basePillar.position.set(2, 1.2, 25);
    const obelisk = new THREE.Mesh(new THREE.ConeGeometry(0.8, 3.0, 4), ModelBuilder.materials.concrete);
    obelisk.rotateY(Math.PI / 4);
    obelisk.position.set(2, 3.8, 25);
    this.scene.add(basePillar, obelisk);
    this.addBoxCollider(2, 25, 2.2, 2.2);

    // Park Benches around plaza
    [
      [2, 20, 0],
      [2, 30, Math.PI],
      [-3, 25, Math.PI / 2],
      [7, 25, -Math.PI / 2]
    ].forEach(p => {
      const bench = ModelBuilder.createParkBench();
      bench.position.set(p[0], 0, p[1]);
      bench.rotation.y = p[2];
      this.scene.add(bench);
    });
  }

  // 5. VEHICLES & TERMINALS
  createVehicles() {
    // Parked Red Philippine Jeepney at Jeepney Terminal
    const jeepney = ModelBuilder.createJeepney(0xdc2626, 'CALAMBA - LOS BAÑOS');
    jeepney.position.set(-6, 0, 1.8);
    jeepney.rotation.y = Math.PI / 2;
    this.scene.add(jeepney);
    this.addBoxCollider(-6, 1.8, 6.0, 2.4);

    this.interactiveZones.push({
      id: 'jeepney_stop',
      name: 'Jeepney Terminal',
      type: 'transport',
      x: -6,
      z: 4.5,
      radius: 3.5,
      prompt: 'Sumakay sa Jeep (Fare: ₱13)',
      action: 'ride_jeepney'
    });

    // Tricycle Terminal with Mang Berting's Blue Tricycle
    const tricycle = ModelBuilder.createTricycle(0x2563eb);
    tricycle.position.set(24, 0, 7.5);
    tricycle.rotation.y = -Math.PI / 3;
    this.scene.add(tricycle);
    this.addBoxCollider(24, 7.5, 2.5, 2.5);

    this.interactiveZones.push({
      id: 'tricycle_terminal',
      name: 'Tricycle Terminal',
      type: 'transport',
      x: 24,
      z: 7.5,
      radius: 3.5,
      prompt: 'Magpa-Special kay Mang Berting (Fare: ₱15)',
      action: 'talk_mang_berting'
    });
  }

  // 6. TROPICAL VEGETATION
  createVegetation() {
    // Coconut Trees along the outskirts and roadside
    const cocoCoords = [
      [-65, 35], [-50, 42], [-40, 30], [-60, 10], [-45, 5],
      [-35, 2], [-20, 26], [32, 28], [58, 12], [55, 38],
      [32, 60], [-5, 65], [-35, -24], [-22, -22], [4, -22],
      [22, -22], [45, -22], [65, -8], [65, 8]
    ];
    cocoCoords.forEach((coord, idx) => {
      const tree = ModelBuilder.createCoconutTree(6.0 + (idx % 3) * 0.8);
      tree.position.set(coord[0], 0, coord[1]);
      tree.rotation.y = (idx * 0.7);
      this.scene.add(tree);
      this.addBoxCollider(coord[0], coord[1], 0.8, 0.8);
    });

    // Banana plants around Bahay Kubo and residential gardens
    [
      [-22, 12], [-28, 12], [-22, 20], [-35, -7], [28, -7]
    ].forEach(c => {
      const banana = ModelBuilder.createBananaTree();
      banana.position.set(c[0], 0, c[1]);
      this.scene.add(banana);
    });

    // Bougainvillea flowering bushes (Magenta)
    [
      [15, -6], [5, -6], [15, 6], [5, 6], [-2, 22], [6, 22], [-2, 28], [6, 28]
    ].forEach(c => {
      const bush = ModelBuilder.createBougainvillea(1.2);
      bush.position.set(c[0], 0, c[1]);
      this.scene.add(bush);
    });
  }

  // 7. STREET FURNITURE & UTILITY POLES
  createStreetFurniture() {
    // Utility Poles along Rizal Avenue
    [-45, -20, 5, 30, 55].forEach(x => {
      const pole = ModelBuilder.createUtilityPole();
      pole.position.set(x, 0, -5.2);
      this.scene.add(pole);
      this.addBoxCollider(x, -5.2, 0.6, 0.6);
      this.streetLights.push(pole);
    });

    // Street Name Signpost
    const signPost = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.8, 8), ModelBuilder.materials.chrome);
    signPost.position.set(16, 1.4, -5.2);
    const signBoard = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.35, 0.06), ModelBuilder.materials.tinRoofGreen);
    signBoard.position.set(16, 2.7, -5.2);
    this.scene.add(signPost, signBoard);
  }

  // AABB Collision Helper
  addBoxCollider(centerX, centerZ, widthX, widthZ) {
    const halfX = widthX / 2;
    const halfZ = widthZ / 2;
    this.colliders.push({
      minX: centerX - halfX,
      maxX: centerX + halfX,
      minZ: centerZ - halfZ,
      maxZ: centerZ + halfZ
    });
  }

  // Check collision for player bounding circle (radius ~0.4)
  checkCollision(newX, newZ, radius = 0.45) {
    for (let i = 0; i < this.colliders.length; i++) {
      const b = this.colliders[i];
      // Clamped nearest point on box
      const nearestX = Math.max(b.minX, Math.min(newX, b.maxX));
      const nearestZ = Math.max(b.minZ, Math.min(newZ, b.maxZ));
      const distX = newX - nearestX;
      const distZ = newZ - nearestZ;
      if ((distX * distX + distZ * distZ) < (radius * radius)) {
        return true; // Collision!
      }
    }
    // World boundary limits (-80 to 80)
    if (newX < -78 || newX > 78 || newZ < -78 || newZ > 78) {
      return true;
    }
    return false;
  }

  // Find nearest interactive zone
  getNearestZone(x, z) {
    let nearest = null;
    let minDist = Infinity;
    for (let i = 0; i < this.interactiveZones.length; i++) {
      const zone = this.interactiveZones[i];
      const dx = x - zone.x;
      const dz = z - zone.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist <= zone.radius && dist < minDist) {
        minDist = dist;
        nearest = zone;
      }
    }
    return nearest;
  }
}

window.LagunaWorld = LagunaWorld;
