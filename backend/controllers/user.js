//Import
let bcrypt = require('bcrypt');
let models = require('../models');
let utils = require('../utils/jwtUtils');
let verifInput = require('../utils/verifInput')

//Création d'un user
exports.signup = (req, res) => {
    // Valider les paramètres de la requète
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;

    if (email == null || username == null || password == null) {
        res.status(400).json({ error: 'il manque un paramètre' })
    }

    let emailOk = verifInput.validEmail(email);
    let mdpOK = verifInput.validPassword(password);
    let usernameOk = verifInput.validUsername(username);
    if (emailOk == true && mdpOK == true && usernameOk == true) {
        //Vérification si user n'existe pas déjà
        models.User.findOne({
            attributes: ['username'],
            where: { username: username }
        })
            .then(user => {
                if (!user) {
                    bcrypt.hash(password, 10, function (err, bcryptPassword) {
                        // Création de l'user
                        const newUser = models.User.create({
                            email: email,
                            username: username,
                            password: bcryptPassword,
                            isAdmin: false
                        })
                            .then(newUser => { res.status(201).json({ 'id': newUser.id }) })
                            .catch(err => {
                                res.status(500).json({ err })
                            })
                    })
                }
                else {
                    res.status(409).json({ error: 'Cette utilisateur existe déjà ' })
                }
            })
            .catch(err => { res.status(500).json({ err }) })
    } else {
        console.log('pas cette fois')
    }
};

//Login d'un user
exports.login = (req, res) => {
    //Récupération et validation des paramètres
    let username = req.body.username;
    let password = req.body.password;
    if (username == null || password == null) {
        res.status(400).json({ error: 'Il manque un paramètre' })
    }
    //Vérification si user existe
    models.User.findOne({
        where: { username: username }
    })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, (errComparePassword, resComparePassword) => {
                    if (resComparePassword) {
                        res.status(200).json({
                            userId: user.id,
                            token: utils.generateToken(user),
                            isAdmin: user.isAdmin
                        })
                    } else {
                        res.status(403).json({ error: 'invalid password' });
                    };
                })
            } else {
                res.status(404).json({ 'erreur': 'Cet utilisateur n\'existe pas' })
            }
        })
        .catch(err => { res.status(500).json({ err }) })
};

//Profil d'un user
exports.userProfil = (req, res) => {
    let id = utils.getUserId(req.headers.authorization)
    models.User.findOne({
        attributes: ['id', 'email', 'username','isAdmin'],
        where: { id: id }
    })
        .then(user => res.status(200).json(user))
        .catch(error => res.status(500).json(error))
};

//modification d'un profil
exports.changePwd = (req, res) => {
    //Récupère l'id de l'user et le nouveau password
    let userId = utils.getUserId(req.headers.authorization);
    const newPassword = req.body.newPassword;
    //Vérification regex du nouveau mot de passe
    if (verifInput.validPassword(newPassword)) {
        //Vérifie qu'il est différent de l'ancien
        models.User.findOne({
            where: { id: userId }
        })
            .then(user => {
                console.log('user trouvé', user)
                bcrypt.compare(newPassword, user.password, (errComparePassword, resComparePassword) => {
                    //bcrypt renvoit resComparePassword si les mdp sont identiques donc aucun changement
                    if (resComparePassword) {
                        res.status(406).json({ error: 'Vous avez entré le même mot de passe' })
                    } else {
                        bcrypt.hash(newPassword, 10, function (err, bcryptNewPassword) {
                            models.User.update(
                                { password: bcryptNewPassword },
                                { where: { id: user.id } }
                            )
                                .then(() => res.status(201).json({ confirmation: 'mot de passe modifié avec succès' }))
                                .catch(err => res.status(500).json(err))
                        })
                    }
                })
            })
            .catch(err => json(err))
    } else {
        res.status(406).json({ error: 'mot de passe non valide' })
    }
}

