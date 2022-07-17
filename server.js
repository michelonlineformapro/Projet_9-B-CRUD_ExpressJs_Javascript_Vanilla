//Appel du framework express
const express = require('express');
//Instance d'express = new Express()
const app = express();
//Configure CORS
const cors = require('cors');
//Appel des modules de node
const path = require('path')
const hote = "127.0.0.1";
//Le port d'ecoute
const port = 3000;
const fs = require('fs')
//Appel des données = livres.json est un objet donc {}
const livres = require('./livres.json');

const bodyParser = require('body-parser')

app.use(express.json());
app.use(express.urlencoded({
    extended: true
  }));


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: false
}));



//Autoriser CORS
app.use(cors());


//Route de base GET localhost:3000
app.get('/livres', (request, response) => {
    response.sendFile(path.join(__dirname,'/','./livres.json'))
});

//Details GET localhost:3000/:id
app.get('/livres/:id', (request, response) => {
    const id = Number(request.params.id);
    const detailsLivre =  livres.find(detailsLivre => detailsLivre.id === id)
    if(!detailsLivre){
        return response.status(404).send('Aucun produit touvé !');
    }
    response.json(detailsLivre);
});

//Poster POST des produits localhost:3000/
app.post('/livres/',(request, response) => {
    let ajouterLivre = {
        id: livres.length + 1,
        nomLivre: request.body.nomLivre,
        descriptionLivre: request.body.descriptionLivre,
        prixLivre: request.body.prixLivre,
        imageLivre: request.body.imageLivre
    }

    console.log(ajouterLivre.nomLivre)
    livres.push(ajouterLivre)
    response.status(201).json(ajouterLivre);

    saveLivresChange(livres);
    console.log(request.body)
    console.log(ajouterLivre)
});

//Editer PUT - PATCH produit  localhost:3000/:id
app.put('/livres/:id', (request, response) => {
    const id = Number(request.params.id)
    const index = livres.findIndex(produit => produit.id === id)
    if(index === -1){
        return response.status(404).send('Aucun produit trouvé !');
    }
    const mettreJourProduit = {
        id: livres[index].id,
        nomLivre: request.body.nomLivre,
        descriptionLivre: request.body.descriptionLivre,
        prixLivre: request.body.prixLivre,
        imageLivre: request.body.imageLivre
    }
    livres[index] = mettreJourProduit;
    response.status(200).json('Le produit à été mis a jour');
    saveLivresChange(livres);
});

//Supprimer DELETE un produit localhost:3000/:id
app.delete('/supprimer-livres/:id', (request, response) => {
    const id = Number(request.params.id)
    const index = livres.findIndex(livre => livre.id === id)
    if (index === -1) {
        return response.status(404).send('Product not found')
    }
    livres.splice(index,1)
    response.status(200).json('Livres supprimer !')
    saveLivresChange(livres);
    console.log(livres)
})

const saveLivresChange = (livres) => {
    const livresObjetToString = JSON.stringify(livres);
    fs.writeFileSync('./livres.json', livresObjetToString)
}

/*TESTER LE TOUS AVEC POSTMAN*/

app.listen(port, () => {
    console.log(`Le serveur tourne sur l'adresse http://${hote}:${port}`)
})