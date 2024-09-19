class Dropdown {
  constructor(buttonText, content) {
    this.buttonText = buttonText;
    this.content = content;
    this.element = null;
  }

  generateElement() {
    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'dropdown-container';

    const dropdownButton = document.createElement('button');
    dropdownButton.className = 'dropdown-button';
    dropdownButton.textContent = this.buttonText;
    dropdownButton.onclick = () => dropdownContainer.classList.toggle('active');

    const dropdownContent = document.createElement('div');
    dropdownContent.className = 'dropdown-content';

    this.content.forEach(item => dropdownContent.appendChild(item));

    dropdownContainer.appendChild(dropdownButton);
    dropdownContainer.appendChild(dropdownContent);

    this.element = dropdownContainer;
    return dropdownContainer;
  }
}