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
    var connect = fetch("http://localhost:3000/api/user/signup", {
        method: "POST",
        body: JSON.stringify(register),
        headers : {
            "Content-Type":"application/json"
        }
    })
    connect
        .then(async (res)=>{
            const response = await res.json();
            console.log(response);
            window.location.replace("login.html");
        })
        .catch(function(err){
            console.log(err);
        })
})