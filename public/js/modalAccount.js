document.addEventListener("DOMContentLoaded", () => {
    const openModalBtn = document.querySelector('.add-account-button');
    const modal = document.getElementById('account-modal');
    const closeBtn = document.querySelector('.close-button');
  
    openModalBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
    });
  
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  });

  document.addEventListener('DOMContentLoaded', function () {
    const editButtons = document.querySelectorAll('.action-edit');
    const editModal = document.getElementById('edit-modal');
    const closeButton = editModal.querySelector('.close-button');
    const editForm = document.getElementById('edit-form');
  
    // Ouvrir le modal d'édition et pré-remplir les champs
    editButtons.forEach(button => {
      button.addEventListener('click', function () {
        const userId = this.closest('tr').querySelector('.action-delete').getAttribute('data-userid');
  
        // Récupérer les données de l'utilisateur (ici, vous pouvez faire une requête AJAX pour obtenir les données)
        const userRow = this.closest('tr');
        const lastName = userRow.querySelector('td:nth-child(1)').textContent.trim();
        const firstName = userRow.querySelector('td:nth-child(2)').textContent.trim();
        const email = userRow.querySelector('td:nth-child(3)').textContent.trim();
        const address = userRow.querySelector('td:nth-child(4)').textContent.trim();
        const phone = userRow.querySelector('td:nth-child(5)').textContent.trim();
  
        // Remplir le formulaire avec les données de l'utilisateur
        document.getElementById('edit-user-id').value = userId;
        document.getElementById('edit-lastname').value = lastName;
        document.getElementById('edit-firstname').value = firstName;
        document.getElementById('edit-email').value = email;
        document.getElementById('edit-address').value = address;
        document.getElementById('edit-phone').value = phone;
  
        // Afficher le modal
        editModal.classList.remove('hidden');
      });
    });
  
    // Fermer le modal
    closeButton.addEventListener('click', function () {
      editModal.classList.add('hidden');
    });
  
    // Fermer le modal si on clique à l'extérieur
    window.addEventListener('click', function (event) {
      if (event.target === editModal) {
        editModal.classList.add('hidden');
      }
    });
  });
  