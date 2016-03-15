Template.twoDatesPicker.onRendered(function () {
    $( "#startDate" ).datepicker();
    $( "#endDate" ).datepicker();

    $( "#startDate" ).datepicker("setDate", moment(Session.get("startDate")).format("MM/DD/YYYY"));
    $( "#endDate" ).datepicker("setDate", moment(Session.get("endDate")).format("MM/DD/YYYY"));
});

Template.twoDatesPicker.events({
    'change #startDate' : function (event) {
        var st = event.target.value;
        var date = moment([st.split("/")[2],st.split("/")[0]-1, st.split("/")[1]]).startOf("day");
        if (date.isAfter(moment(Session.get("endDate")))){
            sAlert.warning("start date after end date??");
            $( "#startDate" ).datepicker("setDate", moment(Session.get("startDate")).format("MM/DD/YYYY"));
            return;
        }
        Session.set("startDate", date.toISOString());
    },
    'change #endDate' : function (event) {
        var st = event.target.value;
        var date = moment([st.split("/")[2],st.split("/")[0]-1, st.split("/")[1]]).endOf("day");
        if (date.isBefore(moment(Session.get("startDate")))){
            sAlert.warning("end date before start date??");
            $( "#endDate" ).datepicker("setDate", moment(Session.get("endDate")).format("MM/DD/YYYY"));
            return;
        }
        Session.set("endDate", date.toISOString());
    }
});


