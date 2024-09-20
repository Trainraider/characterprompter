function initializeNewTraitFunctionality() {
  const newTraitInput = document.getElementById('newTraitInput');
  const newTraitAntonymInput = document.getElementById('newTraitAntonymInput');
  const addButton = document.querySelector('.trait-input button');
  const categorySelect = document.getElementById('traitCategory');

  function addNewTrait() {
    const newTraitName = newTraitInput.value.trim();
    const newTraitAntonym = newTraitAntonymInput.value.trim();
    const category = categorySelect.value;
    if (newTraitName && newTraitAntonym) {
      traitContainer.addTrait(newTraitName, newTraitAntonym, category);
      newTraitInput.value = "";
      newTraitAntonymInput.value = "";
    }
  }

  newTraitInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addNewTrait();
    }
  });

  newTraitAntonymInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addNewTrait();
    }
  });

  addButton.onclick = addNewTrait;
}