Template.atgEventSelectProduct.onRendered(function() {
    $('select.dropdown').dropdown();
});

Template.atgEventSelectProduct.helpers({
    getAllProducts : function () {
        return products.find();
    }
});

Template.atgEventSelectProduct.events({
    "change select[name=product]" : function (event) {
        atgEventsHelpers.updateEventRelationsipIds("productId", event.target.value);
        $(".ui.dropdown select[name='codename']").dropdown('set selected', products.findOne(event.target.value).codeName);
    },
    "change select[name=codename]" : function (event) {
        atgEventsHelpers.updateEventRelationsipIds("productId", event.target.value);
        $(".ui.dropdown select[name='product']").dropdown('set selected', products.findOne(event.target.value).title);
    },
});