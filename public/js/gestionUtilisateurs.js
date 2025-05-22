document.addEventListener("DOMContentLoaded", () => {
    // Gérer les clics sur les boutons "Modifier"
    document.querySelectorAll('.edit').forEach(button => {
      button.addEventListener('click', (event) => {
        const userId = event.target.closest('tr').dataset.userId;
        console.log(`Modifier l'utilisateur avec l'ID: ${userId}`);
        // Code pour éditer l'utilisateur (ouvrir un formulaire ou une autre page)
      });
    });
  
    // Gérer les clics sur les boutons "Supprimer"
    document.querySelectorAll('.delete').forEach(button => {
      button.addEventListener('click', (event) => {
        const userId = event.target.closest('tr').dataset.userId;
        console.log(`Supprimer l'utilisateur avec l'ID: ${userId}`);
        // Code pour supprimer l'utilisateur via une requête API DELETE
      });
    });
  });
  