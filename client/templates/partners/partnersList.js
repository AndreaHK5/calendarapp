Template.partnersList.onRendered(function (){
    Tracker.afterFlush(function () {
        atgEventsAnimations.sizePageConteiners();
    })
});

Template.partnersList.helpers({
    getAllPartners : function () {
        return partners.find();
    }
});

Template.partnersList.events({
    "click #create-button" : function () {
        atgEventsAnimations.slideOutTop($("#slidable-container")).then(function () {
            Session.set("slideInBottom",true);
            Router.go("partnerCreate");
        });
    },
    "click .partner-card" : function () {
        var id = this._id;
        atgEventsAnimations.slideOutTop($("#slidable-container")).then(function () {
            Session.set("slideInBottom",true);
            Router.go("partnerShow", {_id : id})
        });
    }
})