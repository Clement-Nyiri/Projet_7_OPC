# Projet_7_OPC
 Projet 7 OpenClassroom

Etape 1 - Créer une BDD Mysql 

-u User ou root , -h localhost -p VotreMDP

CREATE DATABASE Groupomania

USE Groupomania

CREATE TABLE User(
id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
username VARCHAR(40) NOT NULL,
email VARCHAR(40) NOT NULL UNIQUE,
password TINYTEXT NOT NULL
description TINYTEXT,
admin BOOLEAN,
profile_picture TINYTEXT,
PRIMARY KEY(id))
[ENGINE=INNODB];

CREATE TABLE Post(
id SMALLINT UNSIGNED NOT NULL AUTO_ICREMENT,
id_user SMALLINT UNSIGNED NOT NULL,
image_url TINYTEXT
content TEXT NOT NULL,
date DATETIME,
PRIMARY KEY(id))
[ENGINE=INNODB];

ALTER TABLE Post
ADD CONSTRAINT fk_id_user_post FOREIGN KEY (id_user) REFERENCES User(id) ON DELETE CASCADE;

CREATE TABLE Comment(
id_user SMALLINT UNSIGNED NOT NULL,
id_post SMALLINT UNSIGNED NOT NULL,
content TINYTEXT NOT NULL,
date DATETIME,
id_comment INT UNSIGNED NOT NULL AUTO_INCREMENT,
PRIMARY KEY(id_comment))
[ENGINE=INNODB];

ALTER TABLE Comment
ADD CONSTRAINT fk_id_user_comment FOREIGN KEY (id_user) REFERENCES User(id) ON DELETE CASCADE;

ALTER TABLE Comment
ADD CONSTRAINT fk_id_post_comment FOREIGN KEY (id_post) REFERENCES Post(id) ON DELETE CASCADE;

CREATE TABLE Likes(
id_user SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
id_post SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT)
[ENGINE=INNODB]

ALTER TABLE Likes
ADD CONSTRAINT fk_id_user_likes FOREIGN KEY (id_user) REFERENCES User(id) ON DELETE CASCADE;

ALTER TABLE Likes
ADD CONSTRAINT fk_id_post_likes FOREIGN KEY (id_post) REFERENCES Post(id) ON DELETE CASCADE;

Etape 2 - ( oui je sais, c'était long et fastidieux)

Dossier Backend/utils/database.js

Dans la fonction connect (exports.connect), changer les paramètres de connexion user, password et le nom de la database si besoin.

Etape 3 -
Lancer l'API en allant dans votre invite de commande, "cd CHEMIN DU DOSSIER BACKEND", puis npm install pour installer les dépendances (en espérant qu'elles soient
toutes là), puis nodemon server, qui devraient lancer l'API sur le port 3000.

Etape 4 - 
Ouvrir une autre invite de commande, "cd CHEMIN DU DOSSIER FRONTEND", puis "npm install" pour les dépendances, puis "npm install -g http-server",
ensuite, entrer la commande "http-server", et se rendre sur localhost:8080, le Frontend devrait s'y trouver. 