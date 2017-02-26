const express = require('express');
const path = require('path');
const auth = require('../configurations/auth');
const adminRole = 'Admin';
const passport = require('passport');

module.exports = function ({ app, controllers }) {
    const apiRouter = new express.Router();

    apiRouter.post('/authenticate', passport.authenticate("local",{}), controllers.user.loginUser)
             .post('/register', controllers.user.registerUser)
             .get('/users', controllers.user.getUsers)
             .get('/users/:username', controllers.user.getUserByName)
             .put('/profile/profile-picture',  controllers.user.uploadProfilePicture)
             .put('/profile/password', controllers.user.updatePassword)
             .post('/profile/send-request',controllers.user.sendFriendRequest)
             .post('/profile/add-friend',controllers.user.confirmFriendRequest)
             .put('/profile/deny-request',controllers.user.denyFriendRequest)
             .put('/profile/requests',controllers.user.readAllFriendRequests)
             .get('/users/search/:email',controllers.user.searchUserByEmail)



    app.use('/api', apiRouter);

    app.get('/', function (req, res) {
        res
            .status(200)
            .sendFile(path.join(__dirname, '/../../dist/index.html'));
    });
};