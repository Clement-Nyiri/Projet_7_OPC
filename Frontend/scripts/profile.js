// Page profil site groupomania \\

// Recup chaine de l'id dans l'URL
const queryStringUrlId = window.location.search;

//extraire l'id
const idPage = queryStringUrlId.slice(1);

class Profile {
    constructor (id, name, email, description, profile_picture){
        this.id = id;
        this.name = name;
        this.email = email;
        this.description = description;
        this.profile_picture = profile_picture;
        this.createProfile();
    }
    createProfile(){
        var displayProfile = document.createElement("div");
        var location = document.getElementById('userProfile');
        //HTML à ajouter dans la page
        displayProfile.innerHTML = '<h4 class="mt-4 text-center font-weight-bold">'+this.name+'</h4>\
        <article>\
        <div id="profilePicture" class="col-6 mt-3">\
            <h4 class="text-center">Photo de profil</h4>\
            <img src="'+this.image+'" alt="photo_profil" class="rounded-top"/>\
            <button id="updateProfilePicture" class="btn-primary rounded-bottom">Changer ma photo de profil</button>\
        </div>\
        <div id="email" class="mt-3 col-6 text-center d-flex flex-column justify-content-center">\
            <h4 class="mx-auto">Email</h4>\
            <p class="mx-auto">'+this.email+'</p>\
            <h4 class="mt-5 mx-auto">Description</h4>\
            <p class="mx-auto">'+this.description+'</p>\
            <textarea id="newDescription" name="newDescription" class="w-50 mx-auto mb-2">Nouvelle description ici</textarea>\
            <button id="updateDescription" class="btn-primary w-50 mx-auto">Changer ma description</button>\
        </div>\
        <button id="deleteAccount" class="mt-5 mb-2 btn-danger mx-auto rounded">Supprimer mon compte</button>\
        </article>';
        location.appendChild(displayProfile);
    }
};

const profilUtilisateur = fetch("http://localhost:3000/api/user"+idPage);
profilUtilisateur
.then(async (res)=>{
    try{
        const response = await res.json();
            thisProfile = new Profile(response.id, response.username,response.email, response.description, response.profile_picture);
    } catch(e) {
        console.log(e);
    }
})
.catch(function(err){
    console.log(err);
});