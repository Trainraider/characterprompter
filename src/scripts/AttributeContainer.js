
    class AttributeContainer {
      constructor() {
        this.attributes = {};
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
        this._forEach(attribute => attributesElement.appendChild(attribute.generateElement()));
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
    }
