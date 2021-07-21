class Publication{
    constructor(username, image_url, content, date, likes){
        this.username = username;
        this.imageUrl = image_url;
        this.content = content;
        this.date = date;
        this.likes = likes;
    }
    createCard(){
        var nouvellePublication = document.createElement("article");
        var card = document.getElementById("filActu");
        nouvellePublication.innerHTML = '<article class= mt-2 bg-white shadow>\
        <p>'+this.username+'</p>\
        <p>Publié le '+this.date+'</p>\
        <p>'+this.content+'</p>\
        </article>'
    }
}

/* <article class="card col-7 bg-white mt-4 text-center">\
        <h4><a href="profile.html?'+this.id+'">'+this.name+'</a></h4>\
        </article>' 
*/