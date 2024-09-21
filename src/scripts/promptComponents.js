const promptComponents = {{PROMPT_COMPONENTS}};

function loadPromptComponents() {
  const dropdown = document.getElementById('promptComponentsDropdown');
  dropdown.className = 'two-column-grid';

  for (const [key, component] of Object.entries(promptComponents)) {
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
    gearIcon.onclick = () => createEditPopup(key, component);

    const div = document.createElement('div');
    div.className = 'prompt-component-item';
    div.appendChild(checkbox);
    div.appendChild(label);
    div.appendChild(gearIcon);

    dropdown.appendChild(div);
  }
}

function createEditPopup(key, component) {
  const overlay = document.createElement('div');
  overlay.className = 'popup-overlay';
  
  const popup = document.createElement('div');
  popup.className = 'edit-popup';
  
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '&times;';
  closeButton.className = 'close-button';
  closeButton.onclick = () => {
    document.body.removeChild(overlay);
    document.body.removeChild(popup);
  };
  
  popup.appendChild(closeButton);

  const title = document.createElement('h2');
  title.textContent = `Edit ${key}`;
  popup.appendChild(title);

  const form = document.createElement('form');

  for (const [propKey, propValue] of Object.entries(component)) {
    if (typeof propValue === 'object') {
      const fieldset = document.createElement('fieldset');
      const legend = document.createElement('legend');
      legend.textContent = propKey;
      fieldset.appendChild(legend);

      for (const [subKey, subValue] of Object.entries(propValue)) {
        if (typeof subValue === 'string') {
          const label = document.createElement('label');
          label.textContent = subKey;
          const editPreviewContainer = createEditPreviewContainer(`${propKey}.${subKey}`, subValue);
          fieldset.appendChild(label);
          fieldset.appendChild(editPreviewContainer);
        } else if (Array.isArray(subValue)) {
          const arrayFieldset = document.createElement('fieldset');
          const arrayLegend = document.createElement('legend');
          arrayLegend.textContent = subKey;
          arrayFieldset.appendChild(arrayLegend);

          subValue.forEach((item, index) => {
            const label = document.createElement('label');
            label.textContent = `Item ${index + 1}`;
            const editPreviewContainer = createEditPreviewContainer(`${propKey}.${subKey}.${index}`, item);
            arrayFieldset.appendChild(label);
            arrayFieldset.appendChild(editPreviewContainer);
          });

          const addButton = document.createElement('button');
          addButton.textContent = 'Add Item';
          addButton.type = 'button';
          addButton.onclick = () => {
            const newIndex = arrayFieldset.querySelectorAll('.edit-preview-container').length;
            const label = document.createElement('label');
            label.textContent = `Item ${newIndex + 1}`;
            const editPreviewContainer = createEditPreviewContainer(`${propKey}.${subKey}.${newIndex}`, '');
            arrayFieldset.insertBefore(editPreviewContainer, addButton);
            arrayFieldset.insertBefore(label, editPreviewContainer);
          };

          arrayFieldset.appendChild(addButton);
          fieldset.appendChild(arrayFieldset);
        }
      }

      form.appendChild(fieldset);
    } else if (typeof propValue === 'string') {
      const label = document.createElement('label');
      label.textContent = propKey;
      const editPreviewContainer = createEditPreviewContainer(propKey, propValue);
      form.appendChild(label);
      form.appendChild(editPreviewContainer);
    }
  }

  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save';
  saveButton.type = 'submit';
  
  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.type = 'button';
  cancelButton.onclick = () => {
    document.body.removeChild(overlay);
    document.body.removeChild(popup);
  };

  form.appendChild(saveButton);
  form.appendChild(cancelButton);

  form.onsubmit = (e) => {
    e.preventDefault();
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
    document.body.removeChild(overlay);
    document.body.removeChild(popup);
  };

  popup.appendChild(form);
  document.body.appendChild(overlay);
  document.body.appendChild(popup);
}

function createEditPreviewContainer(name, value) {
  const container = document.createElement('div');
  container.className = 'edit-preview-container';

  const textarea = document.createElement('textarea');
  textarea.name = name;
  textarea.value = value;

  const preview = document.createElement('div');
  preview.className = 'preview';
  preview.innerHTML = marked.parse(value);

  const slider = document.createElement('div');
  slider.className = 'slider';

  const sliderButton = document.createElement('div');
  sliderButton.className = 'slider-button';

  const sliderText = document.createElement('div');
  sliderText.className = 'slider-text';
  
  const editSpan = document.createElement('span');
  editSpan.textContent = 'Edit';
  
  const previewSpan = document.createElement('span');
  previewSpan.textContent = 'Preview';

  sliderText.appendChild(editSpan);
  sliderText.appendChild(previewSpan);

  slider.appendChild(sliderButton);
  slider.appendChild(sliderText);

  container.appendChild(slider);
  container.appendChild(textarea);
  container.appendChild(preview);

  slider.onclick = () => {
    container.classList.toggle('show-preview');
    if (container.classList.contains('show-preview')) {
      preview.innerHTML = marked.parse(textarea.value);
    }
  };

  textarea.oninput = () => {
    if (container.classList.contains('show-preview')) {
      preview.innerHTML = marked.parse(textarea.value);
    }
  };

  return container;
}

function getSelectedComponents(promptType) {
  const selected = {
    components: {},
    dialogue_start: {},
    dialogue_end: {}
  };

  const dropdowns = document.querySelectorAll('#promptComponentsDropdown select');
  dropdowns.forEach(dropdown => {
    const selectedKey = dropdown.value;
    if (selectedKey) {
      const component = promptComponents[selectedKey];
      const content = component[promptType] || component['universal'];
      if (typeof content === 'object') {
        selected.components[selectedKey] = content.description || '';
        if (content.dialogue_start) {
          selected.dialogue_start[selectedKey] = content.dialogue_start;
        }
        if (content.dialogue_end) {
          selected.dialogue_end[selectedKey] = content.dialogue_end;
        }
      } else {
        selected.components[selectedKey] = content;
      }
    }
  });

  return selected;
}

function injectDialoguePrompts(text, dialogueStart, dialogueEnd) {
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

function replaceComponentPlaceholders(text, selectedComponents) {
  for (const [key, content] of Object.entries(selectedComponents.components)) {
    const placeholder = `{{${key}}}`;
    text = text.replace(placeholder, content);
  }
  
  // Inject dialogue prompts
  text = injectDialoguePrompts(text, selectedComponents.dialogue_start, selectedComponents.dialogue_end);
  
  // Remove any remaining placeholders for unselected components, except {{user}} and {{char}}
  text = text.replace(/{{(?!user|char)[^}]+}}/g, '');
  return text;
}

function getPromptType(promptTemplate) {
  return promptTemplate === nsfw_prompt_template ? 'nsfw' : 'regular';
}