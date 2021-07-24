// Page publication solo site groupomania \\

// Recup chaine de l'id dans l'URL
const queryStringUrlId = window.location.search;

//extraire l'id
const idPage = queryStringUrlId.slice(1);

// On déclare la classe Publication
class Publication {
    constructor(user_id, profile_picture, name, content, date){
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
        displayPost.innerHTML = '<h4 class="d-inline"><img src="'+this.profile_picture+'"/><a href="profile.html?/'+this.user_id+'">'+this.name+'</a></h4>\
        <p id="date_publi" class="d-inline">'+this.date+'</p>\
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
                headers : {
                    "Content-Type":"application/json"
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
    }
};

//On déclare le class Comment
class Comment{
    constructor(profile_picture, id_user, content, date, username){
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
        <p class="d-inline ml-5">'+this.date+'</p>\
        <h6 class="mt-3">'+this.content+'</h6>';
        location.appendChild(displayComment);
    }
};

//On va chercher les publications dans la BDD
const postToDisplay = fetch("http://localhost:3000/api/post"+idPage);
postToDisplay
.then(async (res)=>{
    try{
        const response = await res.json();
        thisPost = new Publication(response.user_id, response.profile_picture, response.name, response.content, response.date);

        //On va chercher les likes dans la BDD (asynchronception)
        var likes = fetch("http://localhost:3000/api/like"+idPage);
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
                            headers : {
                            "Content-Type":"application/json"
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
        var comments = fetch("http://localhost:3000/api/comment"+idPage);
        comments
            .then(async (res)=>{
                try{
                    const response = await res.json();
                    const response2 = response.comments;
                    for(i=0; i<response2.length; i++){
                        var newComment = new Comment (response2[i].profile_picture, response2[i].id_user, response2[i].content, response2[i].jolie_date, response2[i].username);
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





