// ***** Users
Meteor.startup(function() {
    if (Meteor.users.find().count() === 0) {
        Accounts.createUser({
            username: 'claudia',
            email: 'claudia@onceUponInW.com',
            password: 'pass123'
        });
    }
});

// ***** partnerType
if (partnerTypes.find().count() === 0 ) {
    var partnerTypesSeed = [
        { title : "Developer", description : "From Seeds"},
        { title : "Publisher", description : "From Seeds"}
    ]

    _.each(partnerTypesSeed, function (pt) {
        partnerTypes.insert(pt);
        console.log("partner type inserted in db ", pt.title);
    });
}

// *** partners
if (partners.find().count() === 0) {
    var developerTypeId = partnerTypes.findOne({ title: "Developer"})["_id"];
    var publisherTypeId = partnerTypes.findOne({ title: "Publisher"})["_id"];
    var location = {
        title: "trial location",
        addressOne: "trial location",
        city: "trial location",
        state: "trial location",
        postalCode: "trial location",
        country: "trial location",
        isPrimaryLocation: true
    }
    var partnersSeed = [
        {
            companyName : "Bethesda",
            partnerTypeIds : [developerTypeId],
            description : "some description here",
            locations: [location]
        },
        {
            companyName : "Electronic Arts",
            partnerTypeIds : [developerTypeId],
            description : "some description here",
            locations: [location]
        },
        {
            companyName : "Bungie",
            partnerTypeIds : [developerTypeId],
            description : "some description here",
            locations: [location]
        },
        {
            companyName : "Ubisoft",
            partnerTypeIds : [publisherTypeId],
            description : "some description here",
            locations: [location]
        },
        {
            companyName : "Blizzard",
            partnerTypeIds : [publisherTypeId],
            description : "some description here",
            locations: [location]
        },
        {
            companyName : "Activision",
            partnerTypeIds : [publisherTypeId],
            description : "some description here",
            locations: [location]
        }
    ]

    _.each(partnersSeed, function (p) {
        partners.insert(p);
        console.log("partner inserted in db ", p.companyName );
    })
}


// **** person type
if (personTypes.find().count() === 0 ) {
    var personTypesSeed = [
        { title : "Engineer", description : "From Seeds"},
        { title : "Dam", description : "From Seeds"},
    ]

    _.each(personTypesSeed, function (pt) {
        personTypes.insert(pt);
        console.log("person type inserted in db ", pt.title);
    });
}

// **** persons
if (people.find().count() === 0) {
    var engId = personTypes.findOne({title : 'Engineer'})["_id"];
    var damId = personTypes.findOne({title : 'Dam'})["_id"];


    var peopleSeed = [
        {
            personTypeIds: [engId, damId],
            firstName: "Harmonica",
            lastName: "Bronson",
            description: "plays the harmonica",
            isMsStaff : true,
           'picture' : "eng_Placeholder.jpeg",
        },
        {
            personTypeIds: [engId, damId],
            firstName: "Lee",
            lastName: "VanCleef",
            description: "He is Bad @$$",
            isMsStaff : true,
           'picture' : "eng_Placeholder.jpeg",
        },
        {
            personTypeIds: [engId, damId],
            firstName: "Claudia",
            lastName: "Cardinale",
            description: "at the end she wins",
            isMsStaff : true,
           'picture' : "eng_Placeholder.jpeg",
        },
        {
            personTypeIds: [engId],
            firstName: "Sergio",
            lastName: "Leone",
            description: "directed the movie",
            isMsStaff : true,
           'picture' : "eng_Placeholder.jpeg",
        },
        {
            personTypeIds: [engId],
            firstName: "Peter",
            lastName: "Fonda",
            description: "he was the bad guy",
            isMsStaff : true,
           'picture' : "eng_Placeholder.jpeg",
        },
        {
            personTypeIds: [engId],
            firstName: "Clint",
            lastName: "Eastwood",
            description: "Fistful of dollars",
            isMsStaff : true,
          'picture' : "eng_Placeholder.jpeg",
        }
    ];

    _.each(peopleSeed, function (p) {
        people.insert(p);
        console.log("Person inserted to db ", p.firstName, p.lastName);
    })

}

