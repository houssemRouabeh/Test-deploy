const modal = document.getElementById('treeSelectionModal');
const closeBtn = document.querySelector('.tree-selection-close');

document.querySelector('button').addEventListener('click', function (e) {
  e.preventDefault();
  modal.style.display = 'block';
});

closeBtn.addEventListener('click', function () {
  modal.style.display = 'none';
});

window.addEventListener('click', function (e) {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});
