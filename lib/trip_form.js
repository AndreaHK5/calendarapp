if(Meteor.isClient){

  saveTrip = function (startDate, next) {
    Meteor.call("saveTrip", startDate, next);
  }

}

if(Meteor.isServer){
  Meteor.methods({
    saveTrip : function (startDate) {
      // TODO check date type here!
      // TODO Trip may eed to be an object rather than parameters passed in
      Trips.insert({startDate : startDate});
      return startDate;
    }
  });
}