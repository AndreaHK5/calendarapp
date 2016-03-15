
//if (Meteor.isClient) {
    // TODO consider a module instead
    atgEventsServerHelpers = {};

    atgEventsServerHelpers.getEngagementSchema = function () {
        return {
            "title": {
                "type": "String",
                "max": 100
            },
            "type": {
                "type": "String",
                "max": 100
            },
            "description": {
                "type": "String"
            },
            "platform": {
                "type": "String",
                "min": 3,
                "optional": true
            },
            "visiting": {
                "type": "Object",
                "optional": true
            },
            "visiting.location": {
                "type": "String"
            },
            "visiting.name": {
                "type": "String"
            },
            "engineersGoing": {
                "type": "[Object]",
                "minCount": 1
            },
            "engineersGoing.$.id": {
                "type": "String",
                "minCount": 6
            },
            "dam": {
                "type": "Object"
            },
            "dam.id": {
                "type": "String",
                "min": 6
            },
            "goals": {
                "type": "[String]",
                "minCount": 1
            }
        };
    }

    atgEventsServerHelpers.getOofSchema = function () {
        return {
            "personId" : {
                "type" : "String"
            },
            "message" : {
                "type" : "String"
            }
        };
    }

    atgEventsServerHelpers.getProductLaunchSchema = function () {
        return {
            "message" : {
                "type" : "String"
            }
        };
    }
//}