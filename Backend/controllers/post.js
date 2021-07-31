const database = require('../utils/database');
const fs = require('fs');

exports.create = (req,res,next)=>{
    const connection = database.connect();
    const postObject = req.file ?{
        userId: JSON.parse(req.body.userId),
        content : JSON.parse(req.body.content),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        userId: req.body.userId,
        content: req.body.content,
        imageUrl: req.body.image
    }
    const sql = "INSERT INTO Post (id_user, image_url, content, date)\
    VALUES (?,?,?,NOW());";
    const sqlParams = [postObject.userId, postObject.imageUrl, postObject.content];
    connection.execute(sql, sqlParams, (error, results, fields)=>{
        if(error){
            res.status(500).json({"error":error.sqlMessage});
        } else {
            res.status(200).json({message: "Publication créée avec succès!"})
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
        } else if(results.length == 0){
            res.status(404).json({message : "Cette publication est introuvable"});
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
    const sql = "DELETE FROM Post WHERE id=?"
    const sqlParams = [postId];
    connection.execute(sql, sqlParams, (error, results, fields)=>{
        if(error){
            res.status(500).json({error});
        } else {
            res.status(200).json({message: "Publication supprimée avec succès !"})
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
    LIMIT 20 OFFSET 0;"
    connection.execute(sql, (error, results, fields)=>{
        if (error){
            res.status(500).json({"error": error.sqlMessage});
        } else {
            res.status(200).json({results});
            
        }
    })
};
