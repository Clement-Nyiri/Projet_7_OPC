// Page profil site groupomania \\

// Redirection si user non connecté
var idUserLocal = localStorage.getItem("id_user");
console.log(idUserLocal);
if (idUserLocal == null){
    window.alert("Veuillez vous connecter pour accéder à cette page");
    document.location.href="login.html";
}

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
        displayProfile.classList.add("mb-4");
        var location = document.getElementById('userProfile');
        //HTML à ajouter dans la page
        displayProfile.innerHTML = '<h4 class="mt-4 text-center font-weight-bold">'+this.name+'</h4>\
        <article>\
        <div id="profilePicture" class="col-6 mt-3">\
            <h4 class="text-center">Photo de profil</h4>\
            <img src="'+this.image+'" class="rounded-top"/>\
            <input type="file"  id="updateProfilePicture"></input>\
            <button class="d-inline btn btn-primary rounded-bottom" id="profilePictureChange">Changer ma photo de profil</button>\
        </div>\
        <div id="email_desc" class="mt-3 col-6 text-center d-flex flex-column justify-content-center">\
            <h4 class="mx-auto">Email</h4>\
            <p class="mx-auto">'+this.email+'</p>\
            <h4 class="mt-5 mx-auto">Description</h4>\
            <p id="description" class="mx-auto">'+this.description+'</p>\
            <textarea id="newDescription" name="newDescription" class="w-50 mx-auto mb-2" placeholder="Nouvelle description ici"></textarea>\
            <button id="updateDescription" class="btn-primary w-50 mx-auto">Changer ma description</button>\
        </div>\
        <button id="deleteAccount" class="mt-5 mb-2 btn-danger mx-auto rounded">Supprimer mon compte</button>\
        </article>';
        location.appendChild(displayProfile);

        if(this.description == null) {
            var desc = document.getElementById("description");
            desc.innerText = "Ce profil n'a pas de description";
        }

        var isAdmin = localStorage.getItem("admin");
        var idLocalStorage = localStorage.getItem("id_user");
        var newIdPage = idPage.slice(1);
        function rendreInvisible(buttonName){
            var turnInvisible = document.getElementById(buttonName);
            turnInvisible.classList.add("d-none");
        }
        console.log(isAdmin);
        if(idLocalStorage !=newIdPage && isAdmin != 1){
            rendreInvisible("deleteAccount");
            rendreInvisible("newDescription");
            rendreInvisible("updateDescription");
            rendreInvisible("profilePictureChange");
        }

    }
};

const profilUtilisateur = fetch("http://localhost:3000/api/user"+idPage);
profilUtilisateur
.then(async (res)=>{
    try{
        const response = await res.json();
        thisProfile = new Profile(response.id, response.username,response.email, response.description, response.profile_picture);

        // Ajout de la fonction de modification de description
        var btnDesc = document.getElementById("updateDescription");
        var nouvelleDesc = document.getElementById("newDescription");
        btnDesc.addEventListener('click', (e)=>{
            e.preventDefault;
            //On va chercher la nouvelle description
            const newDesc = {"description": nouvelleDesc.value};
            var connectDescription = fetch('http://localhost:3000/api/user/'+idPage+'/description', {
                method : "PUT",
                body : JSON.stringify(newDesc),
                headers : {
                    "Content-Type":"application/json"
                    }
            })
            connectDescription
            .then(async (res) =>{
                const response = await res.json();
                window.alert(response.message);
                document.location.reload();
            })
            .catch(function(err){
                console.log(err);
            })
        })

        //Ajout de la fonction de suppression de compte
        var btnDelete = document.getElementById("deleteAccount");
        btnDelete.addEventListener("click", (f)=>{
            f.preventDefault;
            // on récupère ce dont on a besoin pour la suppression
            var suppressionAccount = fetch('http://localhost:3000/api/user/'+idPage+'', {
                method: "DELETE",
                headers : {
                    "Content-Type":"application/json"
                }
            });
            suppressionAccount
            .then(async (res)=>{
                const response = await res.json();
                window.location.replace("accueil.html");
            })
            .catch(function(err){
                console.log(err);
            })
        })

        // Ajout de la fonction de changement de profile picture
        var btnImage = document.getElementById("profilePictureChange");
        var newProfilePicture = document.getElementById("updateProfilePicture");
        btnImage.addEventListener('click', (h)=>{
            h.preventDefault;
            //on récupère ce dont on a besoin pour l'update
            const newPicture = {"imageUrl": newProfilePicture.value};
            console.log(JSON.stringify(newPicture));
            var connectPicture = fetch('http://localhost:3000/api/user'+idPage+'/picture', {
                method: "PUT",
                body: JSON.stringify(newPicture),
                headers : {
                    "Content-Type":"application/json"
                }
            })
            connectPicture
            .then(async (res) =>{
                const response = await res.json();
                window.alert(response.message);
                document.location.reload();
            })
            .catch(function(err){
                console.log(err);
            })
        })


    } catch(e) {
        console.log(e);
    }
})
.catch(function(err){
    console.log(err);
});