const jwt = require("jsonwebtoken");
const Cryptr = require("cryptr");
const cryptr = new Cryptr('myTotalySecretKey');

module.exports= (req,res,next) =>{
    try{
        const cryptedToken = req.headers.authorization.split(' ')[1];
        const tokenPasBon = cryptr.decrypt(cryptedToken);
        var indiceDebut = tokenPasBon.indexOf('":"');
        var indiceFin = tokenPasBon.indexOf('","');
        var token = tokenPasBon.substring(indiceDebut+3, indiceFin);
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.id_user;
        if(req.body.userId && req.body.userId !== userId){
            throw 'User ID non valable!';
        } else {
        next();
        }
    } catch(error) {
        res.status(401).json({"error" :'Requête non authentifiée'});
    }
}