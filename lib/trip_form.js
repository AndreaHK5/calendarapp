if(Meteor.isClient){

  saveTrip = function (startDate, next) {
    Meteor.call("saveTrip", startDate, next);
  }

}

if(Meteor.isServer){
  Meteor.methods({
    saveTrip : function (startDate) {
      // TODO check date type here!
      Trips.insert({startDate : startDate});
      return startDate;
    }
  });
}