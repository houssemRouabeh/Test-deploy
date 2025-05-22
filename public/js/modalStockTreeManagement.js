document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.querySelector('.add-tree-button');
  const addModal = document.getElementById('addTreeModal');
  const editModal = document.getElementById('editTreeModal');
  const closeButtons = document.querySelectorAll('[data-close]');
  const editButtons = document.querySelectorAll('.action-edit');

  // Ouvrir modal d’ajout
  addBtn.addEventListener('click', () => {
    addModal.classList.remove('hidden');
  });

  // Ouvrir modal d’édition
  editButtons.forEach(button => {
    button.addEventListener('click', () => {
      const treeId = button.dataset.treeid;

      const row = button.closest('tr');
      const name = row.children[0].textContent.trim();
      const description = row.children[1].textContent.trim();
      const quantity = row.children[2].textContent.trim();
      const price = row.children[4].textContent.trim();

      

      editModal.classList.remove('hidden');
    });
  });

  // Fermer les modals
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.dataset.close;
      document.getElementById(modalId).classList.add('hidden');
    });
  });

  // Fermer modal si clic à l'extérieur
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.classList.add('hidden');
    }
  });
});


// gestion modification des arbre
document.addEventListener('DOMContentLoaded', () => {
  const editButtons = document.querySelectorAll('.action-edit');
  const editModal = document.getElementById('editTreeModal');
  const editForm = document.getElementById('editTreeForm');

  const closeBtns = document.querySelectorAll('[data-close]');
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.close;
      document.getElementById(target).classList.add('hidden');
    });
  });

  editButtons.forEach(button => {
    button.addEventListener('click', () => {
      const treeId = button.dataset.treeid;
      const name = button.dataset.name;
      const description = button.dataset.description;
      const quantity = button.dataset.quantity;
      const price = button.dataset.price;

      editForm.action = `/update-tree/${treeId}`;
      document.getElementById('edit-name').value = name;
      document.getElementById('edit-description').value = description;
      document.getElementById('edit-quantity').value = quantity;
      document.getElementById('edit-price').value = price;

      editModal.classList.remove('hidden');
    });
  });
});


