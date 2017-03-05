const jsonwebtoken = require('jsonwebtoken');
const atob = require("atob");

module.exports = function({ data, passport, config, fs, path, imageDecoder }) {

    const webTokenSecret = config.webToken;

    function registerUser(req, res) {
        const user = req.body;
        //console.log(user);

        data.registerUser(user)
            .then(() => {
                res.status(201);
                return res.json({ isSuccesful: "true" });
            })
            .catch((err) => {
                res.status(400);
                console.log(err.message)
                return res.json({ isSuccesful: "false" });
            });
    }

    function loginUser(req, res, next) {

        let email = req.body.email;
        let password = req.body.password;

        //console.log(email)

        const webTokenObject = {
            email: req.body.email,
            password: req.body.password
        };


        res.status(200).json({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
                //authtoken: jsonwebtoken.sign(webTokenObject, webTokenSecret),
        });

        // passport.authenticate("local", (err, user) => {
        //   if (err) {
        //     console.log("authenticate error")
        //     return next(err);
        //   }
        //   if (user) {
        //     req.login(user, (err2) => {
        //       if (err2) {
        //         console.log("Invalid email or password.")
        //         return res.status(400).json("Invalid email or password.");
        //       }
        //       console.log(user);
        //      return res.status(200).json({
        //         username: user.username,
        //         email:req.body.email,
        //         password:req.body.password
        //         //authtoken: jsonwebtoken.sign(webTokenObject, webTokenSecret),
        //       });
        //     });
        //   } else {
        //     res.status(400);
        //     return res.json("Invalid username or password.");
        //   }

        // });
    }





    function uploadProfilePicture(req, res) {
        //const email = req.body.email;
        const imageData = req.body.avatar;
        const username = req.user.email;


        data.getUserByName(req.user.email)
            .then((user) => {
                return data.updateUserProfilePicture(user, imageData);
            })
            .then(() => {
                res.status(201);
                return res.json({ isSuccesful: "true" });
            })
            .catch((err) => {
                res.status(400);
                return res.json({ isSuccesful: "false" });
            });


    }

    function updateInformation(req, res) {
        let email = req.body.email;

        data.getUserByEmail(email)
            .then((user) => {
                if (user && user.username !== req.user.username) {
                    res.status(400);
                    return res.json("Username with this email already exists");
                }

                return data.getUserByName(req.user.username);
            })
            .then((user) => {
                return data.updateUserInformation(user, req.body);
            })
            .then(() => {
                res.status(201);
                return res.json("Successfully changed your personal information.");
            })
            .catch((err) => {
                res.status(400);
                return res.json("Problem occured while changing your information. Please try again later.");
            });
    }

    function updatePassword(req, res) {
        let oldPassword = req.body.oldPassword;
        let newPassword = req.body.newPassword;

        data.getUserByName(req.user.email)
            .then((user) => {
                return data.updateUserPassword(user, oldPassword, newPassword);
            })
            .then(() => {
                res.status(201).json({ isSuccesful: "true" });
            })
            .catch((err) => {
                res.status(400).json({ isSuccesful: "false" });
            });
    }





    function getUserByName(req, res) {
        data.getUserByName(req.params.username)
            .then((user) => {

                let foundUser = {
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar,
                    newRequest: user.newRequest

                }

                res.status(200).json(foundUser)
            })
            .catch((err) => {

                res.status(404);
                console.log(err.message);
                return res.json(err.message);

            })
    }

    function getUsers(req, res) {
        data.getUsers()
            .then((users) => {

                res.status(200).json(users);
            })
            .catch((err) => {

                res.status(404);
                return res.json(err.message);

            })
    }

    function sendFriendRequest(req, res) {
        let requester = {
            username: req.user.username,
            email: req.user.email,
            avatar: req.user.avatar
        }
        let receiver = req.body.email;

        //console.log(requester);
        //console.log(receiver);

        data.sendFreindRequest(requester, receiver)
            .then(data => {
                if (!data) {
                    console.log('This user already has request from you!');
                    res.status(401).send({ isSuccesful: "false" });
                } else {
                    res.status(201).send({ isSuccesful: "true" });
                }
            }).catch(err => {
                console.log(err.message);
                res.status(401).send({ isSuccesful: "false" });
            })
    }

    function confirmFriendRequest(req, res) {
        let firstUser = {
            username: req.user.username,
            email: req.user.email,
            avatar: req.user.avatar
        };
        let secondUser = req.body

        Promise.all([data.addFriend(firstUser.username, secondUser),
                data.addFriend(secondUser.username, firstUser),
                data.removeRequest(firstUser.username, secondUser.username)
            ])
            .then(([first, second, dbUser]) => {
                if (!dbUser) {
                    res.status(401).send({ isSuccesful: "false" });
                    return;
                }

                res.status(201).send({ isSuccesful: "true" });

            })
            .catch(err => {
                res.status(401).send({ isSuccesful: "false" })
            })
    }

    function denyFriendRequest(req, res) {
        let firstUser = req.user;
        let secondUser = req.body;

        data.removeRequest(firstUser.username, secondUser.username)
            .then(user => {
                if (!user) {
                    res.status(401).send({ isSuccesful: "false" })
                    return;
                }

                res.status(201).send({ isSuccesful: "true" });

            }).catch(err => {
                res.status(401).send({ isSuccesful: "false" });
            })
    }

    function readAllFriendRequests(req, res) {
        let username = req.user.username;


        data.readAllFriendRequest(username)
            .then(user => {
                if (!user) {
                    res.status(401).send({ isSuccesful: "false" });
                    return;
                }

                res.status(201).send({ isSuccesful: "true" });
            })
            .catch(err => {
                res.status(401).send({ isSuccesful: "false" });
            });
    }

    function searchUsersByUsername(req, res) {
        let pattern = req.params.username;
        let username = req.user.username;

        data.searchUsersByUsername(username, pattern)
            .then(users => {
                if (!users) {
                    console.log("no users")
                    res.status(401).send()
                    return;
                }

                res.status(200).send(users);

            })
            .catch(err => {
                res.status(401).send(err.message);
            })
    }

    function getRequests(req, res) {
        let username = req.user.username;

        data.getRequests(username)
            .then(requests => {
                res.status(200).send(requests);
            })
    }

    function getFriends(req, res) {
        let username = req.user.username;
        data.getFriends(username)
            .then(friends => {
                res.status(200).send(friends);
            })
    }

    function getEventsAsCreator(req, res) {
        let username = req.user.username;
        data.getUsersEventsAsCreator(username)
            .then(eventsAsCreator => {
                if (!eventsAsCreator) {
                    res.status(401).send();
                    return;
                }
                res.status(200).send(eventsAsCreator);
            });
    }

    function getEventsAsParticipant(req, res) {
        let username = req.user.username;
        data.getUsersEventsAsParticipant(username)
            .then(eventsAsParticipant => {
                if (!eventsAsParticipant) {
                    res.status(401).send();
                    return;
                }
                res.status(200).send(eventsAsParticipant);
            });
    }

    function getProfileData(req, res) {
        if (req.user) {
            let foundUser = {
                username: req.user.username,
                email: req.user.email,
                avatar: req.user.avatar,
                newRequest: req.user.newRequest
            };


            res.status(200).json(foundUser);
        } else {


            res.status(404);
            console.log(err.message);
            return res.json(err.message);
        }


    }

    function getUsersEvents(req,res){
        let username = req.params.username;
        data.getUsersEventsAsCreator(username)
        .then(events => {
            if(!events){
                res.status(401).send();
                return;
            }
           res.status(200).send({ message: username+`'s events !`, events })
        })
    }

    return {
        name: "user",
        registerUser,
        loginUser,
        uploadProfilePicture,
        updateInformation,
        updatePassword,
        getUserByName,
        getUsers,
        sendFriendRequest,
        confirmFriendRequest,
        denyFriendRequest,
        readAllFriendRequests,
        searchUsersByUsername,
        getRequests,
        getFriends,
        getEventsAsCreator,
        getEventsAsParticipant,
        getProfileData,
        getUsersEvents
    };
};