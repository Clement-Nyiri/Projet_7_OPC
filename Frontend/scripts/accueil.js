// page d'accueil Groupomania \\

// Redirection si user non connecté
var idUserLocal = localStorage.getItem("id_user");
console.log(idUserLocal);
if (idUserLocal == null || idUserLocal == undefined){
    window.alert("Veuillez vous connecter pour accéder à cette page");
    document.location.href="login.html";
}

class Publication {
    constructor(id, image_url, user_id, profile_picture, name, content, date){
        this.id = id;
        this.image_url= image_url;
        this.user_id = user_id;
        this.profile_picture = profile_picture;
        this.name = name;
        this.content = content;
        this.date = date;
        this.createPost();
    }
    createPost(){
        var displayPost = document.createElement("div");
        displayPost.classList.add("mb-5");
        displayPost.classList.add("bg-white");
        displayPost.classList.add("shadow");
        displayPost.classList.add("rounded");
        var singlePost = document.getElementById("filActu");
        displayPost.innerHTML = '<h4><img src="'+this.profile_picture+'"/><a href="profile.html?/'+this.user_id+'" class="mr-3">'+this.name+'</a></h4>\
        <button class="btn btn-danger suppPost" id="deletePost'+this.id+'"><i class="fas fa-trash"></i></button>\
        <p id="date_publi">'+this.date+'</p>\
        <div class="mt-3 mb-3"><h3><a href="post.html?/'+this.id+'">'+this.content+'</a></h3></div>\
        <div id="imagePubli" class="w-100"><img src="'+this.image_url+'"/></div>\
        <div id="likes'+this.id+'"></div>\
        <div id="comments'+this.id+'" class="bg-secondary"></div>\
        <input type="text" class="w-75 mt-2 mb-2 ajoutComment" id="addComment'+this.id+'" placeholder="Ajouter un commentaire"></input>\
        <button type="submit" class="btn btn-warning envoiComment" id="sendComment'+this.id+'">Envoyer</button>';
        singlePost.appendChild(displayPost);

        // Si la publication n'a pas d'image    
        if (this.image_url == ''){
            var imageAAfficher = document.getElementById("imagePubli");
            imageAAfficher.classList.add("d-none");
        }
        
        //Creation de l'event d'ajout de commentaire
        const postComment = document.getElementById('sendComment'+this.id+'');
        postComment.addEventListener("click", (e)=>{
            e.preventDefault();
            //Recupération des valeurs du formulaire rempli + création d'un objet avec
            const Commentaire = {
                "userId": localStorage.getItem("id_user"),
                "content": document.getElementById('addComment'+this.id+'').value,
                "postId": this.id
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

            const supprimePost = document.getElementById('deletePost'+this.id+'');
            supprimePost.addEventListener('click', (f)=>{
                var connectDeletePost = fetch('http://localhost:3000/api/post/'+this.id+'', {
                    method: "DELETE",
                    headers : {
                        "Content-Type":"application/json"
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
        var isAdmin = localStorage.getItem("admin");
        var idLocalStorage = localStorage.getItem("id_user");
        if(idLocalStorage != this.user_id && isAdmin != 1){
            var boutonSupp = document.getElementById('deletePost'+this.id+'');
            boutonSupp.classList.add("d-none");
        }


    }
};

class Comment{
    constructor(id_comment, profile_picture, id_post, id_user, content, date, username){
        this.id_comment = id_comment;
        this.profile_picture = profile_picture;
        this.id_post = id_post;
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
        var location = document.getElementById(`comments${this.id_post}`);
        displayComment.innerHTML = '<h4 class="mt-2 d-inline"><img src="'+this.profile_picture+'" /><a href="profile.html?/'+this.id_user+'">'+this.username+'</a></h4>\
        <p class="d-inline">'+this.date+'</p>\
        <button class="btn btn-danger btn-sm suppComment" id="deleteComment'+this.id_comment+'"><i class="fas fa-trash"></i></button>\
        <h6 class="mt-2 ml-5">'+this.content+'</h6>';
        location.appendChild(displayComment);

        //Suppression de commentaire
        var btnDeleteComment = document.getElementById('deleteComment'+this.id_comment+'');
        btnDeleteComment.addEventListener('click', (g)=>{
            var connectDeletePost = fetch('http://localhost:3000/api/comment/'+this.id_comment+'', {
                method: "DELETE",
                headers : {
                    "Content-Type":"application/json"
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
        var isAdmin = localStorage.getItem("admin");
        var idLocalStorage = localStorage.getItem("id_user");
        if(idLocalStorage != this.id_user && isAdmin != 1){
            var boutonSupp = document.getElementById('deleteComment'+this.id_comment+'');
            boutonSupp.classList.add("d-none");
        }
    }
};

var Post = [];

var PostToDisplay = fetch("http://localhost:3000/api/post/");
PostToDisplay
.then(async (res)=>{
    try{
        const response = await res.json();
        const realResponse = response.results;
        for (i=0; i<realResponse.length; i++){
            var newPublication = new Publication(realResponse[i].id, realResponse[i].image_url, realResponse[i].user_id, realResponse[i].profile_picture, realResponse[i].name, realResponse[i].content, realResponse[i].date);
            Post.push(newPublication);

            
            //On va chercher les likes
            var likesOfPost = fetch("http://localhost:3000/api/like/"+realResponse[i].id);
            likesOfPost
            .then(async (res)=>{
                try{
                    const responseLikes = await res.json();
                    let like_number = responseLikes.nombre_de_likes;
                    let id_post = responseLikes.postId;
                    var text = document.getElementById(`likes${id_post}`);
                    var textInside = document.createElement("p");
                    textInside.innerHTML=`<button class="rounded border border-dark bg-warning text-white" id="ajoutLike${id_post}">J'aime</button>\
                    ${like_number} personne(s) ont aimé cette publication`;
                    text.appendChild(textInside);

                    //On ajoute l'event listener de l'ajout de like ici pour suivre l'asynchrone
                    const btnLike = document.getElementById(`ajoutLike${id_post}`);
                    btnLike.addEventListener('click', (e)=>{
                        e.preventDefault;
                        //On récupère les données nécessaires pour l'ajout de like
                        const Like = {
                            "userId" : localStorage.getItem("id_user"),
                            "postId" : id_post
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
                            var didLike = document.getElementById(`ajoutLike${id_post}`);
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

            // On va chercher les commentaires
            var commentsOfPost = fetch("http://localhost:3000/api/comment/"+realResponse[i].id);
            commentsOfPost
            .then(async (res)=>{
                try{
                    const responseComments = await res.json();
                    postId = responseComments.postId;
                    var Commentaires = responseComments.comments;
                    for (j=0; j<Commentaires.length; j++){
                    newComment = new Comment(Commentaires[j].id_comment, Commentaires[j].profile_picture, postId, Commentaires[j].id_user, Commentaires[j].content, Commentaires[j].jolie_date, Commentaires[j].username);
                    }
                } catch(e){
                    console.log(e);
                }
            })
        }

    } catch(e){
        console.log(e);
    }
})
.catch(function(err){
    console.log(err);
});

// Post new Publi \\

var newPubli = document.getElementById("publishNewPost");
var contentNewPubli = document.getElementById("contentNewPost");
var imageNewPubli = document.getElementById("imageNewPost");
    newPubli.addEventListener('click', (e)=>{
        e.preventDefault;
        //On récupère les données nécessaires pour l'ajout de like
        const Publi = {
            "userId" : localStorage.getItem("id_user"),
            "content" : contentNewPubli.value,
            "imageUrl" : imageNewPubli.value
        };
        var connectPost = fetch("http://localhost:3000/api/post/", {
            method: "POST",
            body: JSON.stringify(Publi),
            headers : {
            "Content-Type":"application/json"
            }
        })
        connectPost
        .then(async (res) =>{
            const response = await res.json();
            window.alert(response.message);
            document.location.reload();
            imageNewPubli.value = null;
            contentNewPubli.value = null;
        })
        .catch(function(err){
            console.log(err);
        })
    });