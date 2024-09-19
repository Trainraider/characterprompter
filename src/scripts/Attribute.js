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
        return this.value;
      }

      generateElement() {
        const div = document.createElement('div');
        div.className = 'attribute';

        const lockButton = this.lock.createLockButton();

        div.innerHTML = `
          <div class="attribute-content">
            <span class="attribute-name">${this.name}:</span>
            <input type="text" class="attribute-input" value="${this.value}">
          </div>
        `;
        
        const attributeContent = div.querySelector('.attribute-content');
        attributeContent.insertBefore(lockButton, attributeContent.firstChild);

        this.element = div;
        this.lock.setElement(div);

        const input = div.querySelector('.attribute-input');
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
            const input = this.element.querySelector('.attribute-input');
            input.value = newValue;
          }
        }
      }
    }