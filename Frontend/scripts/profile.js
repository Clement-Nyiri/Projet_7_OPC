// Page profil site groupomania \\
function getWithExpiry(key) {
    const itemStr = localStorage.getItem(key)
    // if the item doesn't exist, return null
    if (!itemStr) {
        window.alert("Veuillez vous connecter !");
        window.location.replace("login.html");
    } else {
    const item = JSON.parse(itemStr)
    const now = new Date()
    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
        // If the item is expired, delete the item from storage
        // and return null
        localStorage.removeItem(key);
        window.alert("Votre session a expiré !");
        window.location.replace("login.html");
    }}
};
var recupTokenFromLS = getWithExpiry("snToken");


// Recup du userId and de ses droits d'admin
var tokenWithExpiry = localStorage.getItem("snToken");
var indiceDebut = tokenWithExpiry.indexOf('":"');
var indiceFin = tokenWithExpiry.indexOf('","');
var tokenRequete = tokenWithExpiry.substring(indiceDebut+3, indiceFin);

var aEnvoyer = {
    "token": tokenRequete,
}

var getCurrentUser = fetch("http://localhost:3000/api/user/", {
    method: "POST",
    body: JSON.stringify(aEnvoyer),
    headers: {
        "Content-Type":"application/json",
        "Authorization": 'Bearer '+tokenRequete+''
    }
});

getCurrentUser
.then(async (res)=>{
    const responseUser = await res.json();

    // Recup chaine de l'id dans l'URL
    const queryStringUrlId = window.location.search;

    //extraire l'id
    const idPage = queryStringUrlId.slice(1);

    var nav = document.getElementById("barreNav");
    var displayProfile = document.createElement("div");
    displayProfile.classList.add("col-1");
    displayProfile.classList.add("my-auto");
    displayProfile.classList.add("text-center");
    displayProfile.classList.add("monProfil");
    displayProfile.innerHTML= '<a href="profile.html?/'+responseUser.userId+'">Mon profil</a>';
    nav.appendChild(displayProfile);

    var displayDisconnect = document.createElement("div");
    displayDisconnect.classList.add("col-1");
    displayDisconnect.classList.add("my-auto");
    displayDisconnect.classList.add("text-center");
    displayDisconnect.classList.add("disconnect");
    displayDisconnect.innerHTML='<i class="fas fa-power-off"></i>';
    nav.appendChild(displayDisconnect);

    const disconnect = document.getElementsByClassName("disconnect")[0];
    disconnect.addEventListener("click", (e)=>{
        e.preventDefault();
        localStorage.clear();
        window.location.replace("login.html");
    });

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
            <div id="profilePicture" class="col-6 mt-3 align-items-center">\
                <div>\
                <h4 class="text-center">Photo de profil</h4>\
                <img src="'+this.profile_picture+'" class="rounded-top" id="profile_picture"/>\
                </div>\
                <input type="file" class="ml-4" name="image" id="updateProfilePicture">\
                <button type="submit" class="btn btn-primary rounded-bottom ml-4" id="profilePictureChange">Changer ma photo de profil</button>\
            </div>\
            <div id="email_desc" class="mt-3 col-6 text-center d-flex flex-column justify-content-center">\
                <h4 class="mx-auto">Email</h4>\
                <p class="mx-auto">'+this.email+'</p>\
                <h4 class="mt-5 mx-auto">Description</h4>\
                <p id="description" class="mx-auto">'+this.description+'</p>\
                <textarea id="newDescription" name="newDescription" class="w-50 mx-auto mb-2" placeholder="Nouvelle description ici"></textarea>\
                <button id="updateDescription" class="btn btn-primary mx-auto rounded">Changer ma description</button>\
            </div>\
            <button id="deleteAccount" class="mt-5 mb-2 btn btn-danger mx-auto rounded">Supprimer mon compte</button>\
            </article>';
            location.appendChild(displayProfile);

            if(this.description == null) {
                var desc = document.getElementById("description");
                desc.innerText = "Ce profil n'a pas de description";
            }

            var newIdPage = idPage.slice(1);

            function rendreInvisible(buttonName){
                var turnInvisible = document.getElementById(buttonName);
                turnInvisible.classList.add("d-none");
            }
            if(responseUser.userId !=newIdPage && responseUser.admin != 1){
                rendreInvisible("deleteAccount");
                rendreInvisible("newDescription");
                rendreInvisible("updateDescription");
            }
            if (responseUser.userId !=newIdPage){
                rendreInvisible("profilePictureChange");
                rendreInvisible("updateProfilePicture");
            }

        }
    };

    const profilUtilisateur = fetch("http://localhost:3000/api/user"+idPage,{
        method: "GET",
        headers: {
            "Content-Type":"application/json",
            "Authorization": 'Bearer '+tokenRequete+''
        }
    });
    profilUtilisateur
    .then(async (res)=>{
        try{
            if(res.status == 404){
                window.alert("Cet utilisateur est introuvable");
                window.location.replace("index.html");
            } else {
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
                        "Content-Type":"application/json",
                        "Authorization": 'Bearer '+tokenRequete+''
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
                var suppressionAccount = fetch('http://localhost:3000/api/user'+idPage+'', {
                    method: "DELETE",
                    headers : {
                        "Content-Type":"application/json",
                        "Authorization": 'Bearer '+tokenRequete+''
                    }
                });
                suppressionAccount
                .then(async (res)=>{
                    const response = await res.json();
                    if(responseUser.admin == 1){
                        window.alert("Cet utilisateur a bien été supprimé");
                        window.location.replace("index.html");
                    } else{
                        localStorage.clear();
                        //window.location.replace("inscription.html");
                    }
                })
                .catch(function(err){
                    console.log(err);
                })
            })

            // Ajout de la fonction de changement de profile picture
            var btnImage = document.getElementById("profilePictureChange");
            var newProfilePicture = document.getElementById("updateProfilePicture");
            const formData = new FormData();

            const options =  {
                method: "PUT",
                body: formData,
                headers : {
                    "Authorization": 'Bearer '+tokenRequete+''
                }
            };
            delete options.headers['Content-Type'];
            
            
            btnImage.addEventListener('click', (h)=>{
                h.preventDefault;
                //on récupère ce dont on a besoin pour l'update
                formData.append('image', newProfilePicture.files[0])
                var connectPicture = fetch('http://localhost:3000/api/user'+idPage+'/picture', options)
                connectPicture
                .then(async (res) =>{
                    const response = await res.json();
                })
                .catch(function(err){
                    console.log(err);
                })
            })


        }} catch(e) {
            console.log(e);
        }
    })
    .catch(function(err){
        console.log(err);
    });
});

