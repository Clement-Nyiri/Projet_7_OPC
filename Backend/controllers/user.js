const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken');
const database = require('../utils/database');

exports.signup = (req, res, next) =>{
    bcrypt.hash(req.body.password, 10)
    .then(hash=>{
        const connection = database.connect();

        const username = req.body.username;
        const email = req.body.email;
        const password = hash;
        const sql = "INSERT INTO User (username, email, password)\
        VALUES (?, ?, ?, ?);";
        const sqlParams = [username, email, password];

        connection.execute(sql, sqlParams, (error, result, fields) => {
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
    const sql = "SELECT id, password, username FROM User WHERE username= ?";
    const sqlParams = [email];

    connection.execute(sql, sqlParams, (error, result, fields) =>{
        if (error) {
            res.status(500).json({"error": error.sqlMessage });
        } else if (results.length == 0) {
            res.status(401).json({error : 'Cet utilisateur est introuvable '});
        } else {
            bcrypt.compare(req.body.password, results[0].password)
            .then (valid =>{
                if (!valid) {
                    return res.status(401).json({error : 'Mot de passe incorrect'});
                }
                res.status(200).json({
                    token:jwt.sign(
                        { userId: results[0].id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h'}
                    )
                });
            })
            .catch(error => res.status(500).json({error}))
        }
    })
};

exports.delete = (req,res,next) =>{
    const connection = database.connect();
    const id = req.body.userId;
    const sql = "DELETE FROM User WHERE id = ?";
    const sqlParams = [id];

    connection.execute(sql, sqlParams, (error, result, fields)=>{
        if(error){
            res.status(500).json({error});
        } else {
            res.status(201).json({message: "Utilisateur supprimé avec succès"});
        };
        connection.end();
    })
};

exports.put = (req,res,next) =>{
    const connection = database.connect();
}