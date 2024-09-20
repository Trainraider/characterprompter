class Trait {
  constructor(name, antonym, category) {
    this.name = name;
    this.antonym = antonym;
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
      if (textInput.toLowerCase().includes(this.name.toLowerCase()) || 
          textInput.toLowerCase().includes(this.antonym.toLowerCase())) {
        return `${textInput}\n`;
      }
      return `${this.name} - ${this.antonym}: ${textInput}\n`;
    } else {
      const strengthModifier = this.getStrengthModifier();
      return `${strengthModifier}\n`;
    }
  }

  isScenarioTrait() {
    return this.category === "Scenario Traits";
  }

  getStrengthModifier() { 
    const levels = [
      { threshold: 45, modifier: "no {{trait}} at all" },
      { threshold: 50, modifier: "practically nonexistent {{trait}}" },
      { threshold: 56, modifier: "almost no {{trait}}" },
      { threshold: 59, modifier: "very low {{trait}}" },
      { threshold: 64, modifier: "considerably below average {{trait}}" },
      { threshold: 67, modifier: "less than average {{trait}}" },
      { threshold: 70, modifier: "average {{trait}}" },
      { threshold: 73, modifier: "moderate {{trait}}" },
      { threshold: 78, modifier: "above average {{trait}}" },
      { threshold: 84, modifier: "substantial {{trait}}" },
      { threshold: 89, modifier: "remarkable {{trait}}" },
      { threshold: 93, modifier: "extraordinary {{trait}}" },
      { threshold: 97, modifier: "unparalleled {{trait}}" }
    ];

    let trait, modifier;

    if (this.value >= 45) {
      trait = this.name;
      for (let i = levels.length - 1; i >= 0; i--) {
        if (this.value >= levels[i].threshold) {
          modifier = levels[i].modifier;
          break;
        }
      }
    } else {
      trait = this.antonym;
      const invertedValue = 100 - this.value;
      for (let i = levels.length - 1; i >= 0; i--) {
        if (invertedValue >= levels[i].threshold) {
          modifier = levels[i].modifier;
          break;
        }
      }
    }

    return modifier.replace("{{trait}}", trait.toLowerCase());
  }
}
