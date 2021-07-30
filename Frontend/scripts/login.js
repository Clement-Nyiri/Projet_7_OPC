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
            if(res.status == 404){
                window.alert("Cet utilisateur n'existe pas");
                window.location.reload();
            } else if (res.status == 401){
                window.alert("Mot de passe incorrect");
                window.location.reload();
            }else{
            const response = await res.json();
            window.location.replace("index.html");
            function setWithExpiry(key, value, ttl) {
                const now = new Date()
            
                // `item` is an object which contains the original value
                // as well as the time when it's supposed to expire
                const item = {
                    value: value,
                    expiry: now.getTime() + ttl,
                }
                localStorage.setItem(key, JSON.stringify(item))
            };
            var stockageToken = setWithExpiry("snToken", response.tokenCrypted, 3600000);//valide pour 1h
        }})
        .catch(function(err){
            console.log(err);
        })
});
