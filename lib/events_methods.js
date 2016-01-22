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
    },
    getDayEvents : function(queryStartDate, queryEndDate) {
    	var events =  Eventsvents.find({ $and :[{startDate : {$lte : queryStartDate}},{endDate : {$gte : queryEndDate}}]});

    	var eventsPerDay = {};
    	// TODO move this to the mongo query! 
    	// Iterateh through events
    	_.each(events, function (e) {
    		// iterate thorugh days in teh event
    		// make sure to cut the part of the event that is outside the query
    		var startLoop = moment.maximum(moment.unix(e.startDate), moment.unix(queryStartDate));
    		var endLoop = moment.minimum(moment.unix(e.endDate), moment.unix(queryEndDate));

    		for(var m = startLoop; !m.isAfter(endLoop);  m.add('days', 1)) {

    		}
    	});
    } 
  })
}

  //  	db.events.aggregate([{$match : { $and :[{startDate : {$lte : 1456819200}},{endDate : {$gte : 1456819200}}]}},{$group: { key : { 'type': 1}, total : {$sum : 1}}}])

//db.events.aggregate([{$match : { $and :[{startDate : {$lte : 1456819200}},{endDate : {$gte : 1456819200}}]}},{$group: {_id : "$type", total : {$sum : 1}}}])

//db.events.aggregate([{$match : { $and :[{startDate : {$lte : 1456819200}},{endDate : {$gte : 1456819200}}]}},{$group: { key : { 'type': 1}, total : {$sum : 1}}}])


