document.addEventListener('DOMContentLoaded', (event) => {
  loadPromptComponents();
  initializeEventListeners();
  initializeBackgroundImage();
  initializeNewTraitFunctionality();

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