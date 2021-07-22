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
        var singlePost = document.getElementById("filActu");
        displayPost.innerHTML = '<h4 class="d-inline"><img src="'+this.profile_picture+'"/><a href="profile.html?/'+this.user_id+'">'+this.name+'</a></h4>\
        <p id="date_publi" class="d-inline">'+this.date+'</p>\
        <div class="mt-4"><h2><a href="post.html?/'+this.id+'">'+this.content+'</a></h2></div>\
        <div id="likes'+this.id+'"></div>\
        <div id="comments" class="bg-secondary"></div>';
        singlePost.appendChild(displayPost);
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
                    let id_post = responseLikes.results;
                    console.log(responseLikes);
                    var text = document.getElementById(`likes${id_post}`);
                    var textInside = document.createElement("p");
                    textInside.innerHTML=`<button class="rounded border border-dark bg-warning text-white">J'aime</button>\
                    ${like_number} personne(s) ont aimé cette publication`;
                    text.appendChild(textInside);
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