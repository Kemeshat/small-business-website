// Select elements
const input = document.getElementById('ctaInput');
const button = document.getElementById('updateButton');
const ctaHeadline = document.getElementById('ctaHeadline');

// Update CTA on button click
button.addEventListener('click', () => {
  if(input.value.trim() !== ''){
    ctaHeadline.textContent = input.value + " 🍳";
    input.value = '';
  }
});
