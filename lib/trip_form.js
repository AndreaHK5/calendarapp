if(Meteor.isClient){

  saveTrip = function (date, next) {
    Meteor.call("saveTrip", date, next);
  }

}

if(Meteor.isServer){
  Meteor.methods({
    saveTrip : function (date) {
      //check date!
      Trips.insert({date : date});
      return date;
    }
  });
}