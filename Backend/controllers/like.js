const database = require('../utils/database');

exports.postLike = (req,res,next) =>{
    const connection = database.connect();
    const id_user = req.body.userId;
    const id_post = req.body.postId;
    const sql = "DELETE FROM Likes WHERE (id_user=? AND id_post= ?);";
    const sqlParams = [id_user, id_post];
    //On supprime d'abord le like
    connection.execute(sql, sqlParams, (error, results, fields)=>{
        if (error){
            connection.end();
            res.status(500).json({"error": error.sqlMessage});
        } else {
            const sql2 = "INSERT INTO Likes (id_user, id_post) VALUEs (?,?);";
            connection.execute(sql2, sqlParams, (error, results, fields) =>{
                if (error){
                    res.status(500).json({"error" : error.sqlMessage});
                } else {
                    res.status(201).json({message : "Vous avez aimé cette publication"});
                }
            })
        }
    });
    connection.end();
};

exports.getLikes = (req, res, next) => {
    const connection = database.connect();
    const id_post = req.body.postId;
    const sql = "SELECT * FROM Likes WHERE id_post=?;"
    const sqlParams = [id_post];

    connection.execute(sql, sqlParams, (error, results, fields)=>{
        if (error){
            res.status(500).json({"error": error.sqlMessage});
        } else {
            res.status(200).json({nombre_de_likes : results.length})
        }
    });
    connection.end();
}