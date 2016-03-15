Meteor.publish("engineers", function (queryStartDate, queryEndDate) {
    return people.find({$and : [
            { personTypeIds : personTypes.findOne({title : "Engineer"})["_id"] },
            { isMsStaff : true }
        ]
    });
});

Meteor.publish("dams", function (queryStartDate, queryEndDate) {
    return people.find({$and : [
        { personTypeIds : personTypes.findOne({title : "Dam"})["_id"] },
        { isMsStaff : true }
    ]
    });
});

Meteor.publish("personTypes", function (queryStartDate, queryEndDate) {
    return personTypes.find({$or : [
        { title : "Dam" },
        { title : "Engineer" }
    ]
    });
});