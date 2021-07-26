// Page de connexion Groupomania \\

const btnConnect = document.getElementById("connect");

btnConnect.addEventListener('click', (e)=>{
    e.preventDefault();
    //Recupération des valeurs du formulaire rempli + création d'un object avec
    const login = {
        "email": document.getElementById("email").value,
        "password": document.getElementById("inputPassword").value
    };
    var connect = fetch("http://localhost:3000/api/user/login", {
        method: "POST",
        body: JSON.stringify(login),
        headers : {
            "Content-Type":"application/json"
        }
    })
    connect
        .then(async (res)=>{
            const response = await res.json();
            window.location.replace("index.html");
            localStorage.setItem("admin", response.admin);
            localStorage.setItem("id_user", response.id_user);
        })
        .catch(function(err){
            console.log(err);
        })
})