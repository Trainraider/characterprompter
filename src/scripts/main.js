document.addEventListener('DOMContentLoaded', (event) => {
  promptComponentManager.loadPromptComponents();
  initializeEventListeners();
  initializeBackgroundImage();

  attributeContainer.reset();
  traitContainer.reset();
  rerollAll();
});

// Initialize global classes.
const promptComponents = __PROMPT_COMPONENTS__;
const promptComponentManager = new PromptComponentManager(promptComponents);
const attributeContainer = new AttributeContainer();
const traitContainer = new TraitContainer();
const prompt_template = `
__PROMPT__
`;
const nsfw_prompt_template = `
__NSFW_PROMPT__
`;