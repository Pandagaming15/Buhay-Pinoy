// BUHAY PINOY - 3D Third-Person Player System
class PlayerCharacter {
  constructor(scene, world) {
    this.scene = scene;
    this.world = world;

    // Player state
    this.name = 'Juan dela Cruz';
    this.health = 100;
    this.maxHealth = 100;
    this.stamina = 100;
    this.maxStamina = 100;
    this.isSprinting = false;
    this.isGrounded = true;

    // Movement physics
    this.position = new THREE.Vector3(0, 0, 5); // Start on sidewalk near intersection
    this.velocity = new THREE.Vector3();
    this.walkSpeed = 4.8;
    this.runSpeed = 8.5;
    this.jumpForce = 7.5;
    this.gravity = -20.0;
    this.heading = 0; // Rotation angle around Y

    // Animation variables
    this.animTime = 0;
    this.isMoving = false;
    this.footstepTimer = 0;

    this.createMesh();
  }

  createMesh() {
    this.group = new THREE.Group();

    // Palette
    const skinMat = new THREE.MeshLambertMaterial({ color: 0xbf824c }); // Filipino skin tone
    const hairMat = new THREE.MeshLambertMaterial({ color: 0x18181b }); // Black hair
    const shirtMat = new THREE.MeshLambertMaterial({ color: 0x0284c7 }); // Sky blue shirt
    const shortsMat = new THREE.MeshLambertMaterial({ color: 0x334155 }); // Denim shorts
    const shoesMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc }); // White sneakers

    // Torso
    const torsoGeo = new THREE.BoxGeometry(0.55, 0.7, 0.32);
    this.torso = new THREE.Mesh(torsoGeo, shirtMat);
    this.torso.position.y = 1.05;
    this.torso.castShadow = true;
    this.group.add(this.torso);

    // Head
    const headGeo = new THREE.BoxGeometry(0.38, 0.4, 0.38);
    this.head = new THREE.Mesh(headGeo, skinMat);
    this.head.position.y = 1.62;
    this.head.castShadow = true;
    this.group.add(this.head);

    // Hair
    const hairGeo = new THREE.BoxGeometry(0.42, 0.16, 0.42);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.y = 0.22;
    this.head.add(hair);

    // Left Arm (with pivot)
    this.leftArmPivot = new THREE.Group();
    this.leftArmPivot.position.set(-0.38, 1.35, 0);
    const armGeo = new THREE.BoxGeometry(0.18, 0.6, 0.18);
    const leftArm = new THREE.Mesh(armGeo, skinMat);
    leftArm.position.y = -0.3;
    leftArm.castShadow = true;
    this.leftArmPivot.add(leftArm);
    this.group.add(this.leftArmPivot);

    // Right Arm (with pivot)
    this.rightArmPivot = new THREE.Group();
    this.rightArmPivot.position.set(0.38, 1.35, 0);
    const rightArm = new THREE.Mesh(armGeo, skinMat);
    rightArm.position.y = -0.3;
    rightArm.castShadow = true;
    this.rightArmPivot.add(rightArm);
    this.group.add(this.rightArmPivot);

    // Left Leg (with pivot)
    this.leftLegPivot = new THREE.Group();
    this.leftLegPivot.position.set(-0.16, 0.7, 0);
    const legGeo = new THREE.BoxGeometry(0.2, 0.7, 0.2);
    const leftLeg = new THREE.Mesh(legGeo, shortsMat);
    leftLeg.position.y = -0.35;
    leftLeg.castShadow = true;
    // Sneaker
    const shoeGeo = new THREE.BoxGeometry(0.22, 0.15, 0.28);
    const leftShoe = new THREE.Mesh(shoeGeo, shoesMat);
    leftShoe.position.set(0, -0.65, 0.04);
    leftLeg.add(leftShoe);
    this.leftLegPivot.add(leftLeg);
    this.group.add(this.leftLegPivot);

    // Right Leg (with pivot)
    this.rightLegPivot = new THREE.Group();
    this.rightLegPivot.position.set(0.16, 0.7, 0);
    const rightLeg = new THREE.Mesh(legGeo, shortsMat);
    rightLeg.position.y = -0.35;
    rightLeg.castShadow = true;
    // Sneaker
    const rightShoe = new THREE.Mesh(shoeGeo, shoesMat);
    rightShoe.position.set(0, -0.65, 0.04);
    rightLeg.add(rightShoe);
    this.rightLegPivot.add(rightLeg);
    this.group.add(this.rightLegPivot);

    this.group.position.copy(this.position);
    this.scene.add(this.group);
  }

  // Update physics and animations each frame
  update(delta, inputDir, cameraAngleY) {
    // 1. Movement Direction relative to Camera View
    const moveVector = new THREE.Vector3();
    const isInputActive = (Math.abs(inputDir.x) > 0.05 || Math.abs(inputDir.z) > 0.05);

    if (isInputActive) {
      // Calculate angle in camera coordinate space
      const inputAngle = Math.atan2(inputDir.x, inputDir.z);
      const targetAngle = cameraAngleY + inputAngle;

      // Smooth heading rotation
      let diff = targetAngle - this.heading;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.heading += diff * Math.min(1.0, delta * 12.0);

      const speed = (this.isSprinting && this.stamina > 5) ? this.runSpeed : this.walkSpeed;
      moveVector.x = Math.sin(this.heading) * speed;
      moveVector.z = Math.cos(this.heading) * speed;
      this.isMoving = true;

      // Drain stamina when sprinting
      if (this.isSprinting && this.stamina > 0) {
        this.stamina = Math.max(0, this.stamina - delta * 18);
        if (this.stamina <= 0) this.isSprinting = false;
      }
    } else {
      this.isMoving = false;
      // Stamina regeneration
      if (this.stamina < this.maxStamina) {
        this.stamina = Math.min(this.maxStamina, this.stamina + delta * 12);
      }
    }

    // 2. Horizontal Collision & Sliding along X and Z
    const newX = this.position.x + moveVector.x * delta;
    const newZ = this.position.z + moveVector.z * delta;

    if (!this.world.checkCollision(newX, this.position.z, 0.4)) {
      this.position.x = newX;
    }
    if (!this.world.checkCollision(this.position.x, newZ, 0.4)) {
      this.position.z = newZ;
    }

    // 3. Vertical Physics (Gravity & Jumping)
    this.velocity.y += this.gravity * delta;
    this.position.y += this.velocity.y * delta;

    // Ground check (flat ground at y = 0)
    if (this.position.y <= 0) {
      this.position.y = 0;
      this.velocity.y = 0;
      this.isGrounded = true;
    } else {
      this.isGrounded = false;
    }

    // 4. Mesh Position & Rotation
    this.group.position.copy(this.position);
    this.group.rotation.y = this.heading;

    // 5. Procedural Animation & Footstep Audio
    this.animate(delta);
  }

  jump() {
    if (this.isGrounded && this.stamina >= 10) {
      this.velocity.y = this.jumpForce;
      this.isGrounded = false;
      this.stamina = Math.max(0, this.stamina - 10);
      if (window.soundSystem) window.soundSystem.playJump();
    }
  }

  animate(delta) {
    if (this.isGrounded) {
      if (this.isMoving) {
        const animSpeed = this.isSprinting ? 14 : 9;
        this.animTime += delta * animSpeed;

        const legSwing = Math.sin(this.animTime) * 0.7;
        const armSwing = Math.sin(this.animTime) * 0.6;

        this.leftLegPivot.rotation.x = legSwing;
        this.rightLegPivot.rotation.x = -legSwing;
        this.leftArmPivot.rotation.x = -armSwing;
        this.rightArmPivot.rotation.x = armSwing;

        // Torso slight bob
        this.torso.position.y = 1.05 + Math.abs(Math.sin(this.animTime * 2)) * 0.05;

        // Footstep audio trigger on ground contact
        this.footstepTimer += delta * animSpeed;
        if (this.footstepTimer > Math.PI) {
          this.footstepTimer = 0;
          if (window.soundSystem) window.soundSystem.playStep();
        }
      } else {
        // Idle breathing
        this.animTime += delta * 2;
        this.leftLegPivot.rotation.x = 0;
        this.rightLegPivot.rotation.x = 0;
        this.leftArmPivot.rotation.x = Math.sin(this.animTime) * 0.05;
        this.rightArmPivot.rotation.x = -Math.sin(this.animTime) * 0.05;
        this.torso.position.y = 1.05 + Math.sin(this.animTime) * 0.02;
        this.footstepTimer = 0;
      }
    } else {
      // Jumping pose
      this.leftLegPivot.rotation.x = 0.4;
      this.rightLegPivot.rotation.x = 0.2;
      this.leftArmPivot.rotation.x = -0.7;
      this.rightArmPivot.rotation.x = -0.7;
    }
  }

  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  boostStamina(amount) {
    this.stamina = Math.min(this.maxStamina, this.stamina + amount);
  }
}

window.PlayerCharacter = PlayerCharacter;
