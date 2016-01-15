if(Meteor.isClient){

  saveTrip = function (startDate, endDate, next) {
    Meteor.call("saveTrip", startDate, endDate, next);
  }

}

if(Meteor.isServer){
  Meteor.methods({
    saveTrip : function (startDate, endDate) {
      // TODO check date type here!
      // TODO Trip may eed to be an object rather than parameters passed in
      Trips.insert({startDate : startDate, endDate : endDate});
      return {startDate : startDate, endDate: endDate };
    }
  });
}