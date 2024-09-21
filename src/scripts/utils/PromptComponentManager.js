class PromptComponentManager {
  constructor(promptComponents) {
    this.promptComponents = promptComponents;
  }

  loadPromptComponents() {
    const dropdown = document.getElementById('promptComponentsDropdown');
    dropdown.className = 'two-column-grid';

    for (const [key, component] of Object.entries(this.promptComponents)) {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `component-${key}`;
      checkbox.checked = component.default;

      const label = document.createElement('label');
      label.htmlFor = checkbox.id;
      label.textContent = key;

      const gearIcon = document.createElement('button');
      gearIcon.innerHTML = '⚙️';
      gearIcon.className = 'gear-icon';
      gearIcon.onclick = () => this.createEditPopup(key, component);

      const div = document.createElement('div');
      div.className = 'prompt-component-item';
      div.appendChild(checkbox);
      div.appendChild(label);
      div.appendChild(gearIcon);

      dropdown.appendChild(div);
    }
  }

  createEditPopup(key, component) {
    const form = this.createEditForm(key, component);
    const popup = new Popup(`Edit ${key}`, form, () => this.saveEditForm(form, component));
  }

  createEditForm(key, component) {
    const form = document.createElement('form');

    for (const [propKey, propValue] of Object.entries(component)) {
      if (typeof propValue === 'object') {
        const fieldset = this.createFieldset(propKey, propValue, `${key}.${propKey}`);
        form.appendChild(fieldset);
      } else if (typeof propValue === 'string') {
        const label = document.createElement('label');
        label.textContent = propKey;
        const editPreviewContainer = new EditPreviewContainer(propKey, propValue);
        form.appendChild(label);
        form.appendChild(editPreviewContainer.getElement());
      }
    }

    return form;
  }

  createFieldset(propKey, propValue, parentKey) {
    const fieldset = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.textContent = propKey;
    fieldset.appendChild(legend);

    for (const [subKey, subValue] of Object.entries(propValue)) {
      if (typeof subValue === 'string') {
        const label = document.createElement('label');
        label.textContent = subKey;
        const editPreviewContainer = new EditPreviewContainer(`${parentKey}.${subKey}`, subValue);
        fieldset.appendChild(label);
        fieldset.appendChild(editPreviewContainer.getElement());
      } else if (Array.isArray(subValue)) {
        const arrayFieldset = this.createArrayFieldset(subKey, subValue, `${parentKey}.${subKey}`);
        fieldset.appendChild(arrayFieldset);
      }
    }

    return fieldset;
  }

  createArrayFieldset(subKey, subValue, parentKey) {
    const arrayFieldset = document.createElement('fieldset');
    const arrayLegend = document.createElement('legend');
    arrayLegend.textContent = subKey;
    arrayFieldset.appendChild(arrayLegend);

    subValue.forEach((item, index) => {
      const label = document.createElement('label');
      label.textContent = `Item ${index + 1}`;
      const editPreviewContainer = new EditPreviewContainer(`${parentKey}.${index}`, item);
      arrayFieldset.appendChild(label);
      arrayFieldset.appendChild(editPreviewContainer.getElement());
    });

    const addButton = document.createElement('button');
    addButton.textContent = 'Add Item';
    addButton.type = 'button';
    addButton.onclick = () => {
      const newIndex = arrayFieldset.querySelectorAll('.edit-preview-container').length;
      const label = document.createElement('label');
      label.textContent = `Item ${newIndex + 1}`;
      const editPreviewContainer = new EditPreviewContainer(`${parentKey}.${newIndex}`, '');
      arrayFieldset.insertBefore(editPreviewContainer.getElement(), addButton);
      arrayFieldset.insertBefore(label, editPreviewContainer.getElement());
    };

    arrayFieldset.appendChild(addButton);
    return arrayFieldset;
  }

  saveEditForm(form, component) {
    const formData = new FormData(form);
    for (const [name, value] of formData.entries()) {
      const keys = name.split('.');
      let target = component;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!target[keys[i]]) {
          if (isNaN(parseInt(keys[i + 1]))) {
            target[keys[i]] = {};
          } else {
            target[keys[i]] = [];
          }
        }
        target = target[keys[i]];
      }
      const lastKey = keys[keys.length - 1];
      if (Array.isArray(target)) {
        target[parseInt(lastKey)] = value;
      } else {
        target[lastKey] = value;
      }
    }
    // Clean up empty array items
    for (const [propKey, propValue] of Object.entries(component)) {
      if (typeof propValue === 'object') {
        for (const [subKey, subValue] of Object.entries(propValue)) {
          if (Array.isArray(subValue)) {
            component[propKey][subKey] = subValue.filter(item => item !== '');
          }
        }
      }
    }
  }

  getPromptType(promptTemplate) {
    return promptTemplate === nsfw_prompt_template ? 'nsfw' : 'regular';
  }

  getSelectedComponents(promptType) {
    const selected = {
      components: {},
      dialogue_start: {},
      dialogue_end: {}
    };

    const checkboxes = document.querySelectorAll('#promptComponentsDropdown input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        const key = checkbox.id.replace('component-', '');
        const component = this.promptComponents[key];
        const content = component[promptType] || component['universal'];
        if (typeof content === 'object') {
          selected.components[key] = content.description || '';
          if (content.dialogue_start) {
            selected.dialogue_start[key] = content.dialogue_start;
          }
          if (content.dialogue_end) {
            selected.dialogue_end[key] = content.dialogue_end;
          }
        } else {
          selected.components[key] = content;
        }
      }
    });

    return selected;
  }

  injectDialoguePrompts(text, dialogueStart, dialogueEnd) {
    let startCount = 0;
    let endCount = 0;

    text = text.replace(/{{dialogue start}}/g, () => {
      const prompts = Object.values(dialogueStart).map(arr => arr[startCount % arr.length]);
      startCount++;
      return prompts.join('\n\n') + '\n\n';
    });

    text = text.replace(/{{dialogue end}}/g, () => {
      const prompts = Object.values(dialogueEnd).map(arr => arr[endCount % arr.length]);
      endCount++;
      return prompts.join('\n\n') + '\n';
    });

    return text;
  }

  replaceComponentPlaceholders(text, selectedComponents) {
    for (const [key, content] of Object.entries(selectedComponents.components)) {
      const placeholder = `{{${key}}}`;
      text = text.replace(placeholder, content);
    }
    
    // Inject dialogue prompts
    text = this.injectDialoguePrompts(text, selectedComponents.dialogue_start, selectedComponents.dialogue_end);
    
    // Remove any remaining placeholders for unselected components, except {{user}} and {{char}}
    text = text.replace(/{{(?!user|char)[^}]+}}/g, '');
    return text;
  }
}
