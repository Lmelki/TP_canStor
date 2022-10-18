var produits;

// Utiliser la méthode fetch pour récupérer des données
// Si la response est résolue, on invoque la fonction initialize
// Sinon, on signale l'erreur dans la console
fetch('produits.json')
.then(function (response) {
  if (response.ok) {
    response.json()
    .then(function (json) {
      produits = json;
      initialize();
    });
  } else {
    console.log('Network request for produits.json failed with response ' + response.status + ': ' + response.statusText); //le statut de la réponse + le code de l'erreur
  }
});

// Une fois appelée, la fonction fais fonctionner toute l'application
function initialize() {
  // selctionner les éléments du DOM sur lesquels on va effectuer des manipulations
  var category = document.querySelector('#category');
  var searchTerm = document.querySelector('#searchTerm');
  var searchBtn = document.querySelector('button');
  var main = document.querySelector('main');
  // stocker la denière valeur de "category"
  var lastCategory = category.value;
  // déclarer une variable qui ne contient aucune valeur 
  var lastSearch = '';

  var categoryGroup;
  var finalGroup;
  // Attribuer la valeur des produits à la variable finalGroup puis appeler la fonction updateDisplay()
  finalGroup = produits;
  updateDisplay();
  // Définir les variables sous forme de tableaux
  categoryGroup = [];
  finalGroup = [];
  // lorsque le bouton de recherche est cliqué, invoquer la fonction selectCategory()
  searchBtn.onclick = selectCategory;
  // La fonction selectCategory, permet d'afficher les produits selon la catégorie sélectionnée
  function selectCategory(e) {
    //stoper la soumission du formulaire
    e.preventDefault();
    //remettre les tableaux
    categoryGroup = [];
    finalGroup = [];
    //Si le choix de gatégorie est inchangé, retourner la fonction. Sinon attribuer les nouvelles valeurs
    if (category.value === lastCategory && searchTerm.value.trim() === lastSearch) {
      return;
    } else {     
      lastCategory = category.value;
      lastSearch = searchTerm.value.trim();
      //Si le choix est All, attribuer à la variable categoryGroup tous les produits
      //Sinon transformer en miniscule et ajouter le produit de la catégorie choisie 
      if (category.value === 'Tous') {
        categoryGroup = produits;
        selectProduits();
      } else {
        var lowerCaseType = category.value.toLowerCase();
        for (var i = 0; i < produits.length; i++) {
          if (produits[i].type === lowerCaseType) {
            categoryGroup.push(produits[i]);
          }
        }
        selectProduits();
      }
    }
  }

//La fonction selectProduits permet de traiter la recherche par saisie
  function selectProduits() {
    //Si aucune saisie détectée, on conserve la valeur de categoryGroup
    //Sinon transformer en miniscule et ajouter le produit de la catégorie saisie
    if (searchTerm.value.trim() === '') {
      finalGroup = categoryGroup;
      updateDisplay();
    } else {
      var lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase();
      for (var i = 0; i < categoryGroup.length; i++) {
        if (categoryGroup[i].nom.indexOf(lowerCaseSearchTerm) !== -1) {
          finalGroup.push(categoryGroup[i]);
        }
      }
      updateDisplay();
    }
  }
//La fonction updateDisplay permet de mettre à jour la page
  function updateDisplay() {
    //supprimer l'élément du main tant qu'il y en a un
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }
    //Si la liste est vide, créer un élément "p" dans lequel sera afficher l'abesence de résultat
    //Sinon appeler la fonction showProduit pour chque produit de la liste
    if (finalGroup.length === 0) {
      var para = document.createElement('p');
      para.textContent = 'Pas de résultat !';
      main.appendChild(para);
    } else {
      for (var i = 0; i < finalGroup.length; i++) {
        showProduit(finalGroup[i]);
      }
    }
  }

  // function fetchBlob(product) {
  //   var url = 'images/' + product.image;
  //   fetch(url).then(function (response) {
  //     if (response.ok) {
  //       response.blob().then(function (blob) {
  //         var objectURL = URL.createObjectURL(blob);
  //         showProduct(objectURL, product);
  //       });
  //     } else {
  //       console.log('Network request for "' + product.name + '" image failed with response ' + response.status + ': ' + response.statusText);
  //     }
  //   });
  // }

  //La fonction showProduit permet d'afficher les produits de la liste dans le main
  //Créer des éléments qui permettent l'affichage et les lier avec les attributs des produits 
  //Ajouter ces éléments à la page 
  function showProduit(produit) {
    var section = document.createElement('section');
    var heading = document.createElement('h2');
    var para = document.createElement('p');
    var image = document.createElement('img');
    section.setAttribute('class', produit.type);
    heading.textContent = produit.nom.replace(produit.nom.charAt(0), produit.nom.charAt(0).toUpperCase());
    para.textContent = '$' + produit.prix.toFixed(2);
    image.src = "images/" + produit.image; 
    image.alt = produit.nom;
    main.appendChild(section);
    section.appendChild(heading);
    section.appendChild(para);
    section.appendChild(image);
  }
}
