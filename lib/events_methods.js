if(Meteor.isClient){
  getAllEvents = function(next){
    Meteor.call("getAllEvents", next);
  };
}


// meteor methods rather than allow and deny!
if(Meteor.isServer){
  Meteor.methods({
    getAllEvents : function () {
      return Events.find();
    }
  })
}

