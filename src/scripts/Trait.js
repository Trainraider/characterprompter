class Trait {
  constructor(name, category) {
    this.name = name;
    this.category = category;
    this.value = Math.floor(Math.random() * 101);
    this.element = null;
    this.lock = new LockButton();
  }

  generateElement() {
    const div = document.createElement('div');
    div.className = 'trait';

    const lockButton = this.lock.createLockButton();

    div.innerHTML = `
            <div class="trait-top-row">
                <button class="delete-trait" onclick="traitContainer.deleteTrait('${this.name}')">\u274c</button>
                <span class="trait-label">${this.name}:</span>
                <input type="range" class="trait-slider" min="0" max="100" value="${this.value}">
            </div>
            <input type="text" class="trait-input" placeholder="${this.getStrengthModifier()}">
        `;

    const traitTopRow = div.querySelector('.trait-top-row');
    traitTopRow.insertBefore(lockButton, traitTopRow.firstChild);

    this.element = div;
    this.lock.setElement(div);

    const slider = div.querySelector('.trait-slider');
    const input = div.querySelector('.trait-input');

    slider.addEventListener('input', () => {
      this.updateValue(slider.value);
      input.placeholder = this.getStrengthModifier();
      if (!input.value) {
        input.value = '';
      }
    });

    return div;
  }

  reroll() {
    if (!this.lock.isLocked()) {
      let value = Math.floor(Math.random() * 101);
      this.updateValue(value);
    }
  }

  updateValue(newValue) {
    if (!this.lock.isLocked()) {
      this.value = newValue;
      if (this.element) {
        const slider = this.element.querySelector('.trait-slider');
        const input = this.element.querySelector('.trait-input');
        slider.value = newValue;
        input.placeholder = this.getStrengthModifier();
        if (!input.value) {
          input.value = '';
        }
      }
    }
  }

  generateText() {
    const textInput = this.element ? this.element.querySelector('.trait-input').value : '';
    if (textInput) {
      // Check if the input contains the trait name (case-insensitive)
      if (textInput.toLowerCase().includes(this.name.toLowerCase())) {
        return `${textInput}\n`;
      }
      return `${this.name}: ${textInput}\n`;
    } else {
      const strengthModifier = this.getStrengthModifier();
      return `${strengthModifier}\n`;
    }
  }

  getStrengthModifier() {
    const levels = [
      { threshold: 0, modifier: "no {{trait}} at all" },
      { threshold: 10, modifier: "practically nonexistent {{trait}}" },
      { threshold: 20, modifier: "almost no {{trait}}" },
      { threshold: 25, modifier: "very low {{trait}}" },
      { threshold: 35, modifier: "considerably below average {{trait}}" },
      { threshold: 40, modifier: "less than average {{trait}}" },
      { threshold: 45, modifier: "average {{trait}}" },
      { threshold: 50, modifier: "moderate {{trait}}" },
      { threshold: 60, modifier: "above average {{trait}}" },
      { threshold: 70, modifier: "substantial {{trait}}" },
      { threshold: 80, modifier: "remarkable {{trait}}" },
      { threshold: 87, modifier: "extraordinary {{trait}}" },
      { threshold: 94, modifier: "unparalleled {{trait}}" }
    ];

    for (let i = levels.length - 1; i >= 0; i--) {
      if (this.value >= levels[i].threshold) {
        return levels[i].modifier.replace("{{trait}}", this.name.toLowerCase());
      }
    }
    return "invalid {{trait}}".replace("{{trait}}", this.name.toLowerCase());
  }
}
