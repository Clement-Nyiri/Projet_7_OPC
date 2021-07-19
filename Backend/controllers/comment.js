const database = require('../utils/database');

exports.create = (req, res, next) =>{
    const connection = database.connect();
    const userId = req.body.userId;
    const content = req.body.content;
    const postId = req.body.postId;
    const date = req.body.date; // A modifier
    const sql = "INSERT INTO Comment (id_user, id_post, content, date) VALUES (?,?,?,?);"
    const sqlParams = [userId, postId, content, date];

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
    const commentId = req.params.id;

    const sql = "DELETE FROM Comment WHERE id_comment=?;";
    const sqlParams = [commentId];
    connection.execute(sql, sqlParams, (error, results, fields)=> {
         if (error){
             res.status(500).json({"error": error.sqlMessage});
         } else {
             res.status(200).json({message: "Commentaire supprimé"});
         }
    });
    connection.end();
};

exports.getAllCommentsOfPost = (req,res,next) =>{
    const connection = database.connect();
    const postId = req.body.postId;

    const sql = "SELECT content, date, username FROM Comment\
    INNER JOIN User ON Comment.id_user = User.id\
    WHERE Comment.id_post = ?;";
    const sqlParams = [postId];
    connection.execute(sql, sqlParams, (error, comments, fields)=>{
        if (error){
            res.status(500).json({"error": error.sqlMessage});
        } else {
            res.status(200).json({comments});
        }
    });
    connection.end();
};