const mongoose = require("mongoose");
const mongooseSchema = mongoose.Schema;



const eventSchema = mongooseSchema({
    title: { type: String, required: true },
    creator: { type: String, required: true },
    start: {},
    end: {},
    date: {},
    slots: { type: Number },
    participants: [String],
    description: { type: String }

});

eventSchema.method({
    isUserIn: function(username) {
        if (this.creator == username) {
            return true;
        }
        let isIn = false;
        for (let par of this.participants) {
            if (par == username) {
                isIn = true;
                break;
            }
        }

        return isIn;
    }
});



const EventM = mongoose.model("event", eventSchema);

module.exports = EventM;