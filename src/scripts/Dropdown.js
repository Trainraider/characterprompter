class Dropdown {
  constructor(buttonText, content) {
    this.buttonText = buttonText;
    this.content = content;
    this.element = null;
    this.isOpen = false;
  }

  generateElement() {
    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'dropdown-container';

    const dropdownButton = document.createElement('button');
    dropdownButton.className = 'dropdown-button';
    dropdownButton.textContent = this.buttonText;
    dropdownButton.onclick = (event) => {
      event.stopPropagation();
      this.toggle();
    };

    const dropdownContent = document.createElement('div');
    dropdownContent.className = 'dropdown-content';

    this.content.forEach(item => dropdownContent.appendChild(item));

    dropdownContainer.appendChild(dropdownButton);
    dropdownContainer.appendChild(dropdownContent);

    this.element = dropdownContainer;

    return dropdownContainer;
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    if (this.element) {
      this.element.classList.add('active');
      this.isOpen = true;
    }
  }

  close() {
    if (this.element) {
      this.element.classList.remove('active');
      this.isOpen = false;
    }
  }
}