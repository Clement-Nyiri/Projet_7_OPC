const database = require('../utils/database');
const fs = require('fs');

exports.create = (req,res,next)=>{
    const connection = database.connect();
    const userId = req.body.userId;
    const content = req.body.content;
    const imageUrl = req.body.imageUrl;
    const date = req.body.date;

    const sql = "INSERT INTO Post (id_user, image_url, content, date)\
    VALUES (?,?,?,?);";
    const sqlParams = [userId, imageUrl, content, date];
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
    const sql = "SELECT Post.id, Post.date, Post.content, Post.date, User.id AS user_id, User.username AS name \
    FROM Post \
    INNER JOIN User ON Post.id_user = User.id \
    WHERE Post.id=?;";
    const sqlParams = [postId];

    connection.execute(sql,sqlParams, (error, Post, fields)=>{
        if(error){
            res.status(500).json({"error" : error.sqlMessage});
        } else {
            res.status(200).json({Post});
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
    const sql = "SELECT image_url, content, date, username \
    FROM Post \
    INNER JOIN User ON Post.id_user = User.id \
    ORDER BY date DESC \
    LIMIT 10 OFFSET 0;"
    connection.execute(sql, (error, results, fields)=>{
        if (error){
            res.status(500).json({"error": error.sqlMessage});
        } else {
            res.status(200).json({results});
        }
    })
}