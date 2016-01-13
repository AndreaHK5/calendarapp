Template.month.helpers({
  isSelectedStartDate : function () {
    return Session.get("startDate") == this.fullDate;
  }
})