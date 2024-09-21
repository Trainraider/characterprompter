class Popup {
  constructor(title, content, onSave) {
    this.overlay = document.createElement('div');
    this.overlay.className = 'popup-overlay';
    
    this.popup = document.createElement('div');
    this.popup.className = 'edit-popup';
    
    this.createCloseButton();
    this.createTitle(title);
    this.createContent(content);
    this.createButtons(onSave);

    document.body.appendChild(this.overlay);
    document.body.appendChild(this.popup);
  }

  createCloseButton() {
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.className = 'close-button';
    closeButton.onclick = () => this.close();
    this.popup.appendChild(closeButton);
  }

  createTitle(title) {
    const titleElement = document.createElement('h2');
    titleElement.textContent = title;
    this.popup.appendChild(titleElement);
  }

  createContent(content) {
    this.popup.appendChild(content);
  }

  createButtons(onSave) {
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.type = 'submit';
    saveButton.onclick = () => {
      onSave();
      this.close();
    };
    
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.type = 'button';
    cancelButton.onclick = () => this.close();

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'popup-buttons';
    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(cancelButton);

    this.popup.appendChild(buttonContainer);
  }

  close() {
    document.body.removeChild(this.overlay);
    document.body.removeChild(this.popup);
  }
}
