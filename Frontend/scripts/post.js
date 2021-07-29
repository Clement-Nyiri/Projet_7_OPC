// Page publication solo site groupomania \\

//On recup l'ID de l'utilisateur connecté
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
    // Recup chaine de l'id dans l'URL
    const queryStringUrlId = window.location.search;

    //extraire l'id
    const idPage = queryStringUrlId.slice(1);


    // On déclare la classe Publication
    class Publication {
        constructor(image_url, id, user_id, profile_picture, name, content, date){
            this.image_url = image_url;
            this.id = id,
            this.user_id = user_id;
            this.profile_picture = profile_picture;
            this.name = name;
            this.content = content;
            this.date = date;
            this.createPost();
        }
        createPost(){
            var displayPost = document.createElement("div");
            var singlePost = document.getElementById('singlePost');
            displayPost.innerHTML = '<h4><img src="'+this.profile_picture+'"/><a href="profile.html?/'+this.user_id+'">'+this.name+'</a></h4>\
            <button class="btn btn-danger suppPost" id="deletePost'+this.id+'"><i class="fas fa-trash"></i></button>\
            <p id="date_publi">'+this.date+'</p>\
            <div class="mt-3 mb-3"><h2>'+this.content+'</h2></div>\
            <div id="likes" class="mt-3 border-bottom border-dark"></div>\
            <div id="comments" class="bg-secondary mt-4"></div>\
            <input type="text" class="w-75 mt-2 mb-2" id="addComment" placeholder="Ajouter un commentaire"></input>\
            <button type="submit" class="btn btn-warning" id="sendComment">Envoyer</button>';
            singlePost.appendChild(displayPost);

            //On ajoute l'event listener de l'ajout de commentaire ici pour suivre l'asynchrone
            const postComment = document.getElementById("sendComment");
            postComment.addEventListener("click", (e)=>{
                e.preventDefault();
                //Recupération des valeurs du formulaire rempli + création d'un objet avec
                const Commentaire = {
                    "userId": localStorage.getItem("id_user"),
                    "content": document.getElementById("addComment").value,
                    "postId": idPage.slice(1)
                };
                var connectComment = fetch("http://localhost:3000/api/comment/", {
                    method: "POST",
                    body: JSON.stringify(Commentaire),
                    headers: {
                        "Content-Type":"application/json",
                        "Authorization": 'Bearer '+tokenRequete+''
                    }
                })
                connectComment
                    .then(async (res)=>{
                        const response = await res.json();
                        document.location.reload();
                    })
                    .catch(function(err){
                        console.log(err);
                    })
                });

                // Event Listener de suppression de psot
                const supprimePost = document.getElementById('deletePost'+this.id+'');
                supprimePost.addEventListener('click', (f)=>{
                    var connectDeletePost = fetch('http://localhost:3000/api/post/'+this.id+'', {
                        method: "DELETE",
                        headers: {
                            "Content-Type":"application/json",
                            "Authorization": 'Bearer '+tokenRequete+''
                        }
                    })
                    connectDeletePost
                        .then(async (res)=>{
                            const response = await res.json();
                            window.alert("Publication supprimée");
                            window.location.replace("index.html");
                        })
                        .catch(function(err){
                            console.log(err);
                        })
                });
                // droits d'admin/same poster
                var isAdmin = responseUser.admin;
                var idLocalStorage = responseUser.userId;
                if(idLocalStorage != this.user_id && isAdmin != 1){
                    var boutonSupp = document.getElementById('deletePost'+this.id+'');
                    boutonSupp.classList.add("d-none");
                }
        }
    };

    //On déclare le class Comment
    class Comment{
        constructor(id_comment, profile_picture, id_user, content, date, username){
            this.id_comment = id_comment;
            this.profile_picture = profile_picture;
            this.id_user = id_user;
            this.content = content;
            this.date = date;
            this.username = username;
            this.createComment();
        }
        createComment(){
            var displayComment = document.createElement("div");
            displayComment.classList.add("mt-2");
            displayComment.classList.add("border-bottom");
            displayComment.classList.add("border-dark");
            var location = document.getElementById("comments");
            displayComment.innerHTML = '<h5 class="mt-2 d-inline"><img src="'+this.profile_picture+' /><a href="profile.html?/'+this.id_user+'">'+this.username+'</a></h5>\
            <button class="btn btn-danger btn-sm suppComment" id="deleteComment'+this.id_comment+'"><i class="fas fa-trash"></i></button>\
            <p class="d-inline ml-5">'+this.date+'</p>\
            <h6 class="mt-3">'+this.content+'</h6>';
            location.appendChild(displayComment);

            //Suppression de commentaire
            var btnDeleteComment = document.getElementById('deleteComment'+this.id_comment+'');
            btnDeleteComment.addEventListener('click', (g)=>{
                var connectDeletePost = fetch('http://localhost:3000/api/comment/'+this.id_comment+'', {
                    method: "DELETE",
                    headers: {
                        "Content-Type":"application/json",
                        "Authorization": 'Bearer '+tokenRequete+''
                    }
                })
                connectDeletePost
                    .then(async (res)=>{
                        const response = await res.json();
                        document.location.reload();
                    })
                    .catch(function(err){
                        console.log(err);
                    })
            });

            // droits d'admin/same poster
            var isAdmin = responseUser.admin;
            var idLocalStorage = responseUser.userId;
            if(idLocalStorage != this.id_user && isAdmin != 1){
                var boutonSupp = document.getElementById('deleteComment'+this.id_comment+'');
                boutonSupp.classList.add("d-none");
            }
        }
    };

    //On va chercher la publication dans la BDD
    const postToDisplay = fetch("http://localhost:3000/api/post"+idPage,{
        method:"GET",
        headers: {
            "Content-Type":"application/json",
            "Authorization": 'Bearer '+tokenRequete+''
        }
    });
    postToDisplay
    .then(async (res)=>{
        try{
            const response = await res.json();
            thisPost = new Publication(response.image_url, response.id, response.user_id, response.profile_picture, response.name, response.content, response.date);

            //On va chercher les likes dans la BDD (asynchronception)
            var likes = fetch("http://localhost:3000/api/like"+idPage,{
                method:"GET",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization": 'Bearer '+tokenRequete+''
                }
            });
            likes
                .then(async (res)=>{
                    try{
                        const response = await res.json();
                        let like_number = response.nombre_de_likes;
                        var text = document.getElementById("likes");
                        var textInside = document.createElement("p");
                        textInside.innerHTML=`<button class="rounded border border-dark bg-warning text-white" id="ajoutLike"><i id="iconLike" class="far fa-thumbs-up"></i>J'aime</button>\
                        ${like_number} personne(s) ont aimé cette publication`;
                        text.appendChild(textInside);
                        //On ajoute l'event listener de l'ajout de like ici pour suivre l'asynchrone
                        const btnLike = document.getElementById("ajoutLike");
                        btnLike.addEventListener('click', (e)=>{
                            e.preventDefault;
                            //On récupère les données nécessaires pour l'ajout de like
                            const Like = {
                                "userId" : localStorage.getItem("id_user"),
                                "postId" : idPage.slice(1)
                            };
                            var connectLike = fetch("http://localhost:3000/api/like/", {
                                method: "POST",
                                body: JSON.stringify(Like),
                                headers: {
                                    "Content-Type":"application/json",
                                    "Authorization": 'Bearer '+tokenRequete+''
                                }
                            })
                            connectLike
                            .then(async (res) =>{
                                const response = await res.json();
                                var didLike = document.getElementById("ajoutLike");
                                didLike.classList.replace("bg-warning", "bg-success");
                                didLike.classList.replace("text-white", "text-warning");
                            })
                            .catch(function(err){
                                console.log(err);
                            })
                        });
                    } catch(e){
                        console.log(e);
                    }
                })
                .catch(function(err){
                    console.log(err);
                });

            //On va chercher les commentaires dans la BDD (asynchronception x2)
            listComment = [];
            var comments = fetch("http://localhost:3000/api/comment"+idPage,{
                method:"GET",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization": 'Bearer '+tokenRequete+''
                }
            });
            comments
                .then(async (res)=>{
                    try{
                        const response = await res.json();
                        const response2 = response.comments;
                        for(i=0; i<response2.length; i++){
                            var newComment = new Comment (response2[i].id_comment, response2[i].profile_picture, response2[i].id_user, response2[i].content, response2[i].jolie_date, response2[i].username);
                            listComment.push(newComment);
                        }
                    } catch(e){
                        console.log(e);
                    }
                })
                .catch(function(err) {
                    console.log(err);
                });
        } catch(e){
            console.log(e);
        }
    })
    .catch(function(err){
        console.log(err);
    });
})
.catch(function(err){
    console.log(err);
})







