// Prompt components object
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

function rerollAll() {
  attributeContainer.reroll();
  traitContainer.reroll();
}

function generateStep1Prompt() {
  let allText = generateTraitAttributeText(attributeContainer, traitContainer);
  const customPromptText = document.getElementById('customPrompt').value.trim();

  const personalityTraitsList = PERSONALITY_TRAITS.join(', ');

  const selectedComponents = getSelectedComponents('regular');
  let step1Prompt = `Based on the following information about a character:
    ${allText}
    ${customPromptText}

    And considering this list of personality traits: ${personalityTraitsList}
    Please list the personality traits from the provided list that most apply to this character based on the information given. Your list should only be space separated. You can also use traits that weren't listed in your list. 
    After that list, make a status description that is consistent the status traits while avoiding using terms directly from the status trait names.
    Following the status description, write an encounter scenario that is consistent with the scenario traits, while still avoiding using the specific wording from that scenario traits list.

    Plan out how to answer while meeting all requirements and crafting a compelling story narrative.
    Then, put your final answer with those three elements in a code block.`;

  step1Prompt = replaceComponentPlaceholders(step1Prompt, selectedComponents);
  copyToClipboard(step1Prompt);
}

function copyWithStep2Prompt(promptTemplate) {
  const digestedTraits = document.getElementById('digestedTraits').value.trim();
  if (!digestedTraits) {
    return;
  }

  // Generate text for attributes
  let attributesText = attributeContainer.generateText() + 'Personality:\n';
  let allText = attributesText + digestedTraits;

  const customPromptText = document.getElementById('customPrompt').value.trim();
  const promptType = getPromptType(promptTemplate);
  const selectedComponents = getSelectedComponents(promptType);
  let finalText = promptTemplate
    .replace('{{traits}}', allText)
    .replace('{{custom_prompt}}', customPromptText);

  finalText = replaceComponentPlaceholders(finalText, selectedComponents);
  copyToClipboard(finalText);
}

function copyAll() {
  let allText = generateTraitAttributeText(attributeContainer, traitContainer);
  copyToClipboard(allText);
}

function copyWithPrompt(prompt) {
  let allText = generateTraitAttributeText(attributeContainer, traitContainer);
  const customPromptText = document.getElementById('customPrompt').value.trim();
  const promptType = getPromptType(prompt);
  const selectedComponents = getSelectedComponents(promptType);
  let finalText = prompt
    .replace('{{traits}}', allText)
    .replace('{{custom_prompt}}', customPromptText);

  finalText = replaceComponentPlaceholders(finalText, selectedComponents);
  copyToClipboard(finalText);
}

document.getElementById('digestedTraits').addEventListener('input', function () {
  const step2Prompts = document.getElementById('step2Prompts');
  if (this.value.trim()) {
    step2Prompts.classList.add('active');
  } else {
    step2Prompts.classList.remove('active');
  }
});

document.addEventListener('DOMContentLoaded', (event) => {
  loadPromptComponents();

  const toggleButton = document.getElementById('toggleDescription');
  const description = document.getElementById('description');

  toggleButton.addEventListener('click', () => {
    if (description.style.display === 'none') {
      description.style.display = 'block';
      toggleButton.textContent = 'Hide';
    } else {
      description.style.display = 'none';
      toggleButton.textContent = 'How does this work?';
    }
  });

  const scrollToTopButton = document.getElementById('scrollToTop');

  scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0 });
  });

  const backgroundImageWrapper = document.querySelector('.background-image-wrapper');
  const backgroundImage = document.querySelector('.background-image');

  function checkHover(event) {
    const rect = backgroundImageWrapper.getBoundingClientRect();
    let clientX, clientY;

    if (event.type.includes('touch')) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    const isHovering = (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    );

    if (isHovering) {
      backgroundImage.src = 'image2.webp';
    } else {
      backgroundImage.src = 'image.webp';
    }
  }

  document.addEventListener('mousemove', checkHover);
  document.addEventListener('touchmove', checkHover);
  document.addEventListener('touchstart', checkHover);

  const foldableBoxes = document.querySelectorAll('.prompt-box.foldable');

  foldableBoxes.forEach(box => {
    const title = box.querySelector('.prompt-title');
    title.addEventListener('click', () => {
      box.classList.toggle('active');
    });
  });

  const newTraitInput = document.getElementById('newTraitInput');
  const newTraitAntonymInput = document.getElementById('newTraitAntonymInput');
  const addButton = document.querySelector('.trait-input button');
  const categorySelect = document.getElementById('traitCategory');

  function addNewTrait() {
    const newTraitName = newTraitInput.value.trim();
    const newTraitAntonym = newTraitAntonymInput.value.trim();
    const category = categorySelect.value;
    if (newTraitName && newTraitAntonym) {
      traitContainer.addTrait(newTraitName, newTraitAntonym, category);
      newTraitInput.value = "";
      newTraitAntonymInput.value = "";
    }
  }

  newTraitInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addNewTrait();
    }
  });

  newTraitAntonymInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addNewTrait();
    }
  });

  addButton.onclick = addNewTrait;

  attributeContainer.reset();
  traitContainer.reset();
  rerollAll();
});

// Initialize containers
const attributeContainer = new AttributeContainer();
const traitContainer = new TraitContainer();
const prompt_template = `
{{PROMPT}}
`;
const nsfw_prompt_template = `
{{NSFW_PROMPT}}
`;