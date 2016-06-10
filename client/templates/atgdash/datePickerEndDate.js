Template.datePickerEndDateTemplate.helpers({
    endDate: function() {
        var _date = new Date();

        if(!Session.get('endDate')) {
            Session.set('endDate', _date);
        }

        return Session.get('endDate');
    },
    endDateISO: function(){
        var _date = Session.get('endDate');
        return _date.toISOString();
    },
    endDateGMT: function(){
        var _date = Session.get('endDate');
        return _date.toGMTString();
    },
    disableEndDate: function(){
        if(Session.get('endDate') >= Session.get('startDate')){
            return true;
        } else {
            return false;
        }
    },
    changeEndDate: function(){
        var self = Template.instance();

        return function(newDate){
            Session.set('endDate', newDate);
        }
    },
    Datepicker: function(){
        return Datepicker;
    }
})