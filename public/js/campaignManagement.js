document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("treeSelectionModal");
  const selectBtn = document.getElementById("selectTreesBtn");
  const closeBtn = document.querySelector(".close");
  const confirmBtn = document.getElementById("confirmSelection");
  const treeListContainer = document.getElementById("treeListContainer");
  const selectedTreesPreview = document.getElementById("selectedTreesPreview");
  const selectedTreesData = document.getElementById("selectedTreesData");

  // Charger les arbres disponibles
  async function loadTrees() {
    try {
      const response = await fetch("/api/trees/available");
      const trees = await response.json();

      treeListContainer.innerHTML = trees
        .map(
          (tree) => `
        <div class="tree-item">
          <div>
            <h4>${tree.name}</h4>
            <p>Type: ${tree.type}</p>
            <p>Prix: ${tree.price}€</p>
          </div>
          <div class="tree-quantity">
            <input type="number" min="1" value="1" id="tree-${tree.id}-qty">
            <button class="add-tree-btn" data-tree-id="${tree.id}">Ajouter</button>
          </div>
        </div>
      `
        )
        .join("");
    } catch (error) {
      console.error("Erreur:", error);
    }
  }

  // Gestion de la sélection
  let selectedTrees = [];

  treeListContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("add-tree-btn")) {
      const treeId = parseInt(e.target.dataset.treeId);
      const qtyInput = document.getElementById(`tree-${treeId}-qty`);
      const quantity = parseInt(qtyInput.value);

      // Ajouter ou mettre à jour la sélection
      const existingIndex = selectedTrees.findIndex((t) => t.id === treeId);
      if (existingIndex >= 0) {
        selectedTrees[existingIndex].quantity += quantity;
      } else {
        const treeName = e.target
          .closest(".tree-item")
          .querySelector("h4").textContent;
        selectedTrees.push({ id: treeId, name: treeName, quantity });
      }

      updateSelectionPreview();
    }
  });

  function updateSelectionPreview() {
    selectedTreesPreview.innerHTML =
      selectedTrees.length > 0
        ? selectedTrees
            .map(
              (tree) => `
          <div class="selected-tree">
            <span>${tree.name} (x${tree.quantity})</span>
            <button class="remove-tree" data-tree-id="${tree.id}">×</button>
          </div>
        `
            )
            .join("")
        : "<p>Aucun arbre sélectionné</p>";

    selectedTreesData.value = JSON.stringify(selectedTrees);
  }

  selectedTreesPreview.addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-tree")) {
      const treeId = parseInt(e.target.dataset.treeId);
      selectedTrees = selectedTrees.filter((t) => t.id !== treeId);
      updateSelectionPreview();
    }
  });

  // Gestion du modal
  selectBtn.onclick = function () {
    loadTrees();
    modal.style.display = "block";
  };

  closeBtn.onclick = function () {
    modal.style.display = "none";
  };

  confirmBtn.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
});
// Modifiez votre gestionnaire de formulaire
document
  .getElementById("campaignForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this); // Capture tout le formulaire

    // Ajoutez les arbres sélectionnés
    const treesData = document.getElementById("selectedTreesData").value;
    if (treesData) {
      formData.append("selectedTrees", treesData);
    } else {
      alert("Veuillez sélectionner au moins un arbre");
      return;
    }

    // Envoi avec Fetch API
    fetch("/manager/campaigns/create", {
      method: "POST",
      body: formData, // FormData gère automatiquement les fichiers
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          window.location.href = "/manager/dashboard/campaign-management";
        } else {
          alert("Erreur: " + (data.error || "Échec de la création"));
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Erreur lors de l'envoi du formulaire");
      });
  });
