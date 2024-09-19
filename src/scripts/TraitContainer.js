class TraitContainer {
  constructor() {
    this.traits = {};
    this.categories = {
      "Personality Traits": [],
      "Status Traits": []
    };
  }

  _forEach(callback) {
    Object.values(this.traits).forEach(callback);
  }

  addTrait(newTraitName, category) {
    if (newTraitName && !this.traits[newTraitName] && this.categories[category]) {
      this.traits[newTraitName] = new Trait(newTraitName, category);
      this.categories[category].push(this.traits[newTraitName]);
      this.updateDropdowns();
    }
  }

  updateDropdowns() {
    const traitsElement = document.getElementById('traits');
    traitsElement.innerHTML = '';

    const categories = Object.entries(this.categories);
    categories.forEach(([category, traits], index) => {
      const dropdownContent = traits.map(trait => trait.generateElement());
      const dropdown = new Dropdown(category, dropdownContent);
      traitsElement.appendChild(dropdown.generateElement());

      // Add a spacer div between dropdowns, but not after the last one
      if (index < categories.length - 1) {
        const spacer = document.createElement('div');
        spacer.className = 'dropdown-spacer';
        spacer.style.height = '20px'; // Adjust this value to increase or decrease space
        traitsElement.appendChild(spacer);
      }
    });
  }

  generateText() {
    let allTraitText = '';
    this._forEach(trait => allTraitText += trait.generateText());
    return allTraitText;
  }

  reroll() {
    this._forEach(trait => trait.reroll());
  }

  reset() {
    this.traits = {};
    this.categories = {
      "Personality Traits": [],
      "Status Traits": []
    };
    DEFAULT_TRAITS.forEach(traitData => this.addTrait(traitData.name, traitData.category));
    this.updateDropdowns();
  }

  deleteTrait(traitName) {
    const trait = this.traits[traitName];
    if (trait) {
      const category = trait.category;
      this.categories[category] = this.categories[category].filter(t => t.name !== traitName);
      delete this.traits[traitName];
      this.updateDropdowns();
    }
  }
}
