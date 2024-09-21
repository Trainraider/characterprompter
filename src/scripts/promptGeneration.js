function generateTraitAttributeText(attributeContainer, traitContainer) {
  let allText = '';
  
  allText += attributeContainer.generateText();
  allText += traitContainer.generateText();
  return allText;
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

    Before answering, plan out how to answer while meeting all requirements and crafting a compelling story narrative. You must write 3 unique possible scenarios in your plan that are highly specific and detailed and then pick the most compelling.
    Then, put your final answer with those personality traits, status description, and chosen scenario in a code block. The scenario is primarily between two people, {{char}} and {{user}}.
    
    Write your response in the following format:
    
    Plan:
    <reasoning about how the traits interact in unique ways, how traits that seem to conflict actually imply a unique backstory and current scenario etc.>
    
    Scenario 1:

    Scenario 2:

    Scenario 3:

    Chosen Scenario:

    Final Answer in Code block:
    \`\`\`
    Personality:

    Status:

    Scenario:
    \`\`\`
    `;

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