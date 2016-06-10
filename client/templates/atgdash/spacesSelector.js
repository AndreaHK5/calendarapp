Template.spacesSelector.helpers({
    spaces: function(){
        return Session.get('supportedSpaces');
    }
});

Template.spacesSelector.rendered = function(){
    $('#supported-spaces').change(function(){
        Session.set('selectedSpaces', $(this).val())
    });
};
