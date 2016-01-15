Template.tripsCreate.onRendered(function (){
    Session.set("startDate", undefined);
    Session.set("endDate", undefined);
})

Template.tripsCreate.helpers({
  datesMissing : function () {
    return datesMissing();
  }
});


function datesMissing() {
  return !Session.get("startDate") || !Session.get("endDate");
} 