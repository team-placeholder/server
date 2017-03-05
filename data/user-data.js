const encryption = require("../utils/encryption");

module.exports = function(models) {
    let { User } = models;

    function createNewUser(body) {
        return new Promise((resolve, reject) => {
            const salt = encryption.generateSalt();
            const hashedPassword = encryption.generateHashedPassword(salt, body.password);

            //console.log(body.username);
            User.create({
                    username: body.username,
                    hashedPassword,
                    salt,
                    email: body.email
                })
                .then(() => {
                    return resolve();
                })
                .catch(err => {
                    return reject(err);
                });
        });
    }

    function registerUser(body) {
        return new Promise((resolve, reject) => {
            User.findOne({
                    $or: [
                        { username: body.username },
                        { email: body.email }
                    ]
                })
                .then(user => {
                    if (user) {
                        return reject(new Error("A user with this username or email already exists."));
                    }

                    return createNewUser(body);
                })
                .then(() => {
                    return resolve();
                })
                .catch(err => {
                    return reject(err);
                });
        });
    }

    function sendFreindRequest(requester, receiver) {
        return new Promise((resolve, reject) => {
            // requester._id = requester.requestUser + "_" + username;

            User.findOneAndUpdate({
                    "email": receiver,
                    "request.username": { $ne: requester.username },
                    "friends.username": { $ne: requester.username }
                }, { $addToSet: { "request": requester }, $inc: { "newRequest": 1 } }, { new: true },
                (err2, dbReq) => {
                    if (err2) {
                        console.log(err2.message)
                        return reject(err2);
                    }
                    return resolve(dbReq);
                });

        });
    }

    function readAllFriendRequest(username) {
        return new Promise((resolve, reject) => {
            User.findOneAndUpdate({ "username": username }, { $set: { "newRequest": 0 } }, { new: true },
                (err, dbReq) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(dbReq);
                });
        });
    }

    function addFriend(username, friend) {
        return new Promise((resolve, reject) => {
            User.findOneAndUpdate({ "username": username }, { $push: { "friends": friend } }, { save: true },
                (err, user) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(user);
                }
            );
        });
    }



    function removeRequest(username, requestUsername) {
        return new Promise((resolve, reject) => {
            User.findOneAndUpdate({ "username": username }, { $pull: { "request": { "username": requestUsername } } }, { new: true },
                (err, user) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(user);
                });
        });
    }


    function updateUserProfilePicture(user, filename) {
        return new Promise((resolve, reject) => {
            User.update({ _id: user._id }, { avatar: filename }, null, (err) => {
                if (err) {
                    return reject(err);
                }

                return resolve();
            });
        });
    }

    function updateUserInformation(user, params) {
        const changes = {};

        for (let param in params) {
            if (params[param] !== user[param]) {
                changes[param] = params[param];
            }
        }

        return new Promise((resolve, reject) => {
            User.update({ _id: user._id }, changes, null, (err) => {
                if (err) {
                    return reject(err);
                }

                return resolve();
            });
        });
    }

    function updateUserPassword(user, oldPassword, requestPassword) {
        return new Promise((resolve, reject) => {
            const requestedOldPassword = encryption.generateHashedPassword(user.salt, oldPassword);

            if (user.hashedPassword !== requestedOldPassword) {
                return reject("Incorrect old password. Please try again");
            }

            const hashedNewPassword = encryption.generateHashedPassword(user.salt, requestPassword);

            User.update({ _id: user._id }, { hashedPassword: hashedNewPassword }, null, (err) => {
                if (err) {
                    return reject(err);
                }

                return resolve();
            });
        });
    }

    function updateUserRole(user) {
        return new Promise((resolve, reject) => {
            User.update({ _id: user._id }, { role: user.role }, null, (err) => {
                if (err) {
                    return reject(err);
                }

                return resolve();
            });
        });
    }

    function getUserByName(name) {
        return new Promise((resolve, reject) => {
            User.findOne({ email: name })
                .then(user => {
                    if (!user) {
                        return reject(new Error("There is no such User"));
                    }

                    console.log(user.email);
                    return resolve(user);
                });
        });
    }

    function getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        return reject(new Error("There is no such User"));
                    }

                    return resolve(user);
                });
        });
    }

    function getUsers() {
        return new Promise((resolve, reject) => {
            User.find({}, '_id username email')
                .then(users => {

                    return resolve(users);
                });
        });
    }

    function searchUsersByUsername(username, usernamePattern) {

        return new Promise((resolve, reject) => {
            User.find({ 'username': { $regex: usernamePattern, $options: "$i" } }, 'username email avatar')
                .then(users => {
                    if (!users) {
                        return reject(new Error("There is no such User"));
                    }
                    User.findOne({ 'username': username }).then(user => {

                        let usersArray = [];


                        console.log(user.friends);
                        for (let user1 of users) {
                            if (user.username == user1.username) {

                            } else {
                                let newUser = {
                                    username: user1.username,
                                    email: user1.email,
                                    avatar: user1.avatar,
                                    isFriend: false
                                }
                                for (let friend of user.friends) {

                                    if (user1.username == friend.username) {
                                        newUser["isFriend"] = true;
                                    }

                                }
                                usersArray.push(newUser);
                            }
                        }

                        //console.log(usersArray);
                        return resolve(usersArray);
                    });

                });
        });
    }

    function getRequests(username) {
        return new Promise((resolve, reject) => {
            User.find({ "username": username }, "request")
                .then(requests => {

                    let reqArray = [];
                    for (let req of requests) {
                        //console.log(req.request);
                        reqArray = req.request;
                        break;
                    }

                    return resolve(reqArray)
                });
        });
    }

    function getFriends(username) {
        return new Promise((resolve, reject) => {
            User.findOne({ "username": username })
                .then(user => {
                    if (!user) {
                        return reject(new Error("There is no such User"));
                    }
                    let friendsArray = [];
                    for (let friend of user.friends) {
                        let fr = {
                            username: friend.username,
                            email: friend.email,
                            avatar: friend.avatar,
                            isFriend: true
                        };
                        friendsArray.push(fr);

                    }
                    //console.log(friendsArray);
                    return resolve(friendsArray);
                });
        });
    }

   function attachEventToUserAsCreator(username,plannetEvent){
     
     console.log(plannetEvent);
     return new Promise((resolve,reject) => {
         User.findOneAndUpdate({'username':username},
         {$push:{'eventsAsCreator':plannetEvent}},{upsert:true},{new:true},(err,user) => {
             if(!user){
                 return reject(err);
             }
             return resolve(user);
         });
     });
 }

    function updateUserFields(username, updateData) {
        return new Promise((resolve, reject) => {
            User.update({ username: username }, { $set: updateData },
                (err, updatedUser) => {
                    if (err) {
                        console.log(`ERROR WHEN UPDATE USER:${username}`);
                        return reject(err);
                    }

                    console.log(`USER ${username} UPDATED SUCCESSFULLY`);
                    return resolve(updatedUser);
                });
        });
    }

    function updateUser(user) {
        return new Promise((resolve, reject) => {
            user.save(err => {
                if (err) {
                    return reject(err);
                }

                return resolve(user);
            });
        });
    }

    function attachEventToUserAsParticipant(username, event) {

        let eventObj = {
            id: event._id,
            start: event.start,
            end: event.end,
            title: event.title
        };

        return new Promise((resolve, reject) => {
            User.findOneAndUpdate({ 'username': username }, { $push: { 'eventsAsCreator': eventObj } }, { upsert: true }, { new: true }, (err, user) => {
                if (!user) {
                    return reject(err);
                }
                return resolve(user);
            });
        });
    }

    function getUsersEventsAsCreator(username) {
        return new Promise((resolve, reject) => {
            User.findOne({ 'username': username }, (err, user) => {
                if (!user) {
                    return reject(err);
                }

                return resolve(user.eventsAsCreator);
            });
        });
    }

    function getUsersEventsAsParticipant(username) {
        return new Promise((resolve, reject) => {
            User.findOne({ 'username': username }, (err, user) => {
                if (!user) {
                    return reject(err);
                }

                return resolve(user.eventsAsParticipant);
            });
        });
    }

    

    return {
        getUserByName,
        getUserByEmail,
        getUsers,
        registerUser,
        updateUserProfilePicture,
        updateUserInformation,
        updateUserPassword,
        updateUserRole,
        removeRequest,
        addFriend,
        sendFreindRequest,
        readAllFriendRequest,
        searchUsersByUsername,
        getRequests,
        getFriends,
        updateUser,
        updateUserFields,
        attachEventToUserAsCreator,
        attachEventToUserAsParticipant,
        getUsersEventsAsCreator,
        getUsersEventsAsParticipant
    };
};