class Dropdown {
  constructor(buttonText, content, isLocked, lockAll, unlockAll) {
    this.buttonText = buttonText;
    this.content = content;
    this.element = null;
    this.isOpen = false;
    this.lockButton = new LockButton(buttonText);
    this.isLocked = isLocked;
    this.lockAll = lockAll;
    this.unlockAll = unlockAll;
  }

  generateElement() {
    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'dropdown-container';

    const dropdownButton = document.createElement('div');
    dropdownButton.className = 'dropdown-button';
    
    const buttonText = document.createElement('span');
    buttonText.textContent = this.buttonText;
    dropdownButton.onclick = (event) => {
      event.stopPropagation();
      this.toggle();
    };
    dropdownButton.appendChild(buttonText);

    const lockButtonElement = this.lockButton.createLockButton();
    lockButtonElement.onclick = (event) => {
      event.stopPropagation();
      this.toggleLock();
    };
    dropdownButton.appendChild(lockButtonElement);

    const dropdownContent = document.createElement('div');
    dropdownContent.className = 'dropdown-content';

    this.content.forEach(item => dropdownContent.appendChild(item));

    dropdownContainer.appendChild(dropdownButton);
    dropdownContainer.appendChild(dropdownContent);

    this.element = dropdownContainer;
    this.lockButton.setElement(dropdownContainer);

    // Initial sync of lock button state
    this.syncLockButtonState();

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

  toggleLock() {
    if (this.isLocked()) {
      this.unlockAll();
    } else {
      this.lockAll();
    }
    this.syncLockButtonState();
  }

  syncLockButtonState() {
    const isLocked = this.isLocked();
    this.lockButton.locked = isLocked;
    this.lockButton.updateElementState();
  }
}