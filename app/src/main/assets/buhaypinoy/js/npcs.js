// BUHAY PINOY - Filipino NPCs System
class NPCManager {
  constructor(scene, world) {
    this.scene = scene;
    this.world = world;
    this.npcs = [];
    this.initNPCs();
  }

  initNPCs() {
    // 1. Aling Nena - Sari-Sari Store Owner
    this.addNPC({
      id: 'aling_nena',
      name: 'Aling Nena',
      role: 'Tindera ng Sari-Sari Store',
      bio: 'Kilalang tsismosa ngunit mabait na may-ari ng pinakasikat na tindahan sa Brgy. Real.',
      x: 10,
      z: -7.0,
      heading: 0,
      shirtColor: 0xec4899, // Pink duster
      pantsColor: 0x475569,
      hasApron: true,
      hasBimpo: false,
      hasCap: false,
      greeting: 'O iho, pabili ka ba ng pandesal o softdrinks? May mainit pa tayong kape at taho!',
      avatarEmoji: '👵'
    });

    // 2. Mang Berting - Tricycle Driver
    this.addNPC({
      id: 'mang_berting',
      name: 'Mang Berting',
      role: 'Toda Tricycle Driver',
      bio: 'Beteranong drayber na alam ang bawat pasikot-sikot sa buong Calamba.',
      x: 23,
      z: 6.0,
      heading: -Math.PI / 4,
      shirtColor: 0x2563eb, // Blue polo
      pantsColor: 0x334155,
      hasApron: false,
      hasBimpo: true, // White bimpo towel on neck!
      hasCap: true, // Tricycle cap
      greeting: 'Boss, saan tayo? Crossing o Los Baños? ₱15 lang special trip!',
      avatarEmoji: '🛵'
    });

    // 3. Kuya Jun - Basketball Player / Tambay
    this.addNPC({
      id: 'kuya_jun',
      name: 'Kuya Jun',
      role: 'Brgy. Basketball MVP',
      bio: 'Araw-araw nasa covered court. Mahilig mag-hamon ng pustahan sa 3-point shootout.',
      x: 39,
      z: 24,
      heading: -Math.PI / 2,
      shirtColor: 0xdc2626, // Red Jersey #23
      pantsColor: 0x18181b, // Black basketball shorts
      hasApron: false,
      hasBimpo: false,
      hasCap: false,
      greeting: 'Pare! Tara mag-shoot! Pag naka-3 shoots ka, may ₱100 ka sa akin. Laban?',
      avatarEmoji: '🏀'
    });

    // 4. Nanay Rosa - Carinderia Chef
    this.addNPC({
      id: 'nanay_rosa',
      name: 'Nanay Rosa',
      role: 'Kusinera sa Carinderia',
      bio: 'Nagluluto ng pinakamasarap na tapsilog, adobo, at sinigang sa buong Laguna.',
      x: 10,
      z: 9.0,
      heading: Math.PI,
      shirtColor: 0xf59e0b, // Warm yellow
      pantsColor: 0x334155,
      hasApron: true,
      hasBimpo: false,
      hasCap: false,
      greeting: 'Kain ka muna anak! Mainit pa ang Tapsilog at Sinigang. Sagot ko na ang sabaw!',
      avatarEmoji: '🍲'
    });

    // 5. Mang Kanor - Talipapa Market Kargador & Merchant
    this.addNPC({
      id: 'mang_kanor',
      name: 'Mang Kanor',
      role: 'Talipapa Kargador & Tindero',
      bio: 'Masipag na magsasaka at kargador mula sa palayan.',
      x: -16,
      z: -8.5,
      heading: 0,
      shirtColor: 0xf8fafc, // White sando
      pantsColor: 0x15803d, // Green work pants
      hasApron: false,
      hasBimpo: true,
      hasCap: false,
      greeting: 'Sariwang mangga at saging mula sa bukid! Naghahanap din ako ng magbubuhat ng kahon, ₱150 bayad!',
      avatarEmoji: '🍌'
    });

    // 6. Kapitan Roger - Barangay Captain
    this.addNPC({
      id: 'kapitan_roger',
      name: 'Kapitan Roger',
      role: 'Punong Barangay',
      bio: 'Tapat na pinuno ng Brgy. Real na laging nagmamalasakit sa mamamayan.',
      x: 20,
      z: 55,
      heading: Math.PI,
      shirtColor: 0xfef08a, // Barong Tagalog
      pantsColor: 0x0f172a, // Black slacks
      hasApron: false,
      hasBimpo: false,
      hasCap: false,
      greeting: 'Magandang araw sa ating barangay! Panatilihing malinis at mapayapa ang ating komunidad.',
      avatarEmoji: '🏛️'
    });
  }

