const database = require('../utils/database');

exports.create = (req, res, next) =>{
    const connection = database.connect();
    const id_user = req.body.id_user;
    const content = req.body.content;
    const id_post = req.body.id_post;
    const date = date; // A modifier
    const sql = "INSERT INTO Comment (id_user, id_post, content, date) VALUES (?,?,?,?);"
    const sqlParams = [id_user, id_post, content, date];

    connection.execute(sql, sqlParams, (error, results, fields)=>{
        if (error){
            res.status(500).json({"error" : error.sqlMessage});
        } else {
            res.status(201).json({message: "Commentaire ajouté avec succès"});
        }
    });
    connection.end();
};

exports.update = (req,res,next) => {
    const connection = database.connect();
    const id_user = req.body.id_user;
    const id_post = req.body.id_post;
    const content = req.body.content;

    const sql = "UPDATE Comment SET content=? WHERE (id_user=? AND id_post=?);"
    const sqlParams = [id_user, id_post, content];

    connection.execute(sql, sqlParams, (error, results, fields)=>{
        if(error){
            res.status(500).json({"error": error.sqlMessage});
        } else {
            res.status(201).json({message: "Commentaire modifié avec succès"});
        }
    });
    connection.end();
}