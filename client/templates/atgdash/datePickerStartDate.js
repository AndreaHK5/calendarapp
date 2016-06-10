Template.datePickerStartDateTemplate.helpers({
    startDate: function(){
        var _date = new Date();

        if(!Session.get('startDate')) {
            _date.setDate(_date.getDate()-7);
            Session.set('startDate', _date);
        }

        return Session.get('startDate');
    },
    startDateISO: function(){
        var _date = Session.get('startDate');
        return _date.toISOString();
    },
    startDateGMT: function(){
        var _date = Session.get('startDate');
        return _date.toGMTString();
    },
    disableStartDate: function(){
        if(Session.get('startDate') <= Session.get('endDate')){
            return true;
        } else {
            return false;
        }
    },
    changeStartDate: function(){
        var self = Template.instance();

        return function(newDate){
            Session.set('startDate', newDate)
        }
    },
    Datepicker: function(){
        return Datepicker;
    }
})