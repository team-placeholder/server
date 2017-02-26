const jsonwebtoken = require('jsonwebtoken');
const atob = require("atob");

module.exports = function ({data, passport, config, fs, path, imageDecoder}) {

  const webTokenSecret = config.webToken;

  function registerUser(req, res) {
    const user = req.body;
    console.log(user);

    data.registerUser(user)
      .then(() => {
        res.status(201);
        return res.json("Successfully registered user.");
      })
      .catch((err) => {
        res.status(400);
        console.log(err.message)
        return res.json(err.message);
      });
  }

  function loginUser(req, res, next) {

    let email = req.body.email;
    let password = req.body.password;

    console.log(email)

    const webTokenObject = {
      email: req.body.email,
      password: req.body.password
    };


   res.status(200).json({
            username: req.body.username,
            email:req.body.email,
            password:req.body.password
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
      const email = req.body.email;
      const imageData = req.body.avatar;
    
              data.getUserByName(email)
                  .then((user) => {
                      return data.updateUserProfilePicture(user, imageData);
                  })
                  .then(() => {
                      res.status(201);
                      return res.json('Profile picture was successfully saved');
                  })
                  .catch((err) => {
                      res.status(400);
                      return res.json('Problem occured with saving the picture. Please try again later.');
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
      console.log(oldPassword);
      console.log(req.user);
      data.getUserByName(req.user.email)
          .then((user) => {
             return data.updateUserPassword(user, oldPassword, newPassword);
          })
          .then(() => {
              res.status(201).json({message:"Successfully changed your password"});
          })
          .catch((err) => {
              res.status(400).json(err);
          });
  }





  function getUserByName(req, res) {
    data.getUserByName(req.params.username)
      .then((user) => {

        let foundUser = {
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          newRequest:user.newRequest
          
        }

        res.status(200).json(foundUser)
      })
      .catch((err) => {

        res.status(404);
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

  function sendFriendRequest(req, res){
    let requester = req.body[0].email;
    let receiver = req.body[1].email;
    
    console.log(requester);
    console.log(receiver);

    data.sendFreindRequest(requester,receiver)
    .then(data => {
      if(!data){
        console.log('This user already has request from you!');
        res.status(401).send({ message: "This user already has request from you!" });
      }else{
        res.status(201).send({succes:true});
      }
    }).catch(err => {
      console.log(err.message);
      res.status(401).send(err.message);
    })
  }

  function confirmFriendRequest(req,res){
    let firstUser = req.body.firstUser;
    let secondUser = req.body.secondUser;

    Promise.all([data.addFriend(firstUser.username,secondUser),
    data.addFriend(secondUser.username,firstUser),
    data.removeRequest(firstUser.username,secondUser.username)
    ])
    .then(([first,second,dbUser])=> {
      if(!dbUser){
          res.status(401).send({});
          return;
      }

           res.status(201).send(dbUser);

    })
    .catch(err => {
      res.status(401).send(err.message)
    })
  }

  function denyFriendRequest(req,res){
    let firstUser = req.body.firstUser;
    let secondUser = req.body.secondUser;

    data.removeRequest(firstUser.username,secondUser.username)
    .then(user => {
      if(!user){
        res.status(401).send({message:"There is problem with your request"})
        return;
      }

      res.status(201).send(user);

    }).catch(err =>{
      res.status(401).send(err.message);
    })
  }

  function readAllFriendRequests(req,res){
    let username = req.body.username;

    data.readAllFriendRequest(username)
    .then(user =>{
      if(!user){
        res.status(401).send({message:"There is problem with your request"});
        return;
      }

       res.status(201).send(user);
    })
    .catch(err => {
      res.status(401).send(err.message);
    });
  }

  function searchUserByEmail(req,res){
    let email = req.params.email;
    data.searchUsersByEmail(email)
    .then(users => {
      if(!users){
        res.status(401).send()
        return;
      }
      
      res.status(200).send(users);

    })
    .catch(err => {
      res.status(401).send(err.message);
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
    searchUserByEmail
  };
};
