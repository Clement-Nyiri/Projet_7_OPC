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

exports.delete = (req,res,next) =>{
    const connection = database.connect();
    const id_comment = req.body.id_comment;

    const sql = "DELETE FROM Comment WHERE id=?;";
    const sqlParams = [id_comment];
     connection.execute(sql, sqlParams, (error, results, fields)=> {
         if (error){
             res.status(500).json({"error": error.sqlMessage});
         } else {
             res.status(200).json({message: "Comment supprimé"});
         }
    });
    connection.end();
};

exports.getAllCommentsOfPost = (req,res,next) =>{
    const connection = database.connect();
    const id_post = req.body.id_post;

    const sql = "SELECT * FROM Comment\
    INNER JOIN User ON Comment.id_user = User.id\
    WHERE Comment.id_post = ?;";
    const sqlParams = [id_post];
    connection.execute(sql, sqlParams, (error, comments, fields)=>{
        if (error){
            res.status(500).json({"error": error.sqlMessage});
        } else {
            res.status(200).json({comments});
        }
    });
    connection.end();
};