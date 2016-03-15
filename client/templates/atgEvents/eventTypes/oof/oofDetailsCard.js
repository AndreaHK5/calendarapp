Template.oofDetailsCard.onRendered(function () {
    this.autorun(function () {
        Session.get("popupAdded");
        Tracker.afterFlush(function () {
            $('.ui.image').popup();
        })
    });
});