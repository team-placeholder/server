module.exports = function({ data }) {

    function createEvent(req, res) {
        const event = req.body;
        event.creator = req.user.username;
        let eventId;

        // if (Date.parse(event.date) <= Date.now()) {
        //     return res.status(401).send({ isSuccesful: "false" });
        // }
        data.createEvent(event)
            .then(event => {
                if (!event) {
                    return res.status(401).send({ message: `Unable to create event!` });
                }

                eventId = event._id;

                return data.getUserByEmail(req.user.email);
            }).then(user => {
                let eventObj = {
                    id: eventId,
                    date: event.date,
                    start: event.start,
                    end: event.end,
                    title: event.title
                };
                console.log(user.events);
                if (!user.events[event.date.year]) {
                    user.events[event.date.year] = {};
                }

                if (!user.events[event.date.year][event.date.month]) {
                    user.events[event.date.year][event.date.month] = {};
                }

                if (!user.events[event.date.year][event.date.month][event.date.day]) {
                    user.events[event.date.year][event.date.month][event.date.day] = [];
                }

                user.events[event.date.year][event.date.month][event.date.day].push(eventObj);
                user.eventsAsCreator.push(eventObj)
                console.log(user.events)

                return data.updateUserFields(user.username, user);
            }).then(user => {
                if (!user) {
                    return res.status(401).send({ isSuccesful: "false" });
                }
                return res.status(201).send({ isSuccesful: "true" });
            });
    }

    function addParticipantToEvent(req, res) {
        console.log(req.body);
        data.addUserToSpecificEvent(req.user.username, req.body.id)
            .then(event => {
                if (!event) {
                    return res.status(401).send({ isSuccesful: "false" });
                }
                let eventObj = {
                    id: event._id,
                    date: event.date,
                    start: event.start,
                    end: event.end,
                    title: event.title
                };
                let user = req.user;
                console.log(user.events);
                if (!user.events[event.date.year]) {
                    user.events[event.date.year] = {};
                }

                if (!user.events[event.date.year][event.date.month]) {
                    user.events[event.date.year][event.date.month] = {};
                }

                if (!user.events[event.date.year][event.date.month][event.date.day]) {
                    user.events[event.date.year][event.date.month][event.date.day] = [];
                }

                user.events[event.date.year][event.date.month][event.date.day].push(eventObj);
                user.eventsAsParticipant.push(eventObj)

                return data.updateUserFields(user.username, user);
            }).then(user => {
                if (!user) {
                    return res.status(401).send({ isSuccesful: "false" });
                }
                return res.status(201).send({ isSuccesful: "true" });
            })
    }

    function getEvent(req, res) {
        let username = req.user.username;
        let eventId = req.params.id;
        data.getEventById(eventId, username)
            .then(ev => {
                if (!ev) {
                    res.status(401).send();
                    return;
                }

                let event = {
                    id: ev._id,
                    title: ev.title,
                    creator: ev.creator,
                    date: ev.date,
                    start: ev.start,
                    end: ev.end,
                    participants: ev.participants,
                    description: ev.description,
                    isUserIn: ev.isUserIn(username)
                };


                res.status(200).send({ message: `event for ${event.date.year}/${event.date.month}/${event.date.day}!`, event });

            });
    }

    function getDailyEvents(req, res) {
        let date = req.body;
        let user = req.user;
        let events = [];

        if (user.events) {
            if (user.events[date.year]) {
                if (user.events[date.year][date.month]) {
                    events = user.events[date.year][date.month][date.day] || [];
                }
            }
        }

        events.sort(function(a, b) {
            if (a.start < b.start) return -1;
            if (a.start > b.start) return 1;
            return 0;
        });

        res.status(200).json({ message: `Events for ${date.year}/${date.month}/${date.day}!`, events });
    }


    return {
        name: 'event',
        getDailyEvents,
        createEvent,
        addParticipantToEvent,
        getEvent

    };
};