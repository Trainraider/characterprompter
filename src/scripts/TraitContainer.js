
    class TraitContainer {
      constructor() {
        this.traits = {};
      }

      _forEach(callback) {
        Object.values(this.traits).forEach(callback);
      }

      addTrait(newTraitName) {
        if (newTraitName && !this.traits[newTraitName]) {
          this.traits[newTraitName] = new Trait(newTraitName);
          const traitsElement = document.getElementById('traits');
          traitsElement.appendChild(this.traits[newTraitName].generateElement());
        }
      }

      generateElements() {
        const traitsElement = document.getElementById('traits');
        traitsElement.innerHTML = '';
        this._forEach(trait => traitsElement.appendChild(trait.generateElement()));
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
        DEFAULT_TRAITS.forEach(traitName => this.addTrait(traitName));
        this.generateElements();
      }

      deleteTrait(traitName) {
        delete this.traits[traitName];
        this.generateElements();
      }      
    }
