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

        const dropdownContainer = document.createElement('div');
        dropdownContainer.className = 'dropdown-container';

        const dropdownButton = document.createElement('button');
        dropdownButton.className = 'dropdown-button';
        dropdownButton.textContent = 'Attributes';
        dropdownButton.onclick = () => dropdownContainer.classList.toggle('active');

        const dropdownContent = document.createElement('div');
        dropdownContent.className = 'dropdown-content';

        this._forEach(attribute => dropdownContent.appendChild(attribute.generateElement()));

        dropdownContainer.appendChild(dropdownButton);
        dropdownContainer.appendChild(dropdownContent);
        attributesElement.appendChild(dropdownContainer);
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
