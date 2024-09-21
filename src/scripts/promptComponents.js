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
  const popup = document.createElement('div');
  popup.className = 'edit-popup';
  
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '&times;';
  closeButton.className = 'close-button';
  closeButton.onclick = () => document.body.removeChild(popup);
  
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
          const input = document.createElement('textarea');
          input.value = subValue;
          input.name = `${propKey}.${subKey}`;
          fieldset.appendChild(label);
          fieldset.appendChild(input);
        }
      }

      form.appendChild(fieldset);
    } else if (typeof propValue === 'string') {
      const label = document.createElement('label');
      label.textContent = propKey;
      const input = document.createElement('textarea');
      input.value = propValue;
      input.name = propKey;
      form.appendChild(label);
      form.appendChild(input);
    }
  }

  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save';
  saveButton.type = 'submit';
  
  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.type = 'button';
  cancelButton.onclick = () => document.body.removeChild(popup);

  form.appendChild(saveButton);
  form.appendChild(cancelButton);

  form.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    for (const [name, value] of formData.entries()) {
      const keys = name.split('.');
      let target = component;
      for (let i = 0; i < keys.length - 1; i++) {
        target = target[keys[i]];
      }
      target[keys[keys.length - 1]] = value;
    }
    document.body.removeChild(popup);
  };

  popup.appendChild(form);
  document.body.appendChild(popup);
}

function getSelectedComponents(promptType) {
  const selected = {
    components: {},
    dialogue_start: {},
    dialogue_end: {}
  };
  for (const [key, component] of Object.entries(promptComponents)) {
    const checkbox = document.getElementById(`component-${key}`);
    if (checkbox && checkbox.checked) {
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
  }
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