class TraitContainer {
  constructor() {
    this.traits = {};
    this.categories = {
      "Personality Traits": [],
      "Status Traits": [],
      "Scenario Traits": []
    };
  }

  _forEach(callback) {
    Object.values(this.traits).forEach(callback);
  }

  addTrait(newTraitName, antonym, category) {
    if (newTraitName && !this.traits[newTraitName] && this.categories[category]) {
      this.traits[newTraitName] = new Trait(newTraitName, antonym, category);
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
    });
  }

  generateText() {
    let allTraitText = '';
    for (const category of ['Personality Traits', 'Status Traits', 'Scenario Traits']) {
      let categoryText = `${category}:\n`;
      for (const trait of this.categories[category]) {
        categoryText += trait.generateText();
      }
      allTraitText += categoryText + '\n';
    }
    return allTraitText;
  }

  reroll() {
    this._forEach(trait => trait.reroll());
  }

  reset() {
    this.traits = {};
    this.categories = {
      "Personality Traits": [],
      "Status Traits": [],
      "Scenario Traits": []
    };
    DEFAULT_TRAITS.forEach(traitData => this.addTrait(traitData.name, traitData.antonym, traitData.category));
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
