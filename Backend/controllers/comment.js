const database = require('../utils/database');

exports.create = (req, res, next) =>{
    const connection = database.connect();
    const userId = req.body.userId;
    const content = req.body.content;
    const postId = req.body.postId;
    const sql = "INSERT INTO Comment (id_user, id_post, content, date) VALUES (?,?,?,NOW());"
    const sqlParams = [userId, postId, content];

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
    const postId = req.params.id;

    const sql = "SELECT User.profile_picture, content, username, User.id AS id_user, date, DATE_FORMAT(date, '%W %e %M %Y at %T') AS jolie_date FROM Comment\
    INNER JOIN User ON Comment.id_user = User.id\
    WHERE Comment.id_post = ?;";
    const sqlParams = [postId];
    connection.execute(sql, sqlParams, (error, comments, fields)=>{
        if (error){
            res.status(500).json({"error": error.sqlMessage});
        } else {
            res.status(200).json({comments, postId});
        }
    });
    connection.end();
};

exports.getSomeCommentOfPost = (req,res,next) =>{
    const connection = database.connect();
    const postId = req.body.postId;
    
     const sql = "SELECT username, content, date, DATE_FORMAT(date, '%W %e %M %Y at %T') AS jolie_date FROM Comment\
     INNERJOIN User ON Comment.id_user = User.id\
     WHERE Comment.id_post = ?\
     ORDER BY date DESC\
     LIMIT 3 OFFSET 0;";

     const sqlParams = [postId];
     connection.execute(sql, sqlParams, (error, results, fields)=>{
        if(error){
            res.status(500).json({"error": error.sqlMessage});
        } else {
            res.status(201).json({
                results,
                postId
            });
        }
     })
}