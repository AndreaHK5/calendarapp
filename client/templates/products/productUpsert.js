Template.productUpsert.onRendered(function () {
    $(".ui.dropdown").dropdown();

    if (this.data) {
        Session.set("product", this.data);
        prePopulateForm(this.data);
    } else {
        Session.set("product", {});
    }
    formValidations();

    Tracker.afterFlush(function () { atgEventsAnimations.sizePageConteiners() });

    // modal callbacks
    this.autorun(function () {
        Session.get("matchingProducts");
        Tracker.afterFlush(function () {
            $(".edit-product").popup({ distanceAway: 10 });
            $(".edit-product").click(function (e) {
                $(".existing-products").modal("hide");
                var id = e.target.attributes.value.value;
                atgEventsAnimations.slideOutTop($("#slidable-container")).then(function () {
                    atgEventsAnimations.slideInBottom($("#slidable-container"));
                    Router.go("productEdit", {_id : id});
                    //prePopulateForm(products.findOne({ _id: id }));
                })
            });
        })
    })
});

Template.productUpsert.helpers({
    getDevelopers: function () {
        var developerType = partnerTypes.findOne({ title: "Developer" });
        if (!developerType) { return; }
        return partners.find({ partnerTypeIds: developerType["_id"] });
    },
    getPublishers: function () {
        var publisherType = partnerTypes.findOne({ title: "Publisher" });
        if (!publisherType) { return; }
        return partners.find({ partnerTypeIds: publisherType["_id"] });
    },
    getAllPeople: function () {
        return people.find();
    },
    isEditing: function () {
        return Router.current().route.getName() == "productEdit";
    },
    getMatchingProducts: function () {
        return Session.get("matchingProducts");
    },
    images: function () {
        if (!Session.get("product") || !("images" in Session.get("product"))) { return; }
        return Session.get("product").images;
    },
    associateToProduct: function () {
        return {
            finished: function (index, fileInfo, context) {
                fileInfo.url = fileInfo.baseUrl + fileInfo.name;

                var images = Session.get("product").images;
                if (!images) { images = []; }
                images.push({ url: fileInfo.url });
                updateProduct("images", images);
            }
        }
    },
    pictureToRemove: function () {
        return Session.get("pictureToRemove");
    }
});

Template.productUpsert.events({
    "keyup input[name=title]": function (event) {
        if (event.keyCode == 9) { return; }

        if (event.target.value.length == 3 && Router.current().route.getName() != "productEdit") {
            var matches = products.find({ title: { $regex: ".*" + event.target.value + ".*", $options: 'i' } }).fetch();
            if (matches.length > 0) {
                Session.set("matchingProducts", matches);
                $(".existing-products").modal("show");
            }
        }
        updateProduct("title", event.target.value);
    },
    "keyup input[name=codeName]": function (event) {
        if (event.keyCode == 9) { return; }
        if (event.target.value.length == 3 && Router.current().route.getName() != "productEdit") {
            var matches = products.find({ codeName: { $regex: ".*" + event.target.value + ".*", $options: 'i' } }).fetch();
            if (matches.length > 0) {
                Session.set("matchingProducts", matches);
                $(".existing-products").modal("show");
            }
        }
        updateProduct("codeName", event.target.value);
    },
    "keyup input[name=description]": function (event) {
        if (event.keyCode == 9) { return; }
        updateProduct("description", event.target.value);
    },
    "change select[name=developers]": function (event) {
        var partners = $(".ui.form")
            .find('[name="developers"] option:selected')
            .map(function (e, v) { return v.value; }).get();
        updateProduct("developers", partners);
        clearValidations();
    },
    "change select[name=publishers]": function (event) {
        var partners = $(".ui.form")
            .find('[name="publishers"] option:selected')
            .map(function (e, v) { return v.value; }).get();
        updateProduct("publishers", partners);
    },
    "change select[name=team]": function (event) {
        var team = $(".ui.form")
            .find('[name="team"] option:selected')
            .map(function (e, v) { return v.value; }).get();
        updateProduct("team", team);
    },
    "click .cancel": function () {
        atgEventsAnimations.slideOutBottom($("#slidable-container")).then(function () {
            Router.go("productsList");
            Session.set("slideInTop", true);
        });
    },
    "keydown .cancel": function (event) {
        if (event.keyCode == 13) {
            atgEventsAnimations.slideOutBottom($("#slidable-container")).then(function () {
                Router.go("productsList");
                Session.set("slideInTop", true);
            });
        }
    },
    "click .save-product": function () {
        saveProduct();
    },
    "keydown .save-product": function (event) {
        if (event.keyCode == 13) {
            saveProduct();
        }
    },
    "submit .ui.form": function (event) {
        event.preventDefault();
        clearValidations();
    },
    "click .remove-image": function () {
        Session.set("pictureToRemove", this.url);

        $(".remove-image-modal").modal({
            onApprove: function () {
                var images = Session.get("product").images;
                images = _.filter(Session.get("product").images, function (e) { return e.url != Session.get("pictureToRemove") });
                updateProduct("images", images);
                sAlert.info("Image removed");
            }
        }).modal("show");
    }
});

