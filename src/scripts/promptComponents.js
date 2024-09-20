const promptComponents = {{PROMPT_COMPONENTS}};

function loadPromptComponents() {
  const dropdown = document.getElementById('promptComponentsDropdown');
  for (const [key, component] of Object.entries(promptComponents)) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `component-${key}`;
    checkbox.checked = component.default;

    const label = document.createElement('label');
    label.htmlFor = checkbox.id;
    label.textContent = key;

    const div = document.createElement('div');
    div.appendChild(checkbox);
    div.appendChild(label);

    dropdown.appendChild(div);
  }
}

function getSelectedComponents(promptType) {
  const selected = {};
  for (const [key, component] of Object.entries(promptComponents)) {
    const checkbox = document.getElementById(`component-${key}`);
    if (checkbox && checkbox.checked) {
      selected[key] = component[promptType] || component['universal'];
    }
  }
  return selected;
}

function replaceComponentPlaceholders(text, selectedComponents) {
  for (const [key, content] of Object.entries(selectedComponents)) {
    const placeholder = `{{${key}}}`;
    text = text.replace(placeholder, content);
  }
  // Remove any remaining placeholders for unselected components, except {{user}} and {{char}}
  text = text.replace(/{{(?!user|char)[^}]+}}/g, '');
  return text;
}

function getPromptType(promptTemplate) {
  return promptTemplate === nsfw_prompt_template ? 'nsfw' : 'regular';
}