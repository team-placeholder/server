

module.exports = function (models) {
  let {EventM} = models;

  function createEvent(event){
      return new Promise((resolve,reject) => {
          EventM.create({
              name:event.name,
              creator:event.creator,
              date:event.date,
              description: event.description,
              slots:event.slots

          })
          .then(event =>{
              return resolve(event);
          })
           .catch(err => {
          return reject(err);
        });
      })
  }

  function getEventById(id,username){
      return new Promise((resolve,reject) => {
          EventM.findOne(id,(err,event)=> {
              if(!event){
                 return reject(err);
              }
              let eventObj = {
                name: event.name,
                creator:event.creator,
                date: event.date,
                slots: event.slot,
                participants: event.participants,
                description: event.description,
                isUserIn: event.isUserIn(username)
              }
              return resolve(eventObj);
          });
      });
  }

  function addUserToSpecificEvent(username,eventId){
      return new Promise((resolve, reject) => {
          EventM.findOneAndUpdate({'_id':eventId},
          {$addToSet: {'participants':username},$inc:{'slots':-1}},{new:true},(err,event) => {
              if(!event){
                  return reject(err.message);
              }

              return resolve(event);
          })
      })
  }



  return {
      createEvent,
      getEventById,
      addUserToSpecificEvent
  };
};