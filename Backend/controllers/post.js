const database = require('../utils/database');
const fs = require('fs');

exports.create = (req,res,next)=>{
    const connection = database.connect();
    const userId = req.body.userId;
    const content = req.body.content;
    const imageUrl = req.body.imageUrl;

    const sql = "INSERT INTO Post (id_user, image_url, content, date)\
    VALUES (?,?,?,NOW());";
    const sqlParams = [userId, imageUrl, content];
    connection.execute(sql, sqlParams, (error, results, fields)=>{
        if(error){
            res.status(500).json({"error":error.sqlMessage});
        } else {
            res.status(200).json({message: "Publication ajoutée avec succès!"})
        }
    });
    connection.end;
};

exports.getOnePost = (req,res,next)=>{
    const connection = database.connect();

    const postId = req.params.id;
    const sql = "SELECT Post.id, Post.date, DATE_FORMAT(Post.date, '%W %e %M %Y at %T') AS jolie_date, Post.content, Post.image_url, Post.date, User.id AS user_id, User.username AS name, User.profile_picture AS profile_picture \
    FROM Post \
    INNER JOIN User ON Post.id_user = User.id \
    WHERE Post.id=?;";
    const sqlParams = [postId];

    connection.execute(sql,sqlParams, (error, results, fields)=>{
        if(error){
            res.status(500).json({"error" : error.sqlMessage});
        } else {
            res.status(200).json({
                imageUrl: results[0].image_url,
                id: results[0].id,
                date: results[0].jolie_date,
                content: results[0].content,
                user_id: results[0].user_id,
                name: results[0].name,
                profile_picture: results[0].profile_picture});
        }
    });
    connection.end();
};

exports.delete = (req,res,next)=>{
    const connection = database.connect();
    const postId = req.params.id;
    const sql ="DELETE FROM Post WHERE id=?;";
    const sqlParams = [postId];

    connection.execute(sql, sqlParams, (error, results, fields)=>{
        if (error){
            res.status(500).json({"error": error.sqlMessage});
        } else {
            res.status(201).json({message : "Publication supprimée"});
        }
    });
    connection.end();
};

exports.getSomePosts = (req,res,next)=>{
    const connection = database.connect();
    const sql = "SELECT User.profile_picture, User.id AS user_id, Post.id, image_url, Post.content, DATE_FORMAT(Post.date, '%W %e %M %Y at %T') AS date, username AS name\
    FROM Post \
    INNER JOIN User ON Post.id_user = User.id \
    ORDER BY Post.date DESC \
    LIMIT 10 OFFSET 0;"
    connection.execute(sql, (error, results, fields)=>{
        if (error){
            res.status(500).json({"error": error.sqlMessage});
        } else {
            res.status(200).json({results});
        }
    })
};
