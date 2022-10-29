//premier affichage
addDonnee();


//sur le click
document.getElementById('btnReset').addEventListener(
  'click', function (event) {
    event.preventDefault();
    document.forms[0].reset();
    addDonnee();
  });
  
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

document.getElementById('searchTerm').addEventListener("keyup", function(event){autocompleteMatch(event)});

function autocompleteMatch(event) {
  var input = event.target;//recuperation de l'element input
  var saisie = input.value;//recuperation de la saisie
  var min_characters = 1;// minimum de caractères de la saisie
  if (!isNaN(saisie) || saisie.length < min_characters ) { 
    return [];
  }
  fetch('produits.json').then(function (response) {
    if (response.ok) {
      response.json().then(function (json) {
        traiterReponse(json,saisie);
       //lancement asynchrone !!
      });
    } else {
      console.log('Network request for products.json failed with response ' + response.status + ': ' + response.statusText);
    }
  });
}

function traiterReponse(data,saisie)
{
var listeValeurs = document.getElementById('listeValeurs');
listeValeurs.innerHTML="";//mise à blanc des options
var reg = new RegExp(saisie, "i");//Ajout de la condition "i" sur le regexp 
let terms = data.filter(term => term.nom.match(reg));//recup des termes qui match avec la saisie
    for (i=0; i<terms.length; i++) {//création des options
      var option = document.createElement('option');
                  option.value = terms[i].nom;
                  listeValeurs.appendChild(option);
}
  }
//Autocomplétion dynamique directe
document.forms[0].categorie.addEventListener("change", function() {
  addDonnee();
});
document.forms[0].nutri.addEventListener("change", function() {
    addDonnee();
});
document.forms[0].searchTerm.addEventListener("change", function() {
      addDonnee();
});
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
      // section.classList.add("card");
      section.classList.add("text-center");
      section.classList.add("bg-primary");
      section.classList.add("bg-opacity-25");
      section.classList.add("p-5");
      // section.classList.add("mb-4");
      // section.classList.add("mt-4");
      var heading = document.createElement('div');
      heading.textContent = product.nom.replace(product.nom.charAt(0), product.nom.charAt(0).toUpperCase());
      // heading.setAttribute("class", "titre")
      var foot = document.createElement('div');
      foot.className = 'card-footer text-muted';
      var para = document.createElement('p');
      para.textContent = product.prix.toFixed(2) +"€";
      para.setAttribute("class", "h5 text-danger p-2")
      var nutri = document.createElement('span');
      nutri.setAttribute('class', "d-inline rounded-pill p-2")
      nutri.textContent = product.nutriscore;
      switch (nutri.textContent) {
        case 'A':
          nutri.classList.add('nutriA');
          break;
        case 'B':
          nutri.classList.add('nutriB');
          break;
        case 'C':
          nutri.classList.add('nutriC');
          break;
          case 'D':
            nutri.classList.add('nutriD');
            break;
          case 'E':
            nutri.classList.add('nutriE');
            break;
        default:
          nutri.classList.add('nutriF'); 
      }
      
      var image = document.createElement('img');
      image.className = 'card-img-top';
      image.classList.add("mt-3")
      image.classList.add("rounded-4") 
      image.src = "images/" + product.image;
      image.alt = product.nom;
      var button = document.createElement('button');
      button.setAttribute("tyoe", "button");
      button.setAttribute("class", "btn btn-outline-primary mt-3");
      button.textContent='Ajouter au panier';
      var titre = document.createElement('div')
      titre.setAttribute("class", "titre")

      var bloc = document.createElement('div');
      titre.appendChild(heading)
      section.appendChild(titre);
      section.appendChild(foot);
      foot.appendChild(para);
      foot.appendChild(nutri);
      section.appendChild(image);
      section.appendChild(button)
      bloc.appendChild(section)
      main.appendChild(bloc);
    
    });
   
  }
}
function affichageAleatoire(arr){
  for(var i = arr.length-1 ; i>0 ;i--){
      var j = Math.floor( Math.random() * (i + 1) );
      [arr[i],arr[j]]=[arr[j],arr[i]];
  }
return arr;}
