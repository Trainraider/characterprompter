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

    for (const [category, traits] of Object.entries(this.categories)) {
      const dropdownContent = traits.map(trait => trait.generateElement());
      const dropdown = new Dropdown(category, dropdownContent);
      traitsElement.appendChild(dropdown.generateElement());
    }
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
