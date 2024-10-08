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
      this.value = this.options.sample();
      this.updateValue(this.value);
    }
    return this.value;
  }

  generateElement() {
    const div = document.createElement('div');
    div.className = 'attribute';

    const lockButton = this.lock.createLockButton();

    div.innerHTML = `
      <div class="attribute-top-row">
        <span class="attribute-name">${this.name}:</span>
        <input type="text" class="attribute-input" value="${this.value}">
      </div>
    `;
    
    const attributeTopRow = div.querySelector('.attribute-top-row');
    attributeTopRow.insertBefore(lockButton, attributeTopRow.firstChild);

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