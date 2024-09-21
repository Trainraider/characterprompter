
    class LockButton {
      constructor(name) {
        this.name = name;
        this.locked = false;
        this.element = null;
      }

      createLockButton() {
        const lockButton = document.createElement('button');
        lockButton.className = 'lock';
        lockButton.textContent = this.locked ? '🔒' : '🔓';
        lockButton.onclick = () => this.toggleLock();
        return lockButton;
      }

      setElement(element) {
        this.element = element;
        this.updateElementState();
      }

      toggleLock() {
        this.locked = !this.locked;
        this.updateElementState();
        updateContainerLocks();
      }

      lock() {
        this.locked = true;
        this.updateElementState();
      }

      unlock() {
        this.locked = false;
        this.updateElementState();
      }

      updateElementState() {
        if (this.element) {
          const lockButton = this.element.querySelector('.lock');
          const inputs = this.element.querySelectorAll('input');

          lockButton.textContent = this.locked ? '🔒' : '🔓';
          lockButton.classList.toggle('locked', this.locked);
          inputs.forEach(input => {
            input.disabled = this.locked;
          });
        }
      }

      isLocked() {
        return this.locked;
      }
    }
