const encryption = require("../utils/encryption");

module.exports = function (models) {
  let {User} = models;

  function createNewUser(body) {
    return new Promise((resolve, reject) => {
      const salt = encryption.generateSalt();
      const hashedPassword = encryption.generateHashedPassword(salt, body.password);

      console.log(body.username);
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
          {username: body.username},
          {email: body.email}
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

  function sendFreindRequest(requester,receiver){
    return new Promise((resolve, reject) => {

      User.find({"email": requester},'username email avatar',(err,user) =>{
          if (err) {
                        console.log("pesho")

                        return reject(err);
                    }
            User.findOneAndUpdate(
                { "email": receiver,
                    "request.username": { $ne: user.username }, "friends.username":{$ne: user.username}}, 
                { $addToSet: { "request": user }, $inc: {"newRequest":1} },
                { new: true },
                (err2, dbReq) => {
                    if (err2) {
                        console.log(err2.message)
                        return reject(err2);
                    }
                    return resolve(dbReq);
                });
      })
      
    });
  }

  function readAllFriendRequest(username){
      return new Promise((resolve,reject) => {
          User.findOneAndUpdate({"username":username},
          {$set: {"newRequest": 0}},
          {new: true},
          (err, dbReq) =>{
              if(err){
                  return reject(err);
              }
              return resolve(dbReq);
          });
      });
  }

  function addFriend(username, friend) {
        return new Promise((resolve, reject) => {
            User.findOneAndUpdate(
                { "username": username }, 
                { $push: { "friends": friend } },
                { save: true },
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
            User.findOneAndUpdate(
                { "username": username }, 
                { $pull: { "requests": { "username": requestUsername } } }, 
                { new: true },
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
      User.findOne({email: name})
        .then(user => {
          if (!user) {
            return reject(new Error("There is no such User"));
          }

          return resolve(user);
        });
    });
  }

  function getUserByEmail(email) {
      return new Promise((resolve, reject) => {
        User.findOne({email: email})
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

  function searchUsersByEmail(emailPattern){
      let pattern = '/^'+emailPattern+'/i';
      console.log(pattern);
      return new Promise((resolve,reject) => {
          User.find({'email': {$regex: emailPattern,$options:"$i"}},'username email avatar')
          .then(users => {
              if(!users){
                  return reject(new Error("There is no such User"));
              }
               
               return resolve(users);
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
    searchUsersByEmail
  };
};
