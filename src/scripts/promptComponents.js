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