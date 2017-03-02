const mongoose = require("mongoose");
const mongooseSchema = mongoose.Schema;



const eventSchema = mongooseSchema({
      name: { type: String, required: true },
      creator:{ type:String, required:true},
      date: {type: Date, min: [Date.now, 'You cannot travel in the past']},
      slots: {type: Number, min: 1},
      participants: [String],
      description: {type: String}

});

eventSchema.method({
    isUserIn: function (username) {
     if(this.creator == username){
           return true;
     }
     let isIn = false;
     for(let par of this.participants){
         if(par.username == username){
               isIn = true;
               break;
         }
     }

     return isIn;
    }
});



const EventM = mongoose.model("event", eventSchema);

module.exports = EventM;


