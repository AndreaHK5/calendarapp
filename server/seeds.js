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
    var partnersSeed = [
        {
            companyName : "Bethesda",
            partnerTypeIds : [developerTypeId],
            description : "some description here",
            locations: [{ "title" : "BETHESDA SOFTWORKS LLC",
                "addressOne" : "1370 Piccard Drive",
                "city" : "Rockville",
                "state" : "MD",
                "postalCode" : "20850",
                "country" : "USA",
                "isPrimaryLocation" : true
            }]
        },
        {
            companyName : "Electronic Arts",
            partnerTypeIds : [developerTypeId],
            description : "some description here",
            locations: [
                { "title" : "Electronic Arts",
                    "addressOne" : "209 Redwood Shores Pkwy",
                    "city" : "Redwood City",
                    "state" : "CA",
                    "postalCode" : "94065",
                    "country" : "USA",
                    "isPrimaryLocation" : true
                },
                { "title" : "Electronic Arts",
                    "addressOne" : "2401 4th Ave",
                    "addressTwo" : "#300",
                    "city" : "Seattle",
                    "state" : "WA",
                    "postalCode" : "98121",
                    "country" : "USA",
                    "isPrimaryLocation" : false
                }
            ]
        },
        {
            companyName : "Bungie",
            partnerTypeIds : [developerTypeId],
            description : "some description here",
            locations: [{ "title" : "Bungie, INC",
                "addressOne" : "550 106th Ave NE # 270",
                "addressTwo" : "#207",
                "city" : "Bellevue",
                "state" : "WA",
                "postalCode" : "98004",
                "country" : "USA",
                "isPrimaryLocation" : true
            }]
        },
        {
            companyName : "Ubisoft",
            partnerTypeIds : [publisherTypeId],
            description : "some description here",
            locations: [
                { "title" : "Ubisoft World Headquarters",
                    "addressOne" : "Fancy boulevard",
                    "city" : "Paris",
                    "state" : "GreaterParis",
                    "postalCode" : "541452",
                    "country" : "France",
                    "isPrimaryLocation" : true
                },
                { "title" : "Ubisoft USA",
                    "addressOne" : "Mission ",
                    "city" : "San Francisco",
                    "state" : "CA",
                    "postalCode" : "96546",
                    "country" : "USA",
                    "isPrimaryLocation" : false
                }
            ]
        },
        {
            companyName : "Blizzard",
            partnerTypeIds : [publisherTypeId],
            description : "some description here",
            locations: [
                { "title" : "Ubisoft World Headquarters",
                    "addressOne" : "Fancy boulevard",
                    "city" : "Irvine",
                    "state" : "CA",
                    "postalCode" : "97645",
                    "country" : "USA",
                    "isPrimaryLocation" : true
                }
            ]
        },
        {
            companyName : "Team17",
            partnerTypeIds : [publisherTypeId],
            description : "some description here",
            locations: [
                { "title" : "Team 17 Digital Limited",
                    "addressOne" : "Castelview House",
                    "addressTwo" : "Calder Island way",
                    "city" : "Wakefield",
                    "state" : "West Yorkshire",
                    "postalCode" : "WF2 7AW",
                    "country" : "GB",
                    "isPrimaryLocation" : true
                }
            ]
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
                partners.findOne({ companyName : "Team17"})["_id"],
            ],
            team : [
                people.findOne({firstName : 'Peter'})["_id"],
                people.findOne({firstName : 'Harmonica'})["_id"],
                people.findOne({firstName : 'Claudia'})["_id"],
            ]
        },
        {
            title : "Dragon Age 2",
            codeName : "Project B",
            description : "some fancy description here",
            developers: [
                partners.findOne({ companyName : "Bethesda"})["_id"],
                partners.findOne({ companyName : "Electronic Arts"})["_id"],
            ],
            publishers : [
                partners.findOne({ companyName : "Ubisoft"})["_id"],
                partners.findOne({ companyName : "Team17"})["_id"],
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
                partners.findOne({ companyName : "Team17"})["_id"],
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
            icon : "engagement.png",
            "description": "Events are fun",
            "eventSchema": encodeURIComponent(JSON.stringify(atgEventsServerHelpers.getEngagementSchema()))
        },
        {
            "type" : "Out Of Office",
            "description" : "oof is fun!",
            icon : "oof.png",
            "eventSchema": encodeURIComponent(JSON.stringify(atgEventsServerHelpers.getOofSchema()))
        },
        {
            "type" : "Product Launch",
            "description" : "product launch!",
            icon : "pl.png",
            "eventSchema": encodeURIComponent(JSON.stringify(atgEventsServerHelpers.getProductLaunchSchema()))
        }
    ]


    _.each(atgEventTypeSeeds, function (aet) {
        atgEventTypes.insert(aet);
        console.log("event type added to db ", aet.type);
    })

}

