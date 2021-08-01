const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken');
const database = require('../utils/database');
const Cryptr = require("cryptr");
const cryptr = new Cryptr('myTotalySecretKey');
const fs = require("fs");

exports.signup = (req, res, next) =>{
    bcrypt.hash(req.body.password, 10)
    .then(hash=>{
        const connection = database.connect();

        const name = req.body.name;
        const email = req.body.email;
        const password = hash;
        const imageUrl = "http://localhost:3000/images/defaultProfilePicture.jpg"
        const sql = "INSERT INTO User (username, email, password, profile_picture)\
        VALUES (?, ?, ?, ?);";
        const sqlParams = [name, email, password, imageUrl];

        connection.execute(sql, sqlParams, (error, results, fields) => {
            if (error) {
                if (error.errno === 1062) {res.status(403).json({"error": "L'email est déjà utilisé !"});
            } else {
                res.status(500).json({error});
            }
        } else { res.status(201).json({ message: 'Nouvel utilisateur créé !'})};
    });
    connection.end();
    })
    .catch(error => res.status(500).json({error}))
};

exports.login = (req, res, next) =>{
    const connection = database.connect();
    const email = req.body.email;
    const sql = "SELECT id, password, admin FROM User WHERE email= ?;";
    const sqlParams = [email];

    connection.execute(sql, sqlParams, (error, results, fields) =>{
        if (error) {
            res.status(500).json({"error": error.sqlMessage });
        } else if (results.length == 0) {
            res.status(404).json({error : 'Cet utilisateur n\'existe pas '});
        } else {
            bcrypt.compare(req.body.password, results[0].password)
            .then (valid =>{
                if (!valid) {
                    return res.status(401).json({error : 'Mot de passe incorrect'});
                }
                const newToken = jwt.sign(
                    { id_user: results[0].id },
                    'RANDOM_TOKEN_SECRET',
                );

                //Envoi du token & userId dans un cookie
                const LSContent = {
                    token: newToken,
                    userId: results[0].id
                };
                const cryptedToken = cryptr.encrypt(JSON.stringify(LSContent));
                
                res.status(200).json({
                    message: "Utilisateur connecté",
                    tokenCrypted : cryptedToken
                });
            })
            .catch(error => res.status(500).json({error}))
        };
        connection.end();
    })
};

exports.getCurrentUser = (req, res, next) =>{
    const connection = database.connect();
    const tokenLS = req.body.token;
    const token = JSON.parse(cryptr.decrypt(tokenLS));
    const searchId = token.userId;
    const sql = "SELECT id, username, admin FROM User WHERE id=?";
    const sqlParams = [searchId];
    connection.execute(sql, sqlParams, (error, results, fields) =>{
        if (error) {
            res.status(500).json({"error": error.sqlMessage})
        } else if (results.length === 0){
            res.status(404).json({ error : 'Cet utilisateur n\'existe pas'});
        } else {
            res.status(200).json({
                userId: results[0].id,
                name: results[0].username,
                admin: results[0].admin
            });
        }
    });
    connection.end();
}

exports.delete = (req,res,next) =>{
    const connection = database.connect();
    const userId = req.params.id;
    const sql = "DELETE FROM User WHERE id = ?;";
    const sqlParams = [userId];
    connection.execute(sql, sqlParams, (error, results, fields)=>{
        if(error){
            res.status(500).json({error});
        } else {
            res.status(200).json({message: "Utilisateur supprimé avec succès !"})
        }});
    connection.end();
    };

exports.updateDescription = (req,res,next) =>{
    const connection = database.connect();
    const newDescription = req.body.description;
    const userId = req.params.id;
    const sql = "UPDATE User SET description = ? WHERE id=?;";
    const sqlParams = [newDescription, userId];
    connection.execute(sql, sqlParams, (error, results, fields) =>{
        if (error){
            res.status(500).json({error});
        } else {
            res.status(201).json({message: "Profil mis à jour avec succès"});
        }
        connection.end();
    })
};

exports.updatePicture = (req,res,next) => {
    const connection = database.connect();
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    const id_user = req.params.id;
    const sql = "UPDATE User SET profile_picture=? WHERE id=?;";
    const sqlParams = [imageUrl, id_user];
    connection.execute(sql, sqlParams, (error, results, fields) => {
        if (error) {
        res.status(500).json({ "error": error.sqlMessage });
        } else {
        res.status(201).json({ message: 'Photo de profil modifiée' });
     }
    });
    connection.end();
};

exports.getOneUser = (req,res,next) => {
    const connection = database.connect();
    const searchId = req.params.id;
    const sql = "SELECT id, username, email, profile_picture, description FROM User WHERE id=?;"
    const sqlParams = [searchId];
    connection.execute(sql, sqlParams, (error, results, fields)=> {
        if (error) {
            res.status(500).json ({"error": error.sqlMessage});
        } else if (results.length == 0) {
            res.status(404).json({error: 'Cet utilisateur n\'existe pas'});
        } else {
            res.status(200).json({
                id: results[0].id,
                username: results[0].username,
                email: results[0].email,
                profile_picture: results[0].profile_picture,
                description: results[0].description
            });
        }
    });
    connection.end();
};

