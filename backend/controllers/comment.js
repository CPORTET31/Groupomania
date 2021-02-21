//Import
let models = require('../models');
let utils = require('../utils/jwtUtils');
const fs = require('fs');


//Création d'un Comment
exports.create = (req, res) => {
    //identifier qui créé le message
    let id = utils.getUserId(req.headers.authorization)
    models.User.findOne({
        attributes: ['id', 'email', 'username'],
        where: { id: id }
    })
        .then(user => {
            if (user !== null) {

                //Récupération du corps du Comment
                let content = req.body.content;
                if ((content == 'null')) {
                    res.status(400).json({ error: 'Rien à publier' })
                } else {
                    models.Comment.create({
                        content: content,
                        UserId: user.id,
                        PostId: req.body.postId
                    })
                        .then((newComment) => {
                            res.status(201).json(newComment)
                        })
                        .catch((err) => {
                            res.status(500).json(err)
                        })
                };
            } else {
                res.status(400).json(error);
            }
        })
        .catch(error => res.status(500).json(error));
}

//Suppression d'un Comment
exports.delete = (req, res) => {
    //req => userId, postId, user.isAdmin
    let userOrder = req.body.userIdOrder;
    //identification du demandeur
    let id = utils.getUserId(req.headers.authorization)
    models.User.findOne({
        attributes: ['id', 'email', 'username', 'isAdmin'],
        where: { id: id }
    })
        .then(user => {
            //Vérification que le demandeur est soit l'admin soit le Commenteur (vérif aussi sur le front)
            if (user && (user.isAdmin == true || user.id == userOrder)) {
                console.log('Suppression du Comment id :', req.body.commentId);
                models.Comment
                    .findOne({
                        where: { id: req.body.commentId }
                    })
                    .then((commentFind) => {
                        models.Comment
                            .destroy({
                                where: { id: commentFind.id }
                            })
                            .then(() => res.end())
                            .catch(err => res.status(500).json(err))
                    })
                    .catch(err => res.status(500).json(err))
            } else { res.status(403).json('Utilisateur non autorisé à supprimer ce Comment') }
        })
        .catch(error => res.status(500).json(error));
};

//Modification d'un Comment
exports.update = (req, res) => {
    //récupération de l'id du demandeur pour vérification
    let userOrder = req.body.userIdOrder;
    //identification du demandeur
    let id = utils.getUserId(req.headers.authorization);
    models.User.findOne({
        attributes: ['id', 'email', 'username', 'isAdmin'],
        where: { id: id }
    })
        .then(user => {
            //Vérification que le demandeur est soit l'admin soit le poster (vérif aussi sur le front)
            if (user && (user.isAdmin == true || user.id == userOrder)) {
                console.log('Modif ok pour le Comment :', req.body.commentId);
                models.Comment
                    .update(
                        {
                            content: req.body.newText,
                        },
                        { where: { id: req.body.commentId } }
                    )
                    .then(() => res.end())
                    .catch(err => res.status(500).json(err))
            }
            else {
                res.status(401).json({ error: 'Utilisateur non autorisé à modifier ce commentaire' })
            }
        }
        )
        .catch(error => res.status(500).json(error));
}
