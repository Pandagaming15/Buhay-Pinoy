// BUHAY PINOY - Main 3D Game Engine & Loop
class BuhayPinoyGame {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.clock = new THREE.Clock();

    // In-game time system (24h clock, starts at 8:00 AM)
    this.gameHour = 8.0;
    this.timeScale = 0.05; // ~1 real second = 3 game minutes
    this.isPaused = false;

    // Input state
    this.inputDir = new THREE.Vector3();
    this.keys = {};

    this.initThree();
    this.initSystems();
    this.initUI();
    this.initInputs();

    // Hide loading screen after everything is initialized
    setTimeout(() => {
      const loading = document.getElementById('game-loading');
      if (loading) loading.classList.add('hidden');
    }, 600);

    this.animate();
  }

  initThree() {
    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x38bdf8); // Sky blue
    this.scene.fog = new THREE.FogExp2(0x38bdf8, 0.012);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      250
    );

    // 3. Renderer with hardware acceleration
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.container.appendChild(this.renderer.domElement);

    // 4. Tropical Sunlight & Ambient Hemisphere Light
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.7);
    this.hemiLight.position.set(0, 50, 0);
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(0xfffbeb, 1.2);
    this.sunLight.position.set(45, 60, 35);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 160;
    const d = 50;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.scene.add(this.sunLight);

    // Resize handler
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  initSystems() {
    // World builder
    this.world = new LagunaWorld(this.scene);
    this.world.buildWorld();

    // Player character
    this.player = new PlayerCharacter(this.scene, this.world);

    // Follow camera
    this.cameraController = new CameraController(this.camera, this.player);

    // NPCs
    this.npcManager = new NPCManager(this.scene, this.world);

    // Economy & Inventory
    this.economy = new EconomySystem(this.player);

    // Dialogues
    this.dialogueSystem = new DialogueSystem(this.economy, this.player);

    // Basketball shootout
    this.basketballGame = new BasketballGame(this.scene, this.player, this.economy);
    window.basketballGame = this.basketballGame;
  }

  initUI() {
    window.gameUI = {
      showToast: (msg) => {
        const toast = document.getElementById('notification-toast');
        if (toast) {
          toast.textContent = msg;
          toast.classList.add('show');
          clearTimeout(this.toastTimeout);
          this.toastTimeout = setTimeout(() => toast.classList.remove('show'), 2800);
        }
      },
      openInventoryModal: () => {
        this.renderInventory();
        document.getElementById('inventory-modal').classList.add('open');
      },
      closeInventoryModal: () => {
        document.getElementById('inventory-modal').classList.remove('open');
      },
      openStoreModal: (npcId = 'aling_nena') => {
        this.renderStore(npcId);
        document.getElementById('store-modal').classList.add('open');
      },
      closeStoreModal: () => {
        document.getElementById('store-modal').classList.remove('open');
      },
      openJobsModal: () => {
        document.getElementById('jobs-modal').classList.add('open');
      },
      closeJobsModal: () => {
        document.getElementById('jobs-modal').classList.remove('open');
      },
      openMapModal: () => {
        this.renderMap();
        document.getElementById('map-modal').classList.add('open');
      },
      closeMapModal: () => {
        document.getElementById('map-modal').classList.remove('open');
      },
      openSettingsModal: () => {
        document.getElementById('settings-modal').classList.add('open');
      },
      closeSettingsModal: () => {
        document.getElementById('settings-modal').classList.remove('open');
      },
      openPauseModal: () => {
        this.isPaused = true;
        document.getElementById('pause-modal').classList.add('open');
      },
      closePauseModal: () => {
        this.isPaused = false;
        document.getElementById('pause-modal').classList.remove('open');
      }
    };

    this.economy.updateHUD();
  }

  renderInventory() {
    const grid = document.getElementById('inventory-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (this.economy.inventory.length === 0) {
      grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #94a3b8; padding: 20px;">Walang laman ang bag mo. Bumili ng pagkain sa sari-sari store!</p>';
      return;
    }

    this.economy.inventory.forEach(itemEntry => {
      const item = this.economy.catalog[itemEntry.id];
      if (!item) return;

      const card = document.createElement('div');
      card.className = 'item-card';
      card.innerHTML = `
        <div class="item-icon">${item.icon}</div>
        <div class="item-name">${item.name} (x${itemEntry.count})</div>
        <div class="item-desc">${item.desc}</div>
        <button class="use-btn">Gamitin / Kainin</button>
      `;
      card.querySelector('.use-btn').onclick = () => {
        this.economy.useItem(item.id);
        this.renderInventory();
      };
      grid.appendChild(card);
    });
  }

  renderStore(npcId) {
    const grid = document.getElementById('store-grid');
    const storeTitle = document.getElementById('store-title');
    if (!grid) return;
    grid.innerHTML = '';

    if (npcId === 'nanay_rosa') {
      if (storeTitle) storeTitle.textContent = "Nanay Rosa's Carinderia Menu";
    } else if (npcId === 'mang_kanor') {
      if (storeTitle) storeTitle.textContent = "Talipapa Fresh Goods";
    } else {
      if (storeTitle) storeTitle.textContent = "Aling Nena's Sari-Sari Store";
    }

    Object.values(this.economy.catalog).forEach(item => {
      const card = document.createElement('div');
      card.className = 'item-card';
      card.innerHTML = `
        <div class="item-icon">${item.icon}</div>
        <div class="item-name">${item.name}</div>
        <div class="item-desc">${item.desc}</div>
        <div class="item-price">₱${item.price}</div>
        <button class="buy-btn">Bumili</button>
      `;
      card.querySelector('.buy-btn').onclick = () => {
        this.economy.buyItem(item.id);
      };
      grid.appendChild(card);
    });
  }

  renderMap() {
    const canvas = document.getElementById('map-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.clientWidth;
    const h = canvas.height = canvas.clientHeight;

    // Background grass
    ctx.fillStyle = '#1e3a24';
    ctx.fillRect(0, 0, w, h);

    // Rice fields on left
    ctx.fillStyle = '#15803d';
    ctx.fillRect(10, 80, 80, 120);

    // Main Road (horizontal)
    ctx.fillStyle = '#3f3f46';
    ctx.fillRect(0, h * 0.5 - 12, w, 24);

    // Yellow double line
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(0, h * 0.5);
    ctx.lineTo(w, h * 0.5);
    ctx.stroke();
    ctx.setLineDash([]);

    // Side Road (vertical)
    ctx.fillStyle = '#3f3f46';
    ctx.fillRect(w * 0.6 - 10, h * 0.5, 20, h * 0.5);

    // Landmarks markers
    const drawMarker = (x, z, label, color) => {
      // Map world coords (-80 to 80) to canvas (0 to w, 0 to h)
      const px = ((x + 80) / 160) * w;
      const py = ((z + 80) / 160) * h;

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.font = '10px sans-serif';
      ctx.fillText(label, px + 8, py + 3);
    };

    drawMarker(10, -9, "Aling Nena's Store", '#f59e0b');
    drawMarker(10, 11, "Nanay Rosa's Carinderia", '#3b82f6');
    drawMarker(-16, -10, "Talipapa Market", '#10b981');
    drawMarker(20, 60, "Brgy. Real Hall", '#eab308');
    drawMarker(45, 24, "Basketball Court", '#ea580c');
    drawMarker(-6, 2, "Jeepney Stop", '#ef4444');
    drawMarker(24, 7.5, "Tricycle TODA", '#06b6d4');

    // Player location dot (blinking red/white)
    const pX = ((this.player.position.x + 80) / 160) * w;
    const pZ = ((this.player.position.z + 80) / 160) * h;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(pX, pZ, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText("📍 Ikaw (You)", pX - 25, pZ - 12);
  }

  initInputs() {
    // Keyboard inputs
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;

      // Quick hotkeys
      if (e.code === 'KeyE') this.handleInteraction();
      if (e.code === 'Space') {
        if (this.basketballGame.isActive) {
          this.basketballGame.shoot();
        } else {
          this.player.jump();
        }
      }
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        this.player.isSprinting = true;
      }
      if (e.code === 'KeyI') window.gameUI.openInventoryModal();
      if (e.code === 'KeyM') window.gameUI.openMapModal();
      if (e.code === 'Escape') {
        if (this.isPaused) window.gameUI.closePauseModal();
        else window.gameUI.openPauseModal();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        this.player.isSprinting = false;
      }
    });

    // Mobile Virtual Joystick
    const base = document.getElementById('joystick-base');
    const thumb = document.getElementById('joystick-thumb');
    let touchId = null;
    let baseRect = null;
    const maxRadius = 45;

    if (base && thumb) {
      base.addEventListener('touchstart', (e) => {
        const touch = e.changedTouches[0];
        touchId = touch.identifier;
        baseRect = base.getBoundingClientRect();
        this.updateJoystick(touch.clientX, touch.clientY, baseRect, thumb, maxRadius);
      }, { passive: true });

      base.addEventListener('touchmove', (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
          const touch = e.changedTouches[i];
          if (touch.identifier === touchId) {
            this.updateJoystick(touch.clientX, touch.clientY, baseRect, thumb, maxRadius);
            break;
          }
        }
      }, { passive: true });

      const resetJoy = (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === touchId) {
            touchId = null;
            thumb.style.transform = 'translate(0px, 0px)';
            this.inputDir.set(0, 0, 0);
            break;
          }
        }
      };
      base.addEventListener('touchend', resetJoy);
      base.addEventListener('touchcancel', resetJoy);
    }

    // Mobile Action buttons
    const jumpBtn = document.getElementById('btn-jump');
    if (jumpBtn) {
      jumpBtn.addEventListener('click', () => {
        if (this.basketballGame.isActive) {
          this.basketballGame.shoot();
        } else {
          this.player.jump();
        }
      });
    }

    const sprintBtn = document.getElementById('btn-sprint');
    if (sprintBtn) {
      sprintBtn.addEventListener('click', () => {
        this.player.isSprinting = !this.player.isSprinting;
        sprintBtn.classList.toggle('active', this.player.isSprinting);
      });
    }

    const interactBtn = document.getElementById('btn-interact');
    if (interactBtn) {
      interactBtn.addEventListener('click', () => this.handleInteraction());
    }

    // Prompt bar click
    const promptBanner = document.getElementById('interaction-prompt');
    if (promptBanner) {
      promptBanner.addEventListener('click', () => this.handleInteraction());
    }
  }

  updateJoystick(clientX, clientY, baseRect, thumb, maxRadius) {
    const centerX = baseRect.left + baseRect.width / 2;
    const centerY = baseRect.top + baseRect.height / 2;
    let dx = clientX - centerX;
    let dy = clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > maxRadius) {
      dx = (dx / dist) * maxRadius;
      dy = (dy / dist) * maxRadius;
    }

    thumb.style.transform = `translate(${dx}px, ${dy}px)`;

    // Map to normalized input vector (dx = right/left, dy = forward/back)
    this.inputDir.x = dx / maxRadius;
    this.inputDir.z = -dy / maxRadius; // Screen Y up is negative Z (forward)
  }

  handleInteraction() {
    if (this.currentActiveZone) {
      const zone = this.currentActiveZone;
      if (zone.action === 'talk_aling_nena') {
        const npc = this.npcManager.npcs.find(n => n.id === 'aling_nena');
        if (npc) this.dialogueSystem.openDialogue(npc);
      } else if (zone.action === 'talk_nanay_rosa') {
        const npc = this.npcManager.npcs.find(n => n.id === 'nanay_rosa');
        if (npc) this.dialogueSystem.openDialogue(npc);
      } else if (zone.action === 'talk_mang_kanor') {
        const npc = this.npcManager.npcs.find(n => n.id === 'mang_kanor');
        if (npc) this.dialogueSystem.openDialogue(npc);
      } else if (zone.action === 'talk_kapitan') {
        const npc = this.npcManager.npcs.find(n => n.id === 'kapitan_roger');
        if (npc) this.dialogueSystem.openDialogue(npc);
      } else if (zone.action === 'talk_mang_berting') {
        const npc = this.npcManager.npcs.find(n => n.id === 'mang_berting');
        if (npc) this.dialogueSystem.openDialogue(npc);
      } else if (zone.action === 'play_basketball') {
        this.basketballGame.startShootout();
      } else if (zone.action === 'ride_jeepney') {
        if (this.economy.spendMoney(13, 'pamasahe sa Jeep papuntang Crossing')) {
          if (window.soundSystem) window.soundSystem.playJeepHorn();
          window.gameUI.showToast('🚐 Sumakay sa Jeepney! Relaxing trip around Calamba...');
          this.player.boostStamina(40);
        }
      } else if (zone.action === 'rest_kubo') {
        window.gameUI.showToast('🌿 Nagpahinga sa duyan ng Bahay Kubo. Refreshing!');
        this.player.heal(30);
        this.player.boostStamina(50);
        if (window.soundSystem) window.soundSystem.playInteract();
      }
      return;
    }

    // If near any NPC
    const nearNPC = this.npcManager.getNearestNPC(this.player.position.x, this.player.position.z, 3.2);
    if (nearNPC) {
      this.dialogueSystem.openDialogue(nearNPC);
    }
  }

  // Day & Night Cycle update
  updateDayNight(delta) {
    this.gameHour += delta * this.timeScale;
    if (this.gameHour >= 24) this.gameHour = 0;

    // Sun angle calculation (0 to Math.PI * 2)
    const sunAngle = ((this.gameHour - 6) / 24) * Math.PI * 2;
    const sunDist = 80;
    this.sunLight.position.set(
      Math.cos(sunAngle) * sunDist,
      Math.sin(sunAngle) * sunDist,
      35
    );

    // Sky colors transition
    let skyColor, sunIntensity, hemiIntensity;

    if (this.gameHour >= 6 && this.gameHour < 17) {
      // Daytime (Bright tropical skies)
      skyColor = 0x38bdf8;
      sunIntensity = 1.2;
      hemiIntensity = 0.7;
      this.sunLight.color.setHex(0xfffbeb);
    } else if (this.gameHour >= 17 && this.gameHour < 19) {
      // Golden Hour & Sunset
      skyColor = 0xf97316; // Orange glow
      sunIntensity = 0.8;
      hemiIntensity = 0.5;
      this.sunLight.color.setHex(0xfb923c);
    } else {
      // Nighttime (Midnight blue with stars and lit street lamps)
      skyColor = 0x0f172a;
      sunIntensity = 0.15;
      hemiIntensity = 0.25;
      this.sunLight.color.setHex(0x93c5fd);
    }

    this.scene.background.setHex(skyColor);
    this.scene.fog.color.setHex(skyColor);
    this.sunLight.intensity = sunIntensity;
    this.hemiLight.intensity = hemiIntensity;

    // Update Time Badge in HUD
    const timeEl = document.getElementById('game-time-text');
    if (timeEl) {
      const h = Math.floor(this.gameHour);
      const m = Math.floor((this.gameHour - h) * 60);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const displayH = h % 12 === 0 ? 12 : h % 12;
      const displayM = m < 10 ? `0${m}` : m;
      const icon = (h >= 6 && h < 18) ? '☀️' : '🌙';
      timeEl.textContent = `${icon} ${displayH}:${displayM} ${ampm}`;
    }
  }

  // Update check for nearby interactive zones
  updateInteractions() {
    const pX = this.player.position.x;
    const pZ = this.player.position.z;

    const zone = this.world.getNearestZone(pX, pZ);
    const nearNPC = this.npcManager.getNearestNPC(pX, pZ, 3.2);

    const promptContainer = document.getElementById('interaction-prompt-container');
    const promptText = document.getElementById('prompt-text');

    if (zone) {
      this.currentActiveZone = zone;
      if (promptText) promptText.textContent = zone.prompt;
      if (promptContainer) promptContainer.classList.add('active');
    } else if (nearNPC) {
      this.currentActiveZone = null;
      if (promptText) promptText.textContent = `Talk to ${nearNPC.name} (${nearNPC.role})`;
      if (promptContainer) promptContainer.classList.add('active');
    } else {
      this.currentActiveZone = null;
      if (promptContainer) promptContainer.classList.remove('active');
    }
  }

  // Main Render Loop
  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = Math.min(this.clock.getDelta(), 0.1);

    if (!this.isPaused) {
      // 1. Process keyboard inputs if joystick is idle
      if (this.inputDir.lengthSq() < 0.01) {
        let kX = 0;
        let kZ = 0;
        if (this.keys['KeyW'] || this.keys['ArrowUp']) kZ += 1;
        if (this.keys['KeyS'] || this.keys['ArrowDown']) kZ -= 1;
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) kX -= 1;
        if (this.keys['KeyD'] || this.keys['ArrowRight']) kX += 1;

        const kVec = new THREE.Vector3(kX, 0, kZ);
        if (kVec.lengthSq() > 0) kVec.normalize();
        this.player.update(delta, kVec, this.cameraController.yaw);
      } else {
        // Use analog joystick input
        this.player.update(delta, this.inputDir, this.cameraController.yaw);
      }

      // 2. Follow Camera
      this.cameraController.update(delta);

      // 3. NPCs
      this.npcManager.update(delta, this.player.position);

      // 4. Basketball Mini-Game
      this.basketballGame.update(delta);

      // 5. Day & Night Cycle
      this.updateDayNight(delta);

      // 6. Proximity checks for interactions
      this.updateInteractions();

      // 7. Update Health & Stamina bars in HUD
      const hpFill = document.getElementById('health-fill');
      const stamFill = document.getElementById('stamina-fill');
      if (hpFill) hpFill.style.width = `${Math.round((this.player.health / this.player.maxHealth) * 100)}%`;
      if (stamFill) stamFill.style.width = `${Math.round((this.player.stamina / this.player.maxStamina) * 100)}%`;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Start game when page loads
window.addEventListener('DOMContentLoaded', () => {
  window.game = new BuhayPinoyGame();
});
