Template.atgEventsTwoDatesPicker.onRendered(function () {
    $( "#startDate" ).datepicker();
    $( "#endDate" ).datepicker();

    this.autorun(function () {
        if (!Session.get("newAtgEvent")) { return; }

        $( "#startDate" ).datepicker("setDate", moment(Session.get("newAtgEvent").startDate).format("MM/DD/YYYY"));
        $( "#endDate" ).datepicker("setDate", moment(Session.get("newAtgEvent").endDate).format("MM/DD/YYYY"));
    });
    formValidations ();
});



Template.atgEventsTwoDatesPicker.events({
    'change #startDate' : function (event) {
        var st = event.target.value;
        var date = moment([st.split("/")[2],st.split("/")[0]-1, st.split("/")[1]]).startOf("day");
        if (!date.isValid()) {
            sAlert.warning("Invalid date");
            $( "#startDate" ).datepicker("setDate", moment(Session.get("newAtgEvent").startDate).format("MM/DD/YYYY"));
            return ;
        }
        if (date.isAfter(moment(Session.get("newAtgEvent").endDate))){
            sAlert.warning("start date after end date??");
            $( "#startDate" ).datepicker("setDate", moment(Session.get("newAtgEvent").startDate).format("MM/DD/YYYY"));
            $( "#startDate").blur();
            return;
        }
        atgEventsTemplateHelpers.updateEvent("startDate", date.toISOString());
    },
    'change #endDate' : function (event) {
        var st = event.target.value;
        var date = moment([st.split("/")[2],st.split("/")[0]-1, st.split("/")[1]]).endOf("day");
        if (!date.isValid()) {
            sAlert.warning("Invalid date");
            $( "#endDate" ).datepicker("setDate", moment(Session.get("newAtgEvent").endDate).format("MM/DD/YYYY"));
            return ;
        }
        if (date.isBefore(moment(Session.get("newAtgEvent").startDate))){
            sAlert.warning("end date before start date??");
            $( "#endDate" ).datepicker("setDate", moment(Session.get("newAtgEvent").endDate).format("MM/DD/YYYY"));
            $( "#endDate").blur();
            return;
        }
        atgEventsTemplateHelpers.updateEvent("endDate", date.toISOString());
    }
});


function formValidations () {
    var newFields = {
        startDate: {
            identifier: 'startDate',
            rules: [
                {
                    type   : 'empty',
                    prompt : 'Need START DATE'
                }
            ]
        },
        endDate: {
            identifier: 'endDate',
            rules: [
                {
                    type   : 'empty',
                    prompt : 'We need END DATE'
                }
            ]
        },
    };

    atgEventsTemplateHelpers.addValidationsToForm(newFields);
}
