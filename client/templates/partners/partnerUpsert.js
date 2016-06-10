Template.partnerUpsert.onRendered(function () {
    // the same form is used for create and edit,
    // data is passed in for the edit
    if(this.data){
        var data = this.data;
        Tracker.afterFlush(function() {
            prePopulateForm(data);
        })
    } else {
        Session.set("partner",{
            partnerTypeIds : [],
            locations: [ {isPrimaryLocation : false}]
        });
    }

    Tracker.afterFlush(function () {
        $('.ui.checkbox').checkbox();
        atgEventsAnimations.sizePageConteiners();
    })
});

Template.partnerUpsert.helpers({
    isEditing : function () {
        return Router.current().route.getName() == "partnerEdit";
    },
    getAllPartnerTypes : function () {
        return partnerTypes.find();
    },
    getLocations : function() {
        if (!Session.get("partner")) { return; }
        return Session.get("partner").locations;
    },
    images : function () {
        if (!Session.get("partner") || !("images" in Session.get("partner"))) { return; }
        return Session.get("partner").images;
    },
    associateToPartner : function () {
        return {
            finished : function (index, fileInfo, context) {
                fileInfo.url = fileInfo.baseUrl + fileInfo.name;

                var images = Session.get("partner").images;
                if (!images) { images = []; }
                images.push({url : fileInfo.url});
                updatePartner("images", images);
            }
        }
    },
    pictureToRemove : function () {
        return Session.get("pictureToRemove");
    }
});

Template.partnerUpsert.events({
    "keyup input[name=companyName]" : function (event) {
        if(event.keyCode == 9 ) {return;}
        updatePartner("companyName", event.target.value);
    },
    "keyup input[name=description]" : function (event) {
        if(event.keyCode == 9 ) {return;}
        updatePartner("description", event.target.value);
    },
    "click .remove-role" : function () {
        var partnerTypeIds = _.without(Session.get("partner").partnerTypeIds, this._id);
        updatePartner(("partnerTypeIds"), partnerTypeIds);
    },
    "keyup .location-field" : function (event) {
        if(event.keyCode == 9 ) {return;}
        var field = event.target.name.slice(event.target.name.indexOf('-') + 1);
        var locations = Session.get("partner").locations;
        locations[$(".location-field").has(event.target).index()][field] = event.target.value;
        updatePartner("locations", locations);
    },
    "change .location-field .toggle.checkbox" : function () {
        if(event.type != 'click') { return; }
        var locations = Session.get("partner").locations;
        // TODO find a better way to find the index
        var locationIndex = $(".location-field").has(event.target).index();
        locations[locationIndex].isPrimaryLocation = $(event.currentTarget).checkbox("is checked");
        updatePartner("locations", locations);
    },
    "change .partnerTypeIds .checkbox" : function () {
        if(event.type != 'click') { return; }
        var partnerTypeIds = Session.get("partner").partnerTypeIds;
        if (_.contains(partnerTypeIds, this._id)) {
            partnerTypeIds = _.without(partnerTypeIds, this._id);
        } else {
            partnerTypeIds.push(this._id);
        };
        updatePartner("partnerTypeIds", partnerTypeIds);
    },
    "click .location-delete" : function () {
        var locationIndex = $(".location-field").has(event.target).index();
        var locations = Session.get("partner").locations;
        locations.splice(locationIndex, 1);
        updatePartner("locations", locations);
    },
    "click .location-add" : function () {
        var locations = Session.get("partner").locations;
        locations.push({isPrimaryLocation: false});
        updatePartner("locations", locations);
        Tracker.afterFlush(function () {
            $('.ui.checkbox').checkbox();
        })
    },
    "click .add-role" : function () {
        var partnerTypeIds = Session.get("partner").partnerTypeIds;
        partnerTypeIds.push(this._id)
        updatePartner(("partnerTypeIds"), partnerTypeIds);
    },
    "keydown .save" : function (event){
        if (event.keyCode == 13) {
            save();
        }
    },
    "click .save" : function (){
        save();
    },
    "keydown .cancel" : function (event){
        if (event.keyCode == 13) {
            back(this._id);
        }
    },
    "click .cancel" : function (){
        back(this._id);
    },
    "click .drop-changes" : function (){
        var partner = partners.findOne({ _id : Session.get("partner")._id});
        Session.set("partner", partner);
        Tracker.afterFlush(function () {
            Session.get("partner");
            prePopulateForm(partner);
        })
    },
    "keydown .drop-changes" : function (event){
        if (event.keyCode == 13) {
            prePopulateForm(partners.findOne({ _id : Session.get("partner")._id}));
        }
    },
    "click .remove-image" : function () {
        Session.set("pictureToRemove", this.url);

        $(".remove-image-modal").modal({
            onApprove : function () {
                var images = Session.get("partner").images;
                images = _.filter(Session.get("partner").images, function (e) { return e.url !=  Session.get("pictureToRemove")});
                updatePartner("images", images );
                sAlert.info("Image removed");
            }
        }).modal("show");
    }
});

