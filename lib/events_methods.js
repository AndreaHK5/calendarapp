if(Meteor.isClient){
  getAllEvents = function(next){
    Meteor.call("getAllEvents", next);
  };
  getEventsNumberInDays = function (queryStartDate, queryEndDate, next) {
    Meteor.call("getEventsNumberInDays", queryStartDate, queryEndDate, next);
  };
}


// meteor methods rather than allow and deny!
if(Meteor.isServer){
  Meteor.methods({
    getAllEvents : function () {
      return Events.find();
    },
    getEventsNumberInDays : function(queryStartDate, queryEndDate) {
      var eventsPerDay = {};
      // find events in the span
      // iterateh thhrough the event
      // iterate thorugh the days and fill the events per day
      Events.find({ $and :[{startDate : {$lte : queryStartDate}},{endDate : {$gte : queryEndDate}}]})
        .forEach(function (e) {

          // TODO move this to the mongo query! 
          // TODO add unit test of this mostruosity
          var startLoop = moment.max(moment.unix(e.startDate), moment.unix(queryStartDate));
          var endLoop = moment.min(moment.unix(e.endDate), moment.unix(queryEndDate));
          var eventType = e.type;

          for(var m = startLoop; !m.isAfter(endLoop);  m.add('days',1)) {
            var unixDay = m.unix();
            // initailize objects if not present
            if (! (unixDay in eventsPerDay)) { eventsPerDay[unixDay] = {}; } 
            if (! (eventType in eventsPerDay[unixDay])) { eventsPerDay[unixDay][eventType] = 0 }
            eventsPerDay[unixDay][eventType] ++;
          }
        }
      );
      console.log(eventsPerDay);
      return eventsPerDay;
    } 
  })
}






  //  	db.events.aggregate([{$match : { $and :[{startDate : {$lte : 1456819200}},{endDate : {$gte : 1456819200}}]}},{$group: { key : { 'type': 1}, total : {$sum : 1}}}])

//db.events.aggregate([{$match : { $and :[{startDate : {$lte : 1456819200}},{endDate : {$gte : 1456819200}}]}},{$group: {_id : "$type", total : {$sum : 1}}}])

//db.events.aggregate([{$match : { $and :[{startDate : {$lte : 1456819200}},{endDate : {$gte : 1456819200}}]}},{$group: { key : { 'type': 1}, total : {$sum : 1}}}])