function updateProduct(field, value) {
    var product = Session.get("product");
    product[field] = value;
    Session.set("product", product);
    clearValidations();
}

function saveProduct() {
    $('.ui.form').form('validate form');
    if (!$('.ui.form').form('is valid')) { return };

    // todo find if the SimpleSchema uniqueness error message can be leveraged here (does not seem working).
    // https://github.com/aldeed/meteor-simple-schema/issues/72
    //SimpleSchema.messages({
    //    notUnique : "[label] is a not valid ([value] already exists)"
    //});
    if (! Router.current().route.getName() == "productEdit") {
        if (
            products.findOne({ title : Session.get("product").title}) ||
            products.findOne({ codeName : Session.get("product").codeName})) {
            sAlert.error("title and code name must be unique");
            return;
        }
    }

    upsertProduct(Session.get("product"),
        function (err, res) {
            if (err) {
                sAlert.error("woha, something is wrong here " + err);
                return;
            }
            atgEventsAnimations.slideOutTop($("#slidable-container")).then(function () {
                Router.go("productsList");
                sAlert.success("Product saved!");
                Session.set("slideInBottom", true);
            })
        })
}

function clearValidations() {
    $('.form div').find('.error').removeClass('error');
    $('.form').find('.field.error').removeClass('error');
    $('.ui.error.message').empty();
}

function prePopulateForm(data) {
    Session.set("product", data);
    $("input[name=description]").val(data.description);
    $("input[name=title]").val(data.title);
    $("input[name=codeName]").val(data.codeName);
    $("select[name=developers]").dropdown("clear");
    $("select[name=developers]").dropdown("set selected", data.developers);
    $("select[name=publishers]").dropdown("clear");
    $("select[name=publishers]").dropdown("set selected", data.publishers);
    if (data.team) {
        $("select[name=team]").dropdown("clear");
        $("select[name=team]").dropdown("set selected", data.team);
    }
}

function formValidations() {
    $('.ui.form').form({
        keyboardShortcuts: false,
        fields: {
            title: {
                identifier: 'title',
                rules: [
                    {
                        type: 'empty',
                        prompt: 'Product needs a TITLE'
                    }
                ]
            },
            codeName: {
                identifier: 'codeName',
                rules: [
                    {
                        type: 'empty',
                        prompt: 'Product needs a CODENAME'
                    }
                ]
            },
            description: {
                identifier: 'description',
                rules: [
                    {
                        type: 'empty',
                        prompt: 'A few words for DESCRIPTION'
                    }
                ]
            },
            developers: {
                identifier: 'developers',
                rules: [
                    {
                        type: 'minCount[1]',
                        prompt: "Who's the DEVELOPER"
                    }
                ]
            },
            publishers: {
                identifier: 'publishers',
                rules: [
                    {
                        type: 'minCount[1]',
                        prompt: "Who's the PUBLISHER"
                    }
                ]
            }
        }
    })
}