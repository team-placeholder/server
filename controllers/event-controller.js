module.exports = function({ data }) {

function createEvent(req, res) {
      const event = req.body;

      data.createEvent(req.body)
      .then(event =>{
          if(!event){
             return res.status(401).send({isSuccesful:"false"});
          }
          data.attachEventToUserAsCreator(req.user.username,event)
          .then(user => {
              if(!user){
                    return res.status(401).send({isSuccesful:"false"});
              }
               return res.status(201).send({isSuccesful:"true"});
          })
      })
    }

function addParticipantToEvent(req,res){
    data.addUserToSpecificEvent(req.user.username,req.body.eventId)
    .then(event => {
        if(!event){
             return res.status(401).send({isSuccesful:"false"});
        }
        data.attachEventToUserAsParticipant(req.user.username,event)
        .then(user => {
            if(!user){
                 return res.status(401).send({isSuccesful:"false"});
            }

             return res.status(201).send({isSuccesful:"true"});
        })
    })
}

function getEvent(req,res){
    let username = req.user.username;
    let eventId = req.params.id;

    data.getEventById(eventId,username)
    .then(event => {
        if(!event){
             res.status(401).send()
             return;
        }

        res.status(200).send(event);

    })
}


    return {
        name: 'event',
        createEvent,
        addParticipantToEvent,
        getEvent

    };
};