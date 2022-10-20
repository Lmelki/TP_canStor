//premier affichage
addDonnee();


//sur le click
document.querySelector('button').addEventListener(
  'click', function (event) {event.preventDefault(); addDonnee();});
// //créer event pour autocomplete
// document.getElementById('searchTerm').addEventListener('keyup', function(event){autocompleteMatch(event)});
  
// function autocompleteMatch(event) {
//     var input = event.target;//recuperation de l'element input
//     var saisie = input.value;//recuperation de la saisie
//     var min_characters = 1;// minimum de caractères de la saisie
//     if (!isNaN(saisie) || saisie.length < min_characters ) { 
//       return [];
//     }
//     traiterReponse(saisie);
//   }
//   fetch('produits.json')
//   .then(response => response.json()) // Obtention de la réponse
//   .then(response => search_terms = response) // Transfert de la base de donnée dans la liste qui servira à chercher la correspondance
//   .catch(error => console.log("Erreur : " + error));
//   function traiterReponse(,saisie)
//   {
//     var listeValeurs = document.getElementById('searchTerm');
//     listeValeurs.innerHTML = "";
//     var reg = new RegExp(saisie,"i");//optioin i insensible à la casse
//     let terms = data.filter(term => term.match(reg));
//         for (i=0; i<terms.length; i++) {
//           var option = document.createElement('option');
//                       option.value = terms[i];
//                       searchTerm.appendChild(option);
//   }}
//recup données
function addDonnee() {
  fetch('produits.json').then(function (response) {
    if (response.ok) {
      response.json().then(function (json) {
        triage(json);//lancement asynchrone !!
      });
    } else {
      console.log('Network request for products.json failed with response ' + response.status + ': ' + response.statusText);
    }
  });
}

//triage
function triage(products) {
  var valeur = { 0: "tous", 1: "legumes", 2: "soupe", 3: "viande" }
  var type = valeur[document.forms[0].categorie.value];
  var nutri = document.forms[0].nutri.value;
  var lowerCaseSearchTerm = document.querySelector('#searchTerm').value.trim().toLowerCase();

  var finalGroup = [];

  products.forEach(product => {
    if (product.type === type || type === 'tous') {//sur la categorie
      if (product.nutriscore === nutri || nutri === '0') {//sur le nutri
        if (product.nom.toLowerCase().indexOf(lowerCaseSearchTerm) !== -1 || lowerCaseSearchTerm === '') {//sur le searchterm
          finalGroup.push(product);
        }
      }
    }
  });

  showProduct( affichageAleatoire(finalGroup));
}

//Affichage
function showProduct(finalGroup) {

  var main = document.querySelector('main');
  //vidage
  while (main.firstChild) {
    main.removeChild(main.firstChild);
  }
  // affichage propduits
  if (finalGroup.length === 0) {
    var para = document.createElement('p');
    para.textContent = 'Aucun résultats';
    main.appendChild(para);
  }
  else {
    finalGroup.forEach(product => {
      var section = document.createElement('div');
      section.setAttribute('class', product.type);
      section.classList.add("card");
      section.classList.add("text-center");
      section.classList.add("bg-info");
      section.classList.add("p-5");
      var heading = document.createElement('div');
      heading.textContent = product.nom.replace(product.nom.charAt(0), product.nom.charAt(0).toUpperCase());
      heading.className = 'card-title'; 
      var foot = document.createElement('div');
      foot.className = 'card-footer text-muted';
      // foot.classList.add("bg-warning");
      var para = document.createElement('p');
      para.classList.add("text-danger");
      para.textContent = product.prix.toFixed(2) +"€";
      var nutri = document.createElement('span');
      nutri.setAttribute('class', "text-black")
      nutri.classList.add('bg-green')
      nutri.textContent = product.nutriscore;
      var image = document.createElement('img');
      image.className = 'card-img-top'; 
      image.src = "images/" + product.image;
      image.alt = product.nom;
      
      section.appendChild(heading);
      section.appendChild(foot);
      foot.appendChild(para);
      foot.appendChild(nutri);
      section.appendChild(image);
      main.appendChild(section);
    });
   
  }
}
function affichageAleatoire(arr){
  for(var i = arr.length-1 ; i>0 ;i--){
      var j = Math.floor( Math.random() * (i + 1) );
      [arr[i],arr[j]]=[arr[j],arr[i]];
  }
return arr;}