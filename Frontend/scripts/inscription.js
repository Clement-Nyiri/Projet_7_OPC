// Page inscription Groupomania \\

const btnRegister = document.getElementById("inscrire");

btnRegister.addEventListener('click', (e)=>{
    e.preventDefault();
    //Recupération des valeurs du formulaire rempli + création d'un object avec
    const register = {
        "name": document.getElementById("name").value,
        "email": document.getElementById("email").value,
        "password": document.getElementById("inputPassword").value
    };
    if(document.getElementById("name").value == ""){
        window.alert("Veuillez renseigner un nom d'utilisateur");
    } else if(document.getElementById("email").value == ""){
        window.alert("Veuillez entrer une adresse email valide")
    } else if(document.getElementById("inputPassword").value == ""){
        window.alert("Le mot de passe ne peut pas être vide")
    } else{
    var connect = fetch("http://localhost:3000/api/user/signup", {
        method: "POST",
        body: JSON.stringify(register),
        headers : {
            "Content-Type":"application/json"
        }
    })
    connect
        .then(async (res)=>{
            if(res.status == 403){
                window.alert('Cette adresse email est déja utilisée');
                window.location.reload()
            } else if(res.status == 500){
                window.alert('Il y a eu une erreur');
                window.location.reload()
            }else {
            const response = await res.json();
            console.log(response);
            window.location.replace("login.html");
            }})
        .catch(function(err){
            console.log(err);
        })
    }
})