function save() {
    if(!validateForm()) { return };
    upsertPartner(Session.get("partner"),
        function (err, res) {
            if (err){
                sAlert.error("woha, something is wrong here " + err);
                return;
            }
            atgEventsAnimations.slideOutTop($("#slidable-container")).then(function () {
                Router.go("partnersList");
                sAlert.success("Partner saved!");
                Session.set("slideInBottom", true);
            })
        })
}

function updatePartner(field, value) {
    var partner = Session.get("partner");
    partner[field] = value;
    Session.set("partner", partner);
    clearValidations();
}

function prePopulateForm(data) {
    Session.set("partner", data);
    $("input[name=description]").val(data.description);
    $("input[name=companyName]").val(data.companyName);
    clearValidations();

    for (var i = 0; i < data.partnerTypeIds.length ; i++) {
        $("div[name=" + data.partnerTypeIds[i] + "].ui.checkbox").checkbox("set checked");
    }

    for(var i = 0; i < data.locations.length; i ++) {
        $(".location-fields > div:nth-of-type(" + (i + 1) +") input[name=location-title]").val(data.locations[i].title);
        $(".location-fields > div:nth-of-type(" + (i + 1) +") input[name=location-addressOne]").val(data.locations[i].addressOne);
        $(".location-fields > div:nth-of-type(" + (i + 1) +") input[name=location-addressTwo]").val(data.locations[i].addressTwo);
        $(".location-fields > div:nth-of-type(" + (i + 1) +") input[name=location-addressThree]").val(data.locations[i].addressThree);
        $(".location-fields > div:nth-of-type(" + (i + 1) +") input[name=location-city]").val(data.locations[i].city);
        $(".location-fields > div:nth-of-type(" + (i + 1) +") input[name=location-state]").val(data.locations[i].state);
        $(".location-fields > div:nth-of-type(" + (i + 1) +") input[name=location-postalCode]").val(data.locations[i].postalCode);
        $(".location-fields > div:nth-of-type(" + (i + 1) +") input[name=location-country]").val(data.locations[i].country);
        data.locations[i].isPrimaryLocation ?
            $(".location-fields > div:nth-of-type(" + (i + 1) +") .ui.checkbox").checkbox("check") :
            $(".location-fields > div:nth-of-type(" + (i + 1) +") .ui.checkbox").checkbox("uncheck");
    }
}

function clearValidations() {
    $('.form div').find('.error').removeClass('error');
    $('.form').find('.field.error').removeClass('error');
    $('.ui.error.message').empty();
    $(".location-field").removeClass("orange");
}

function validateForm(){
    clearValidations();
    var errors = [];
    var requiredFields = ["companyName","description"];
    var requiredFieldsInLocations = ["title","addressOne", "city", "state", "country", "postalCode"];
    var partner = Session.get("partner");
    // fields
    for ( i = 0; i< requiredFields.length; i ++ ) {
        var requiredField = requiredFields[i];
        if (partner[requiredField] == "" || !(requiredField in partner)) {
            errors.push(requiredField + " is required");
            $(".ui.form").find(".field").has("input[name=" + requiredField +"]").addClass("error")
        }
    }

    if (partner["partnerTypeIds"].length == 0) {
        errors.push("role is required.")
        $(".ui.form").find(".field").has(".partnerTypeIds").addClass("error")
    }

    // locations
    var locations = partner.locations;
    if (locations.length == 0) {
        errors.push("please provide a location");
    }
    for (var i = 0; i < locations.length; i++ ){
        var location = locations[i];
        for(var j = 0; j< requiredFieldsInLocations.length; j ++) {
            var requiredField = requiredFieldsInLocations[j];
            if (location[requiredField] == "" || !(requiredField in location)) {
                errors.push(requiredField + " is empty for location n. " + (i + 1));
                $($(".location-field")[i]).addClass("orange");
                $($(".location-field")[i]).find(".field").has("input[name=location-" + requiredField +"]").addClass("error")
            }
        }
    }
    // manually adding the errors
    if (errors.length > 0) {
        $(".ui.form").addClass("error");
        $(".ui.error.message").append("<ul class='list'></ul>")
        for (var i = 0; i < errors.length; i++){
            $(".ui.error.message .list").append("<li>"+ errors[i]+"</li>")
        }
    }

    return errors.length == 0;
}

function back(_id) {
    atgEventsAnimations.slideOutBottom($("#slidable-container")).then(function () {
        if (_id) {
            Router.go("partnerShow", {_id : _id});
        } else {
            Router.go("partnersList");
        }
        Session.set("slideInTop", true);
    });
}