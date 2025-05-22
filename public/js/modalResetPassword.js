document.addEventListener("DOMContentLoaded", function() {
    // Variables
    const forgotPasswordLink = document.getElementById("forgot-password-link");
    const modal = document.getElementById("forgot-password-modal");
    const closeButton = document.querySelector(".close-button");
    const form = document.getElementById("forgot-password-form");
    const emailInput = document.getElementById("modal-email");
    const errorMessage = document.getElementById("error-message");

    // Ouvrir le modal lorsque le lien "Mot de passe oublié" est cliqué
    forgotPasswordLink.addEventListener("click", function(event) {
        event.preventDefault(); // Empêcher la redirection vers une nouvelle page
        modal.classList.remove("hidden"); // Afficher le modal
    });

    // Fermer le modal lorsque la croix est cliquée
    closeButton.addEventListener("click", function() {
        modal.classList.add("hidden"); // Masquer le modal
    });

    // Soumettre le formulaire de réinitialisation
    form.addEventListener("submit", async function(event) {
        event.preventDefault();

        const email = emailInput.value;

        try {
            const response = await fetch("/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message); // Afficher un message de succès
                modal.classList.add("hidden"); // Fermer le modal
            } else {
                errorMessage.textContent = result.message; // Afficher l'erreur
            }
        } catch (error) {
            errorMessage.textContent = "Une erreur est survenue. Veuillez réessayer plus tard.";
        }
    });
});
