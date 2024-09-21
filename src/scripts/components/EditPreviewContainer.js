class EditPreviewContainer {
  constructor(name, value) {
    this.container = document.createElement('div');
    this.container.className = 'edit-preview-container';

    this.textarea = this.createTextarea(name, value);
    this.preview = this.createPreview(value);
    this.slider = this.createSlider();

    this.container.appendChild(this.slider);
    this.container.appendChild(this.textarea);
    this.container.appendChild(this.preview);

    this.setupEventListeners();
  }

  createTextarea(name, value) {
    const textarea = document.createElement('textarea');
    textarea.name = name;
    textarea.value = value;
    return textarea;
  }

  createPreview(value) {
    const preview = document.createElement('div');
    preview.className = 'preview';
    preview.innerHTML = marked.parse(value);
    return preview;
  }

  createSlider() {
    const slider = document.createElement('div');
    slider.className = 'slider';

    const sliderButton = document.createElement('div');
    sliderButton.className = 'slider-button';

    const sliderText = document.createElement('div');
    sliderText.className = 'slider-text';
    
    const editSpan = document.createElement('span');
    editSpan.textContent = 'Edit';
    
    const previewSpan = document.createElement('span');
    previewSpan.textContent = 'Preview';

    sliderText.appendChild(editSpan);
    sliderText.appendChild(previewSpan);

    slider.appendChild(sliderButton);
    slider.appendChild(sliderText);

    return slider;
  }

  setupEventListeners() {
    this.slider.onclick = () => {
      this.container.classList.toggle('show-preview');
      if (this.container.classList.contains('show-preview')) {
        this.updatePreview();
      }
    };

    this.textarea.oninput = () => {
      if (this.container.classList.contains('show-preview')) {
        this.updatePreview();
      }
    };
  }

  updatePreview() {
    this.preview.innerHTML = marked.parse(this.textarea.value);
  }

  getElement() {
    return this.container;
  }

  getValue() {
    return this.textarea.value;
  }
}
