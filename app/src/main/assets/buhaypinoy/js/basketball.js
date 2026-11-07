// BUHAY PINOY - Barangay Basketball Shootout Mini-Game
class BasketballGame {
  constructor(scene, player, economy) {
    this.scene = scene;
    this.player = player;
    this.economy = economy;

    this.isActive = false;
    this.score = 0;
    this.targetScore = 3;
    this.hoopPosition = new THREE.Vector3(45, 3.05, 12.5); // Center of the hoop rim

    this.ball = null;
    this.ballVelocity = new THREE.Vector3();
    this.ballInFlight = false;
    this.power = 0;
    this.powerDir = 1;

    this.createBall();
  }

  createBall() {
    const ballGeo = new THREE.SphereGeometry(0.24, 12, 12);
    const ballMat = new THREE.MeshLambertMaterial({ color: 0xea580c }); // Basketball orange
    this.ball = new THREE.Mesh(ballGeo, ballMat);
    this.ball.castShadow = true;
    this.ball.visible = false;
    this.scene.add(this.ball);
  }

  startShootout() {
    this.isActive = true;
    this.score = 0;
    this.ballInFlight = false;
    this.ball.visible = true;

    // Position player at the 3-point line
    this.player.position.set(45, 0, 20);
    this.player.heading = Math.PI; // Face north towards the hoop

    const hud = document.getElementById('bball-hud');
    if (hud) hud.classList.add('active');
    this.updateHUD();

    if (window.soundSystem) window.soundSystem.playInteract();
    window.gameUI.showToast('Shootout started! Press SHOOT when power is green!');
  }

  endShootout(won = false) {
    this.isActive = false;
    this.ball.visible = false;
    this.ballInFlight = false;

    const hud = document.getElementById('bball-hud');
    if (hud) hud.classList.remove('active');

    if (won) {
      if (window.soundSystem) window.soundSystem.playFanfare();
      this.economy.addMoney(100, 'Premyo sa Basketball Shootout!');
      window.gameUI.showToast('🏆 Panalo ka sa 3-Point Shootout! +₱100!');
    }
  }

  shoot() {
    if (!this.isActive || this.ballInFlight) return;

    this.ballInFlight = true;
    this.ball.position.copy(this.player.position).add(new THREE.Vector3(0, 1.6, 0.4));

    // Calculate arc trajectory towards hoop
    const toHoop = this.hoopPosition.clone().sub(this.ball.position);
    const dist = Math.sqrt(toHoop.x * toHoop.x + toHoop.z * toHoop.z);

    // Check power accuracy (sweet spot between 65% and 82%)
    const isAccurate = (this.power >= 0.65 && this.power <= 0.82);

    const timeToTarget = 0.95;
    this.ballVelocity.x = (toHoop.x / timeToTarget) + (isAccurate ? 0 : (Math.random() - 0.5) * 2.5);
    this.ballVelocity.z = (toHoop.z / timeToTarget) + (isAccurate ? 0 : (Math.random() - 0.5) * 2.5);
    this.ballVelocity.y = 8.5;

    this.isAccurateShot = isAccurate;

    if (window.soundSystem) window.soundSystem.playBounce();
  }

  update(delta) {
    if (!this.isActive) return;

    // Power oscillation
    if (!this.ballInFlight) {
      this.power += delta * 1.8 * this.powerDir;
      if (this.power >= 1) {
        this.power = 1;
        this.powerDir = -1;
      } else if (this.power <= 0) {
        this.power = 0;
        this.powerDir = 1;
      }
      this.updatePowerUI();

      // Keep ball in player's hands while aiming
      this.ball.position.copy(this.player.position).add(new THREE.Vector3(0, 1.4, 0.35));
    } else {
      // Physics for ball in flight
      this.ballVelocity.y -= 19.8 * delta; // Gravity
      this.ball.position.x += this.ballVelocity.x * delta;
      this.ball.position.y += this.ballVelocity.y * delta;
      this.ball.position.z += this.ballVelocity.z * delta;

      // Check hoop collision / basket
      const distToHoop = this.ball.position.distanceTo(this.hoopPosition);
      if (distToHoop < 0.6 && this.ballVelocity.y < 0 && this.isAccurateShot) {
        if (window.soundSystem) window.soundSystem.playSwish();
        this.score += 1;
        this.isAccurateShot = false; // Prevent double trigger
        this.updateHUD();

        if (this.score >= this.targetScore) {
          setTimeout(() => this.endShootout(true), 1000);
        }
      }

      // Ball hits floor
      if (this.ball.position.y <= 0.24) {
        this.ball.position.y = 0.24;
        this.ballVelocity.y = -this.ballVelocity.y * 0.45; // Bounce
        if (window.soundSystem) window.soundSystem.playBounce();

        // Reset shot after a short delay
        setTimeout(() => {
          if (this.isActive && this.score < this.targetScore) {
            this.ballInFlight = false;
          }
        }, 600);
      }
    }
  }

  updateHUD() {
    const scoreEl = document.getElementById('bball-score-val');
    if (scoreEl) scoreEl.textContent = `${this.score} / ${this.targetScore}`;
  }

  updatePowerUI() {
    const barEl = document.getElementById('bball-power-bar');
    if (barEl) {
      barEl.style.width = `${Math.round(this.power * 100)}%`;
      if (this.power >= 0.65 && this.power <= 0.82) {
        barEl.style.background = '#22c55e'; // Green sweet spot!
      } else {
        barEl.style.background = '#ea580c';
      }
    }
  }
}

window.BasketballGame = BasketballGame;