  addNPC(data) {
    const group = new THREE.Group();
    const skinMat = new THREE.MeshLambertMaterial({ color: 0xbf824c });
    const hairMat = new THREE.MeshLambertMaterial({ color: 0x18181b });
    const shirtMat = new THREE.MeshLambertMaterial({ color: data.shirtColor });
    const pantsMat = new THREE.MeshLambertMaterial({ color: data.pantsColor });

    // Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.68, 0.3), shirtMat);
    torso.position.y = 1.04;
    torso.castShadow = true;
    group.add(torso);

    // Apron (if applicable)
    if (data.hasApron) {
      const apron = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.55, 0.05), new THREE.MeshLambertMaterial({ color: 0xffffff }));
      apron.position.set(0, 0.95, 0.16);
      group.add(apron);
    }

    // Bimpo Towel on shoulder / neck
    if (data.hasBimpo) {
      const bimpo = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.35, 0.34), new THREE.MeshLambertMaterial({ color: 0xf8fafc }));
      bimpo.position.set(-0.24, 1.25, 0);
      group.add(bimpo);
    }

    // Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.38, 0.36), skinMat);
    head.position.y = 1.58;
    head.castShadow = true;
    group.add(head);

    // Hair or Cap
    if (data.hasCap) {
      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.15, 0.44), new THREE.MeshLambertMaterial({ color: 0xd97706 }));
      cap.position.y = 0.22;
      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.04, 0.22), new THREE.MeshLambertMaterial({ color: 0xd97706 }));
      visor.position.set(0, 0.16, 0.26);
      head.add(cap, visor);
    } else {
      const hair = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.15, 0.4), hairMat);
      hair.position.y = 0.2;
      head.add(hair);
    }

    // Arms
    const armGeo = new THREE.BoxGeometry(0.16, 0.55, 0.16);
    const armL = new THREE.Mesh(armGeo, skinMat);
    armL.position.set(-0.35, 1.0, 0);
    const armR = new THREE.Mesh(armGeo, skinMat);
    armR.position.set(0.35, 1.0, 0);
    group.add(armL, armR);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.18, 0.68, 0.18);
    const legL = new THREE.Mesh(legGeo, pantsMat);
    legL.position.set(-0.14, 0.34, 0);
    const legR = new THREE.Mesh(legGeo, pantsMat);
    legR.position.set(0.14, 0.34, 0);
    group.add(legL, legR);

    // Floating Interaction Badge / Nameplate overhead
    const badgeGeo = new THREE.BoxGeometry(0.9, 0.22, 0.05);
    const badgeMat = new THREE.MeshBasicMaterial({ color: 0xffb800 });
    const badge = new THREE.Mesh(badgeGeo, badgeMat);
    badge.position.y = 2.15;
    group.add(badge);

    group.position.set(data.x, 0, data.z);
    group.rotation.y = data.heading;
    this.scene.add(group);

    // Add collision box for NPC
    this.world.addBoxCollider(data.x, data.z, 0.9, 0.9);

    this.npcs.push({
      ...data,
      group,
      torso,
      head,
      armL,
      armR,
      badge,
      initialX: data.x,
      initialZ: data.z,
      animTime: Math.random() * 10
    });
  }

  update(delta, playerPos) {
    this.npcs.forEach(npc => {
      npc.animTime += delta * 2;
      // Gentle idle breathing
      npc.torso.position.y = 1.04 + Math.sin(npc.animTime) * 0.02;
      npc.head.position.y = 1.58 + Math.sin(npc.animTime) * 0.02;
      // Bob overhead badge
      npc.badge.position.y = 2.15 + Math.sin(npc.animTime * 3) * 0.04;

      // When player is close, turn NPC head slightly towards player
      const dx = playerPos.x - npc.group.position.x;
      const dz = playerPos.z - npc.group.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < 5.0) {
        const lookAngle = Math.atan2(dx, dz) - npc.group.rotation.y;
        npc.head.rotation.y = THREE.MathUtils.clamp(lookAngle, -0.6, 0.6);
      } else {
        npc.head.rotation.y = 0;
      }
    });
  }

  getNearestNPC(x, z, maxDist = 3.2) {
    let nearest = null;
    let minDist = Infinity;
    this.npcs.forEach(npc => {
      const dx = x - npc.group.position.x;
      const dz = z - npc.group.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist <= maxDist && dist < minDist) {
        minDist = dist;
        nearest = npc;
      }
    });
    return nearest;
  }
}

window.NPCManager = NPCManager;
