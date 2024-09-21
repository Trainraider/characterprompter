function initializeBackgroundImage() {
  const backgroundImageWrapper = document.querySelector('.background-image-wrapper');
  const backgroundImage = document.querySelector('.background-image');

  function checkHover(event) {
    const rect = backgroundImageWrapper.getBoundingClientRect();
    let clientX, clientY;

    if (event.type.includes('touch')) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    const isHovering = (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    );

    if (isHovering) {
      backgroundImage.src = 'image2.webp';
    } else {
      backgroundImage.src = 'image.webp';
    }
  }

  document.addEventListener('mousemove', checkHover);
  document.addEventListener('touchmove', checkHover);
  document.addEventListener('touchstart', checkHover);
}