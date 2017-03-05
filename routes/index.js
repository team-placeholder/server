const express = require('express');
const path = require('path');
const auth = require('../configurations/auth');
const adminRole = 'Admin';
const passport = require('passport');

module.exports = function({ app, controllers }) {
    const apiRouter = new express.Router();

    apiRouter.post('/authenticate', passport.authenticate("local", {}), controllers.user.loginUser)
        .post('/register', controllers.user.registerUser)
        .get('/users', controllers.user.getUsers)
        .get('/users/:username', controllers.user.getUserByName)
        .put('/profile/profile-picture', controllers.user.uploadProfilePicture)
        .put('/profile/password', controllers.user.updatePassword)
        .post('/profile/send-request', controllers.user.sendFriendRequest)
        .post('/profile/add-friend', controllers.user.confirmFriendRequest)
        .put('/profile/deny-request', controllers.user.denyFriendRequest)
        .put('/profile/requests', controllers.user.readAllFriendRequests)
        .post('/profile/events', controllers.event.getDailyEvents)
        .get('/users/search/:username', controllers.user.searchUsersByUsername)
        .get("/profile/get-requests", controllers.user.getRequests)
        .get("/profile/friends", controllers.user.getFriends)
        .get("/porfile/get-event-as-creator", controllers.user.getEventsAsCreator)
        .get("/porfile/get-event-as-participant", controllers.user.getEventsAsParticipant)
        .get("/events/:id", controllers.event.getEvent)
        .put("/events/join", controllers.event.addParticipantToEvent)
        .post('/events/create', controllers.event.createEvent)
        .get('/events/:id', controllers.event.getEvent)
        .get('/profile/get-user-info', controllers.user.getProfileData)
        .get('/friend/events/:username',controllers.user.getUsersEvents);


    app.use('/api', apiRouter);
};