//Suppression d'un compte
exports.deleteProfile = (req, res) => {
    //récupération de l'id de l'user
    let userId = utils.getUserId(req.headers.authorization);
    if (userId != null) {
        //Recherche sécurité si user existe bien
        models.User.findOne({
            where: { id: userId }
        })
            .then(user => {
                if (user != null) {

                    /*models.Post.findAll({
                        attributes: ['id'],
                        where: { userId: user.id }
                    }).then(posts => {*/
                        models.Comment
                            .destroy({
                                where: { userId: user.id }
                            })
                            .then(() => {
                                    
                                models.Post.findAll({
                                    where: { userId: user.id }
                                }).then(posts => {
                                    if (posts.length > null) { 
                                        for(var i = 0; i < posts.length; i++) {
                                            models.Comment
                                            .destroy({
                                                where: {
                                                    postId: posts[i].dataValues.id
                                                }
                                            });
                                        }
                                    }
                                
                                    //Delete de tous les posts de l'user même s'il y en a pas
                                    models.Post
                                    .destroy({
                                        where: { userId: user.id }
                                    })
                                    .then(() => {
                                        console.log('Tous les posts de cet user ont été supprimé');
                                        //Suppression de l'utilisateur
                                        models.User
                                            .destroy({
                                                where: { id: user.id }
                                            })
                                            .then(() => res.end())
                                            .catch(err => console.log(err))
                                    })
                                    .catch(err => res.status(502).json(err));
                                    
                            }).catch(err => res.status(501).json(err));
                        
                    }).catch(err => res.status(501).json(err));
                }
                else {
                    res.status(401).json({ error: 'Cet user n\'existe pas' })
                }
            })
    } else {
        res.status(500).json({ error: 'Impossible de supprimer ce compte, contacter un administrateur' })
    }
}

//Renvoi tous les utilisateurs
exports.listUsers = (req, res) => {
    //récupération de l'id de l'user
    let userId = utils.getUserId(req.headers.authorization);
    if (userId != null) {
        //Recherche sécurité si user existe bien
        models.User.findOne({
            where: { id: userId }
        }).then(userAdmin => {
            if (userAdmin != null) {
                if(userAdmin.isAdmin) {
                    models.User.findAll({
                        attributes: ['id', 'email','username', 'isAdmin', 'createdAt']
                    }).then(users => {
                        if (users.length > null) {
                            res.status(200).json(users);
                        } else {
                            res.status(404).json({ error: 'Pas d\'utilisateur à afficher' });
                        }
                    })
                    .catch(err => res.status(500).json(err));
                }
            }
        });
    }
}

//Suppression d'un compte depuis l'id
exports.deleteProfileFromId = (req, res) => {
    //récupération de l'id de l'user
    let userId = utils.getUserId(req.headers.authorization);
    if (userId != null) {
        //Recherche sécurité si user existe bien
        models.User.findOne({
            where: { id: userId }
        })
            .then(userAdmin => {
                if (userAdmin != null) {
                    if(userAdmin.isAdmin) {
                        models.User.findOne({
                            where: { id: req.body.userId }
                        }).then(user => {
                            if (user != null) {
                                models.Comment
                                .destroy({
                                    where: { userId: user.id }
                                })
                                .then(() => {
                                    console.log('Tous les commentaires de cet user ont été supprimé');

                                    models.Post.findAll({
                                        where: { userId: user.id }
                                    }).then(posts => {
                                        if (posts.length > null) { 
                                            for(var i = 0; i < posts.length; i++) {
                                                models.Comment
                                                .destroy({
                                                    where: {
                                                        postId: posts[i].dataValues.id
                                                    }
                                                });
                                            }
                                        }
                                        //Delete de tous les posts de l'user même s'il y en a pas
                                        models.Post
                                        .destroy({
                                            where: { userId: user.id }
                                        })
                                        .then(() => {
                                            console.log('Tous les posts de cet user ont été supprimé');
                                            //Suppression de l'utilisateur
                                            models.User
                                                .destroy({
                                                    where: { id: user.id }
                                                })
                                                .then(() => res.end())
                                                .catch(err => console.log(err))
                                        }).catch(err => res.status(500).json(err));
                                    }).catch(err => res.status(500).json(err));
                                });
                            }
                        });
                    } else { 
                        res.status(402).json({ error: 'Vous n\'êtes pas administrateur' })
                    }
                }
                else {
                    res.status(401).json({ error: 'Cet user n\'existe pas' })
                }
            });
    } else {
        res.status(500).json({ error: 'Impossible de supprimer ce compte, contacter un administrateur' })
    }
}