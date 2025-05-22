document.addEventListener("DOMContentLoaded", function () {
  const deleteButtons = document.querySelectorAll('.action-delete');
  const deleteModal = document.getElementById('delete-modal');
  const closeDeleteModalButton = deleteModal.querySelector('.close-button');
  const cancelDeleteButton = deleteModal.querySelector('.cancel-delete');
  const confirmDeleteButton = deleteModal.querySelector('.confirm-delete');
  const deleteForm = document.getElementById('delete-form');

  let userIdToDelete = null;

  // Ouvrir le modal de confirmation de suppression
  deleteButtons.forEach(button => {
    button.addEventListener('click', function () {
      userIdToDelete = this.getAttribute('data-userid'); // Récupérer l'ID de l'utilisateur à supprimer
      deleteModal.classList.remove('hidden');
    });
  });

  // Fermer le modal de confirmation de suppression
  closeDeleteModalButton.addEventListener('click', function () {
    deleteModal.classList.add('hidden');
  });

  // Annuler la suppression et fermer le modal
  cancelDeleteButton.addEventListener('click', function () {
    deleteModal.classList.add('hidden');
  });

  // Confirmer la suppression
  confirmDeleteButton.addEventListener('click', function () {
    if (userIdToDelete) {
      // Ajouter l'ID de l'utilisateur à supprimer dans le formulaire de suppression
      deleteForm.action = `/admin/users/${userIdToDelete}/delete`; // URL de suppression
      deleteForm.submit(); // Soumettre le formulaire de suppression
    }
  });

  // Fermer le modal si on clique à l'extérieur
  window.addEventListener('click', function (event) {
    if (event.target === deleteModal) {
      deleteModal.classList.add('hidden');
    }
  });
});
