const database = require('../utils/database');
const fs = require('fs');

exports.create = (req,res,next)=>{
    const connection = database.connect();
    const id_user = req.body.id_user;
    const content = req.body.content;
    const image_url = req.body.image_url;
    const date = req.body.date;

    const sql = "INSERT INTO Post\
    VALUES (?,?,?,?);";
    const sqlParams = [id_user, image_url, content, date];
    connection.execute(sql, sqlParams, (error, results, fields)=>{
        if(error){
            res.status(500).json({"error":error.sqlMessage});
        } else {
            res.status(200).json({message: "Publication ajoutée avec succès!"})
        }
    });
    connection.end;
};

exports.getSomePosts = (req, res, next) =>{
    const connection = database.connect();

    const sql = "SELECT * FROM Post ORDER BY date DESC LIMIT 10 OFFSET 0";
    connection.execute(sql)
    
};

exports.getOnePost = (req,res,next)=>{
    const connection = database.connect();

    const id_post = req.body.id_post;
    const sql = "SELECT Post.id, Post.date, Post.image_url, Post.content, Post.date, User.id AS user_id, User.username AS name \
    FROM Post \
    INNER JOIN User ON Post.id_user = User.id \
    WHERE id=?;";
    const sqlParams = [id_post];

    connection.execute(sql,sqlParams, (error, Post, fields)=>{
        if(error){
            res.status(500).json({"error" : error.sqlMessage});
        } else {
            res.status(200)({Post});
        }
    });
    connection.end();
};

exports.delete = (req,res,next)=>{
    const connection = database.connect();
    const id_post = req.body.id_post;
    const sql ="DELETE FROM Post WHERE id=?;";
    const sqlParams = [id_post];

    connection.execute(sql, sqlParams, (error, results, fields)=>{
        if (error){
            res.status(500).json({"error": error.sqlMessage});
        } else {
            res.status(201).json({message : "Publication supprimée"});
        }
    });
    connection.end();
}