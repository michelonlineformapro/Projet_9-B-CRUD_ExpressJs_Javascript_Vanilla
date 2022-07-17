/*
L’évènement DOMContentLoaded est émis lorsque le document HTML initial a été complètement chargé et analysé,
sans attendre que les feuilles de style, images et sous-documents aient terminé de charger.
 */
document.addEventListener('DOMContentLoaded', () => {
    //La <div> html qui va contenir nos produits
    const produitsDIV = document.getElementById("produitsDIV");

    //Afficher - cacher le formulaire ajout de produit
    //le bouton HTML
    const btnAfficherFormulaire = document.getElementById("ajouter-produit");
    btnAfficherFormulaire.addEventListener('click', (event) => {
        event.preventDefault();
        const formulaireAjouterProduit = document.getElementById("formulaire-ajouter-produit");
        formulaireAjouterProduit.classList.toggle("ajouter-produit-show");
    });

    //Valider le formulaire d'ajout
    const btnValiderAjoutLivre = document.getElementById("valider-ajouter-livre");
    btnValiderAjoutLivre.addEventListener('click', (event) => {
        event.preventDefault();
        ajouterUnLivre();
    })

    /*****************AFFICHER LES PRODUITS******************/
    function afficherProduits() {
        
        //Le parcours du fichier  produits.json avec fetch et des promesses
        //Api fetch a besoin d'une URL en paramètre (ici notre server.js)
        fetch('http://localhost:3000/livres/',{
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                return response.json()
            })
            //Ici le json livre est un objet
            .then((livres) => {
                console.log(livres)

                //.map boucle sur un tableau et en creer un nouveau dans un alias
                //On passe un id dynamique a chaque carte col-md-4
                let carteProduit = livres.map((livre) =>
                    `<div class="col-md-4 col-sm-12 mt-3" id="carte-produit-${livre.id}">
                        <div class="card p-3">
                            <h3 class="card-title text-danger">${livre.nomLivre}</h3>
                            
                            <div class="card-img-top">
                            <!--IMAGE = parametre produit de la fonction ajouterProduit(produit) + nom de element a afficher de notre db.json (ici imageProduit)-->
                              <img class="img-fluid card-img p-3" src="${livre.imageLivre}"  alt="${livre.nomLivre}" title="${livre.nomLivre}"/>                          
                            </div>
                            
                            <div class="card-text">                      
                              <p>${livre.descriptionLivre}</p>
                            </div>
                            
                            <div class="card-action">
                              <p class="text-success">Prix : ${livre.prixLivre} €</p> 
                              <a id="details-produit-${livre.id}" class="btn btn-outline-secondary">DETAILS</a>     
                              <a id="supprimer-produit-${livre.id}" class="btn btn-outline-danger">SUPPRIMER</a>  
                              <a id="editer-produit-${livre.id}" class="btn btn-outline-warning">EDITER</a>                                        
                            </div>                
                      </div>
                    </div>`)
                //join('') supprimer chaque virgule entre les objets du tableau
                //On ajoute chaque carte au parent
                produitsDIV.innerHTML = carteProduit.join('');
                //De nouveau une boucle de parcours pour les boutons et recuperer les id dynamique
                livres.map(livre => {
                    //Le bouton des details
                    let btnDetails = document.querySelector(`#details-produit-${livre.id}`);
                    btnDetails.addEventListener("click", (event) => {
                        event.preventDefault()
                        afficherDetailsProduit(livre)
                    });

                    //Le bouton supprimer
                    let btnSupprimer = document.querySelector(`#supprimer-produit-${livre.id}`);
                    btnSupprimer.addEventListener("click", (event) => {
                        event.preventDefault()
                        supprimerProduit(livre)
                    });

                    //Le bouton editer
                    let btnEditer = document.querySelector(`#editer-produit-${livre.id}`);
                    btnEditer.addEventListener("click", (event) => {
                        event.preventDefault()
                        editerProduit(livre)
                    });

                });
            })
            .catch((erreur) => {
                //Si la promesse n'est pas tenue : on retourne une erreur
                console.log("Erreur " + erreur)
            });
    }

    /*************AFFICHER LES DETAILS**************/
    function afficherDetailsProduit(livre) {
        let detailsParent = document.getElementById("detailsProduit");
        const detailsEnfant = document.createElement('div');
        detailsEnfant.className = "container mt-3 w-50 shadow text-center animate__animated animate__slideInLeft"
        produitsDIV.style.display = "none";
        detailsEnfant.innerHTML = `
            <div class="p-5 m-3 bg-white">
                    <h3 class="text-success">DÉTAILS DU PRODUIT</h3>
                    <h1>ID = ${livre.id}</h1> 
                    <h4 class="text-danger">${livre.nomLivre}</h4>
                    <p><img src="${livre.imageLivre}" alt="${livre.nomLivre}" title="${livre.nomLivre}"></p>
                    <p>Description :</p>
                    <p>${livre.descriptionLivre}</p>
                    <p class="text-success fw-bold">Prix : ${livre.prixLivre} €</p>
                    <button id="btnBack" class="btn btn-outline-success">Retour</button>              
                </div>
        `
        detailsParent.append(detailsEnfant);
        document.getElementById("btnBack").addEventListener('click', () => {
            detailsParent.className = "animate__animated animate__slideOutLeft"
            setTimeout(() => {
                window.location.reload()
            },700)
        });

    }

    /************SUPPRIMER UN PRODUIT VIA UNE REQUETE***/
    function supprimerProduit(livre){
        //recuperer id de chaque carte
        const carteProduit = document.querySelector(`#carte-produit-${livre.id}`)
        console.log(carteProduit)
        fetch(`http://localhost:3000/supprimer-livres/${livre.id}`,{
            method: "DELETE"
        })
            .then(response => console.log(response.json()))
            .then(() => {
                carteProduit.remove();
                console.log("le produit est supprimer c ok go")
            })
            .catch(erreur => console.log(erreur))
    }

    /*******************AJOUTER PRODUITS*********/


    function ajouterUnLivre(event) {
        //Recup des champ du formulaire => body de la request http
        //let nouveauProduit = donneesDesFormulaire(event);
        const nomLivre = document.getElementById("nomLivre").value;
        const descriptionLivre = document.getElementById("descriptionLivre").value;
        const prixLivre = document.getElementById("prixLivre").value;
        const imageLivre = document.getElementById("imageLivre").value;
        console.log(nomLivre);
        console.log(descriptionLivre);
        console.log(prixLivre);
        console.log(imageLivre);

        let nouveauLivre = {
                nomLivre: nomLivre,
                descriptionLivre: descriptionLivre,
                prixLivre: prixLivre,
                imageLivre, imageLivre
        }
        
     
        fetch('http://localhost:3000/livres',{
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            /*
            La méthode JSON.stringify() convertit une valeur JavaScript en chaîne JSON.
            Optionnellement, elle peut remplacer des valeurs ou spécifier les propriétés
             à inclure si un tableau de propriétés a été fourni.
            */
            body: JSON.stringify(nouveauLivre), 
        })
            .then(response => response.json())
            .then(() => afficherProduits())
            .then(() => console.log("Le produit a bien été ajouté !"))
            .then(() => {
                const afficherForm = document.getElementById('formulaire-ajouter-produit');
                afficherForm.style.display = "none";
            })
            .catch(erreur => console.log("Erreur ", erreur))

    }

    /*********EDITER UN LIVRE ******************/
    function editerProduit(livre){
        
        //La div html du formulaire d'edition
        const editerContainer = document.getElementById('updateForm');
        const editerFormulaire = document.createElement('form');
        editerFormulaire.setAttribute('method', 'post');
        editerFormulaire.innerHTML = ` 
            <div class="bg-dark p-3" id="editer-form">
                <h3 class="text-danger">EDITER LIVRE</h3>
                <div class="mb-3">
                    <label for="nomLivre" class="form-label">Nom du Livre</label>
                    <input type="text" class="form-control bg-info" id="editNomLivre" name="editNomLivre" placeholder="${livre.nomLivre}">
                </div>
                <div class="mb-3">
                    <label for="descriptionLivre" class="form-label">Description Livre</label>
                    <textarea rows="6" type="password" class="form-control bg-success" id="editDescriptionLivre" name="editDescriptionLivre">${livre.descriptionLivre}</textarea>
                </div>
                <div class="mb-3">
                    <label for="prixLivre" class="form-label">Prix du Livre</label>
                    <input type="number" step="0.01" class="form-control bg-danger" id="editPrixLivre" name="editPrixLivre" placeholder="${livre.prixLivre}">
                </div>
        
                <div class="mb-3">
                    <label for="imageLivre" class="form-label">Image du Livre</label>
                    <input type="text"  class="form-control bg-warning" id="editImageLivre" name="editImageLivre" placeholder="${livre.imageLivre}">
                </div>
        
                <button id="valider-editer-livre" type="submit" class="btn btn-outline-primary">EDITER</button>
                <button type="reset" class="btn btn-outline-warning">VIDER LES CHAMPS</button>
                <button type="submit" class="btn btn-outline-info">ANNULER</button>
            </div>    
        `
        editerContainer.appendChild(editerFormulaire);
        //Le bouton de validation du formulaire d'edition
        const btnValiderEditionForm = document.getElementById('valider-editer-livre');
        produitsDIV.style.display = "none";
       
        btnValiderEditionForm.addEventListener('click', (event) => {
                event.preventDefault();
                
                 //Recup des champ du formulaire => body de la request http
                //let nouveauProduit = donneesDesFormulaire(event);
                const editNomLivre = document.getElementById("editNomLivre").value;
                const editDescriptionLivre = document.getElementById("editDescriptionLivre").value;
                const editPrixLivre = document.getElementById("editPrixLivre").value;
                const editImageLivre = document.getElementById("editImageLivre").value;
                console.log(editNomLivre);
                console.log(editDescriptionLivre);
                console.log(editPrixLivre);
                console.log(editImageLivre);

                let editerLivre = {
                        nomLivre: editNomLivre,
                        descriptionLivre: editDescriptionLivre,
                        prixLivre: editPrixLivre,
                        imageLivre: editImageLivre
                }

                //La requète http methode put
                //Requète HTTP PUT + url/id
                fetch(`http://localhost:3000/livres/${livre.id}`, {
                    method: 'PUT',
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(editerLivre)
                })
                    //Prommesse + reponse de la requète au format json
                    .then(response => response.json())         
                    .then(() => {
                        console.log('reload'),
                        editerContainer.className = "container mt-3 w-50 shadow text-center animate__animated animate__slideOutLeft"
                       
                    })
                    setTimeout(() => {
                        document.location.reload()
                    },500)
                   
                })
                .catch(erreur => "Erreur " + erreur)
    }


    /************APPEL DES FONCTIONS***********/
    afficherProduits();

});