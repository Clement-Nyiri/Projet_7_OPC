// Page publication solo site groupomania \\

// Recup chaine de l'id dans l'URL
const queryStringUrlId = window.location.search;

//extraire l'id
const idPage = queryStringUrlId.slice(1);

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
        <div class="mt-2 mb-2"><h2>'+this.content+'</h2></div>\
        <div id="likes" class="mt-3 border-bottom border-dark"></div>\
        <div id="comments" class="bg-secondary mt-4"></div>\
        <input type="text" class="w-100 mt-2 mb-3" value="Ajouter un commentaire"></input>';
        singlePost.appendChild(displayPost);
    }
};

const postToDisplay = fetch("http://localhost:3000/api/post/"+idPage);
postToDisplay
.then(async (res)=>{
    try{
        const response = await res.json();
        thisPost = new Publication(response.user_id, response.profile_picture, response.name, response.content, response.date);
    } catch(e){
        console.log(e);
    }
})
.catch(function(err){
    console.log(err);
});

var likes = fetch("http://localhost:3000/api/like"+idPage);
likes
.then(async (res)=>{
    try{
        const response = await res.json();
        let like_number = response.nombre_de_likes;
        var text = document.getElementById("likes");
        var textInside = document.createElement("p");
        textInside.innerHTML=`<button class="rounded border border-dark bg-warning text-white">J'aime</button>\
        ${like_number} personne(s) ont aimé cette publication`;
        text.appendChild(textInside);
    } catch(e){
    console.log(e);
    }
})
.catch(function(err){
    console.log(err);
});


class Comment{
    constructor(id_user, content, date, username){
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
        displayComment.innerHTML = '<h5 class="mt-2 d-inline"><a href="profile.html?/'+this.id_user+'">'+this.username+'</a></h5>\
        <p class="d-inline ml-5">'+this.date+'</p>\
        <h6 class="mt-3">'+this.content+'</h6>';
        location.appendChild(displayComment);
    }
};

listComment = [];
var comments = fetch("http://localhost:3000/api/comment"+idPage);
comments
.then(async (res)=>{
    try{
        const response = await res.json();
        const response2 = response.comments;
        for(i=0; i<response2.length; i++){
            var newComment = new Comment (response2[i].id_user, response2[i].content, response2[i].jolie_date, response2[i].username);
            listComment.push(newComment);
        }
    } catch(e){
        console.log(e);
    }
})
.catch(function(err) {
    console.log(err);
});

