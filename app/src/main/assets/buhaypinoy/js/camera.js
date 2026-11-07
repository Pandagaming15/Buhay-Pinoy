// BUHAY PINOY - Third-Person Follow Camera Controller
class CameraController {
  constructor(camera, target) {
    this.camera = camera;
    this.target = target; // Reference to PlayerCharacter

    // Camera spherical coordinates
    this.distance = 6.0;
    this.minDistance = 3.2;
    this.maxDistance = 10.0;

    this.yaw = 0; // Horizontal orbit angle (radians)
    this.pitch = 0.35; // Vertical orbit angle (~20 degrees elevation)
    this.minPitch = -0.05;
    this.maxPitch = 1.25; // ~72 degrees

    // Camera height target offset
    this.targetOffset = new THREE.Vector3(0, 1.4, 0);

    // Damping current position
    this.currentPosition = new THREE.Vector3();
    this.currentLookAt = new THREE.Vector3();
    this.sensitivity = 0.0035;

    this.setupListeners();
  }

  setupListeners() {
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    // Desktop Mouse Drag Look
    window.addEventListener('mousedown', (e) => {
      // Only drag if not clicking on HUD buttons/modals
      if (e.target.tagName !== 'BUTTON' && !e.target.closest('.modal-backdrop') && !e.target.closest('#mobile-controls')) {
        isDragging = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      this.yaw -= dx * this.sensitivity;
      this.pitch += dy * this.sensitivity;
      this.pitch = Math.max(this.minPitch, Math.min(this.maxPitch, this.pitch));
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    // Mouse Wheel Zoom
    window.addEventListener('wheel', (e) => {
      this.distance += e.deltaY * 0.005;
      this.distance = Math.max(this.minDistance, Math.min(this.maxDistance, this.distance));
    }, { passive: true });

    // Touch Drag on right half of screen for Mobile Camera Look
    let touchId = null;
    let prevTouchX = 0;
    let prevTouchY = 0;

    window.addEventListener('touchstart', (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        // Right half of screen and not over buttons
        if (touch.clientX > window.innerWidth * 0.4 && !e.target.closest('.action-cluster') && !e.target.closest('.modal-backdrop')) {
          touchId = touch.identifier;
          prevTouchX = touch.clientX;
          prevTouchY = touch.clientY;
          break;
        }
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (touchId === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === touchId) {
          const dx = touch.clientX - prevTouchX;
          const dy = touch.clientY - prevTouchY;
          prevTouchX = touch.clientX;
          prevTouchY = touch.clientY;

          this.yaw -= dx * this.sensitivity * 1.5;
          this.pitch += dy * this.sensitivity * 1.5;
          this.pitch = Math.max(this.minPitch, Math.min(this.maxPitch, this.pitch));
          break;
        }
      }
    }, { passive: true });

    const endTouch = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchId) {
          touchId = null;
          break;
        }
      }
    };
    window.addEventListener('touchend', endTouch);
    window.addEventListener('touchcancel', endTouch);
  }

  update(delta) {
    if (!this.target) return;

    // Target point to look at (player center of chest / head)
    const targetPos = this.target.position.clone().add(this.targetOffset);

    // Calculate desired camera position using spherical coordinates
    const horizontalDist = this.distance * Math.cos(this.pitch);
    const verticalDist = this.distance * Math.sin(this.pitch);

    const desiredX = targetPos.x - Math.sin(this.yaw) * horizontalDist;
    const desiredY = Math.max(0.6, targetPos.y + verticalDist); // Never dip below ground
    const desiredZ = targetPos.z - Math.cos(this.yaw) * horizontalDist;

    const desiredPos = new THREE.Vector3(desiredX, desiredY, desiredZ);

    // Smooth lerp damping
    const lerpSpeed = Math.min(1.0, delta * 12.0);
    this.currentPosition.lerp(desiredPos, lerpSpeed);
    this.currentLookAt.lerp(targetPos, lerpSpeed);

    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentLookAt);
  }
}

window.CameraController = CameraController;
