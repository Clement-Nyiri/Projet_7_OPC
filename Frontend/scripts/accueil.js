// page d'accueil Groupomania \\

class Publication {
    constructor(id, user_id, profile_picture, name, content, date){
        this.id = id;
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
        <p id="date_publi">'+this.date+'</p>\
        <div class="mt-3 mb-3"><h3><a href="post.html?/'+this.id+'">'+this.content+'</a></h3></div>\
        <div id="likes'+this.id+'"></div>\
        <div id="comments'+this.id+'" class="bg-secondary"></div>\
        <input type="text" class="w-75 mt-2 mb-2" id="addComment" value="Ajouter un commentaire"></input>';
        singlePost.appendChild(displayPost);
    }
};

class Comment{
    constructor(profile_picture, id_post, id_user, content, date, username){
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
        <h6 class="mt-2 ml-5">'+this.content+'</h6>';
        location.appendChild(displayComment);
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
            var newPublication = new Publication(realResponse[i].id, realResponse[i].user_id, realResponse[i].profile_picture, realResponse[i].name, realResponse[i].content, realResponse[i].date);
            Post.push(newPublication);
            var likesOfPost = fetch("http://localhost:3000/api/like/"+realResponse[i].id);
            likesOfPost
            .then(async (res)=>{
                try{
                    const responseLikes = await res.json();
                    let like_number = responseLikes.nombre_de_likes;
                    let id_post = responseLikes.postId;
                    var text = document.getElementById(`likes${id_post}`);
                    var textInside = document.createElement("p");
                    textInside.innerHTML=`<button class="rounded border border-dark bg-warning text-white">J'aime</button>\
                    ${like_number} personne(s) ont aimé cette publication`;
                    text.appendChild(textInside);
                } catch(e){
                    console.log(e);
                }
            })
            var commentsOfPost = fetch("http://localhost:3000/api/comment/"+realResponse[i].id);
            commentsOfPost
            .then(async (res)=>{
                try{
                    const responseComments = await res.json();
                    postId = responseComments.postId;
                    var Commentaires = responseComments.comments;
                    for (j=0; j<Commentaires.length; j++){
                    newComment = new Comment(Commentaires[j].profile_picture, postId, Commentaires[j].id_user, Commentaires[j].content, Commentaires[j].jolie_date, Commentaires[j].username);
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