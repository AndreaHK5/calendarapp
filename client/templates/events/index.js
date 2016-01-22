Template.eventsIndex.helpers({
	getEvents : function () {
		getEventsNumberInDays(1456819200,1456819200, function (err, res) {
	      if (err) {
	        console.error(err);
	      } else {
	      	console.log(res);
	      }
  		});
	}
});