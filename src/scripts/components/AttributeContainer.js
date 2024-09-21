class AttributeContainer {
  constructor() {
    this.attributes = {};
    this.dropdown = null;
  }

  _forEach(callback) {
    Object.values(this.attributes).forEach(callback);
  }

  addAttribute(name, options) {
    this.attributes[name] = new Attribute(name, options);
  }

  generateElements() {
    const attributesElement = document.getElementById('attributes');
    attributesElement.innerHTML = '';

    const attributeElements = [];
    this._forEach(attribute => attributeElements.push(attribute.generateElement()));

    this.dropdown = new Dropdown('Attributes', attributeElements, this.isLocked.bind(this), this.lockAll.bind(this), this.unlockAll.bind(this));
    attributesElement.appendChild(this.dropdown.generateElement());
  }

  generateText() {
    let attributesText = '';
    this._forEach(attribute => {
      attributesText += attribute.generateText() + '\n';
    });
    // Remove any leading/trailing whitespace and ensure no empty lines
    attributesText = attributesText.trim().replace(/^\s+/gm, '');
    // Add a single newline at the end
    return attributesText + '\n';
  }

  reroll() {
    this._forEach(attribute => attribute.reroll())
    const worldTypeAttribute = this.attributes['World Type'];
    const raceAttribute = this.attributes['Race'];
    if (worldTypeAttribute && raceAttribute && !raceAttribute.lock.isLocked()) {
      if (worldTypeAttribute.value !== 'Fantasy') {
        raceAttribute.updateValue('Human');
      }
    }
  }

  reset() {
    this.attributes = {};
    Object.entries(ATTRIBUTES_INFO).forEach(([key, options]) => {
      this.addAttribute(key, options);
    });
    this.generateElements();
  }

  isLocked() {
    return Object.values(this.attributes).every(attribute => attribute.lock.isLocked());
  }

  lockAll() {
    this._forEach(attribute => attribute.lock.lock());
  }

  unlockAll() {
    this._forEach(attribute => attribute.lock.unlock());
  }
}
