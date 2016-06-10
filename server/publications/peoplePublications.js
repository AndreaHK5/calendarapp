Meteor.publish("engineers", function () {
    return people.find({$and : [
            { personTypeIds : personTypes.findOne({title : "Engineer"})["_id"] },
            { isMsStaff : true }
        ]
    });
});

Meteor.publish("dams", function () {
    return people.find({$and : [
        { personTypeIds : personTypes.findOne({title : "Dam"})["_id"] },
        { isMsStaff : true }
    ]
    });
});

Meteor.publish("personTypes", function () {
    return personTypes.find({$or : [
        { title : "Dam" },
        { title : "Engineer" }
    ]
    });
});