// // ***** Products


if(products.find().count() === 0){
    var productSeeds = [
        {
            title : "Fifa 2016",
            codeName : "Euro16",
            description : "some fancy description here",
            developers: [
                partners.findOne({ companyName : "Bethesda"})["_id"],
                partners.findOne({ companyName : "Electronic Arts"})["_id"],
                partners.findOne({ companyName : "Bungie"})["_id"],
            ],
            publishers : [
                partners.findOne({ companyName : "Ubisoft"})["_id"],
                partners.findOne({ companyName : "Blizzard"})["_id"],
                partners.findOne({ companyName : "Activision"})["_id"],
            ],
            team : [
                people.findOne({firstName : 'Peter'})["_id"],
                people.findOne({firstName : 'Harmonica'})["_id"],
                people.findOne({firstName : 'Claudia'})["_id"],
            ]
        },
        {
            title : "Drangon Age 2",
            codeName : "Project B",
            description : "some fancy description here",
            developers: [
                partners.findOne({ companyName : "Bethesda"})["_id"],
                partners.findOne({ companyName : "Electronic Arts"})["_id"],
            ],
            publishers : [
                partners.findOne({ companyName : "Ubisoft"})["_id"],
                partners.findOne({ companyName : "Activision"})["_id"],
            ],
            team : [
                people.findOne({firstName : 'Clint'})["_id"],
                people.findOne({firstName : 'Peter'})["_id"],
                people.findOne({firstName : 'Lee'})["_id"],
            ]
        },
        {
            title : "Fallout New Vegas",
            codeName : "Brotherhood Of Steel",
            description : "some fancy description here",
            developers: [
                partners.findOne({ companyName : "Bethesda"})["_id"],
                partners.findOne({ companyName : "Electronic Arts"})["_id"],
            ],
            publishers : [
                partners.findOne({ companyName : "Blizzard"})["_id"],
                partners.findOne({ companyName : "Activision"})["_id"],
            ],
            team : [
                people.findOne({firstName : 'Sergio'})["_id"],
                people.findOne({firstName : 'Claudia'})["_id"],
                people.findOne({firstName : 'Clint'})["_id"],
            ]
        },
        {
            title : "Escape from castle Woflenstein",
            codeName : "Project X",
            description : "some fancy description here",
            developers: [
                partners.findOne({ companyName : "Bethesda"})["_id"],
                partners.findOne({ companyName : "Electronic Arts"})["_id"],
            ],
            publishers : [
                partners.findOne({ companyName : "Ubisoft"})["_id"],
                partners.findOne({ companyName : "Blizzard"})["_id"],
            ],
            team : [
                people.findOne({firstName : 'Harmonica'})["_id"],
                people.findOne({firstName : 'Lee'})["_id"],
                people.findOne({firstName : 'Claudia'})["_id"],
            ]
        },
    ];

  _.each(productSeeds, function(product){
    products.insert(product);
    console.log("product added to db ", product.title);
  });
}


// ** eventTypes
if (atgEventTypes.find().count() === 0) {


    var atgEventTypeSeeds = [
        {
            "type": "Engagement",
            "description": "Events are fun",
            "eventSchema": encodeURIComponent(JSON.stringify(atgEventsServerHelpers.getEngagementSchema()))
        },
        {
            "type" : "Out Of Office",
            "description" : "oof is fun!",
            "eventSchema": encodeURIComponent(JSON.stringify(atgEventsServerHelpers.getOofSchema()))
        },
        {
            "type" : "Product Launch",
            "description" : "product launch!",
            "eventSchema": encodeURIComponent(JSON.stringify(atgEventsServerHelpers.getProductLaunchSchema()))
        }
    ]


    _.each(atgEventTypeSeeds, function (aet) {
        atgEventTypes.insert(aet);
        console.log("event type added to db ", aet.type);
    })

}

