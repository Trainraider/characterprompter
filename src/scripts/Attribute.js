
    class Attribute {
      constructor(name, options) {
        this.name = name;
        this.options = options;
        this.element = null;
        this.lock = new LockButton(name);
        this.value = this.reroll();
      }

      reroll() {
        if (!this.lock.isLocked()) {
          let value = null;
          if (Array.isArray(this.options)) {
            value = this.options[Math.floor(Math.random() * this.options.length)];
          } else {
            value = Math.floor(Math.random() * (this.options[1] - this.options[0] + 1)) + this.options[0];
          }
          this.updateValue(value);
        }
      }

      generateElement() {
        const div = document.createElement('div');
        div.className = 'attribute';

        const lockButton = this.lock.createLockButton();

        div.innerHTML = `
            ${this.name}: <br><br>
            <input type="text" value="${this.value}">
          `;
        div.insertBefore(lockButton, div.firstChild);

        this.element = div;
        this.lock.setElement(div);

        const input = div.querySelector('input');
        input.addEventListener('input', (e) => {
          if (!this.lock.isLocked()) {
            this.value = e.target.value;
          }
        });

        return div;
      }

      generateText() {
        return `${this.name}: ${this.value}`;
      }

      updateValue(newValue) {
        if (!this.lock.isLocked()) {
          this.value = newValue;
          if (this.element) {
            const input = this.element.querySelector('input');
            input.value = newValue;
          }
        }
      }
    }
