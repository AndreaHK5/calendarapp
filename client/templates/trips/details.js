Template.eventDetails.helpers({
  getEngineers : function () {
  	getAllEngineers(function (err,res) {
  		Session.set("allEngineers", res);
  		console.log(res)
  		return res;
  	})
  }

})


Template.eventDetails.events({

})