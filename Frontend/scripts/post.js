// Page publication solo site groupomania \\

// Recup chaine de l'id dans l'URL
const queryStringUrlId = window.location.search;

//extraire l'id
const idPage = queryStringUrlId.slice(1);

class Publication {
    constructor(profile_picture, name, content, date){
        this.profile_picture = profile_picture;
        this.name = name;
        this.content = content;
        this.date = date;
        this.createPost();
    }
    createPost(){
        var displayPost = document.createElement("div");
        var singlePost = document.getElementById('singlePost');
        displayPost.innerHTML = '<h4><img src="'+this.profile_picture+' alt="profile_picture"/>'+this.name+'</h4>\
        <p id="date_publi">le '+this.date+'</p>\
        <div><h2>'+this.content+'</h2></div>\
        <div id="likes"></div>\
        <div id="comments"></div>';
        singlePost.appendChild(displayPost);
    }
};

const postToDisplay = fetch("http://localhost:3000/api/post/"+idPage);
postToDisplay
.then(async (res)=>{
    try{
        const response = await res.json();
        thisPost = new Publication(response.profile_picture, response.name, response.content, response.date);
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
        textInside.innerHTML=`<button>J'aime</button>\
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
        displayComment.classList.add("mt-4");
        var location = document.getElementById("comments");
        displayComment.innerHTML = '<h4>'+this.username+'</h4>\
        <p>le '+this.date+'</p>\
        <h5>'+this.content+'</h5>';
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
            var newComment = new Comment (response2[i].id_user, response2[i].content, response2[i].date, response2[i].username);
            listComment.push(newComment);
        }
    } catch(e){
        console.log(e)
    }
})
.catch(function(err) {
    console.log(err);
});
console.log(listComment);

