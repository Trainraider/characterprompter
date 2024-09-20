function initializeEventListeners() {
  document.getElementById('digestedTraits').addEventListener('input', function () {
    const step2Prompts = document.getElementById('step2Prompts');
    if (this.value.trim()) {
      step2Prompts.classList.add('active');
    } else {
      step2Prompts.classList.remove('active');
    }
  });

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

  const foldableBoxes = document.querySelectorAll('.prompt-box.foldable');

  foldableBoxes.forEach(box => {
    const title = box.querySelector('.prompt-title');
    title.addEventListener('click', () => {
      box.classList.toggle('active');
    });
  });
}

function rerollAll() {
  attributeContainer.reroll();
  traitContainer.reroll();
}