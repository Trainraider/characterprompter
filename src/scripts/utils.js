
function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);

  // Show copy notification
  const notification = document.getElementById('copyNotification');
  notification.style.opacity = '1';
  notification.style.visibility = 'visible';
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.visibility = 'hidden';
  }, 1000);
}

function generateTraitAttributeText(attributeContainer, traitContainer) {
  return attributeContainer.generateText() + traitContainer.generateText();
}

function updateContainerLocks() {
  dropdowns = { ...traitContainer.dropdowns, attributes: attributeContainer.dropdown }
  Object.values(dropdowns).forEach(dropdown => {
    dropdown.syncLockButtonState();
  })
}
