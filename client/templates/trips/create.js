Template.tripsCreate.onRendered(function (){
    Session.set("startDate", undefined);
    Session.set("endDate", undefined);
})

Template.tripsCreate.helpers({
  datesMissing : function () {
    return datesMissing();
  },
  detailsMissing : function () {
  	return !Session.get("formValid");
  },
  	getEventDetails : function () {
		return Session.get("eventDetails");
	}
});

function datesMissing() {
  return !Session.get("startDate") || !Session.get("endDate");
}