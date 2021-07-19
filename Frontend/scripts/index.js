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