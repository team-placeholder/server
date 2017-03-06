module.exports = function(models) {
    let { EventM } = models;

    function createEvent(event) {
        return new Promise((resolve, reject) => {
            EventM.create({
                    title: event.title,
                    creator: event.creator,
                    start: event.start,
                    end: event.end,
                    date: event.date,
                    description: event.description,
                    slots: event.slots

                })
                .then(event => {
                    return resolve(event);
                })
                .catch(err => {
                    return reject(err);
                });
        });
    }

    function getEventById(id, username) {
        return new Promise((resolve, reject) => {
            EventM.findOne({ _id: id }, (err, event) => {
                if (!event) {
                    return reject(err);
                }
                // let eventObj = {
                //     title: event.title,
                //     creator: event.creator,
                //     date: event.date,
                //     slots: event.slot,
                //     participants: event.participants,
                //     description: event.description,
                //     isUserIn: event.isUserIn(username)
                // }
                return resolve(event);
            });
        });
    }

    function addUserToSpecificEvent(username, eventId) {
        return new Promise((resolve, reject) => {
            EventM.findOneAndUpdate({ '_id': eventId }, { $addToSet: { 'participants': username } }, { new: true }, (err, event) => {
                if (!event) {
                    return reject(err);
                }

                return resolve(event);
            });
        });
    }



    return {
        createEvent,
        getEventById,
        addUserToSpecificEvent
    };
};