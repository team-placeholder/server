module.exports = function({ data }) {
    function getDailyEvents(req, res) {
        let date = req.body;
        let user = req.user;
        let events = [{
            start: '11:30',
            end: '23:59',
            title: 'Finish Calendar!',
            description: 'Must finish calendar functionality for displaying events!'
        }];

        if (user.events) {
            if (user.events[date.year]) {
                if (user.events[date.year][date.month]) {
                    events = user.events[date.year][date.monnth][date.day] || [];
                }
            }
        }


        res.status(200).json({ message: `events for ${date.year}/${date.month}/${date.day}!`, events });
    }


    return {
        name: 'events',
        getDailyEvents
    };
};