
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


// helper methods
getIdByName = function (collection, string) {
  return collection.findOne({name : string})["_id"];
}

getGameTitleIdByProduct = function (string) {
  return GameTitles.findOne({product : string})["_id"];
}


// ***** Engineers
if(Engineers.find().count() === 0){
  var engineers = [
    {
      'name' : "Fabio Petris",
      'email' : "fabio@noemail.com",
      'picture' : "placeholder1.jpeg"
    },
    {
        'name' : "Enrico Paglia",
        'email' : "enrico@noemail.com",
        'picture' : "placeholder2.jpeg"
    },
    {
        'name' : "Andrea Cremese",
        'email' : "andrea@noemail.com",
        'picture' : "placeholder3.jpeg"
    },
    {
        'name' : "Phil King",
        'email' : "phil@noemail.com",
        'picture' : "placeholder4.jpeg"
    }
  ];

  _.each(engineers, function(engineer){
    Engineers.insert(engineer);
    console.log("Engineer added to db ", engineer.name);
  });
}

// ***** Dams

if(Dams.find().count() === 0){
  var dams = [
    {
      'name' : "Lee Van Cleef",
      'email' : "sentenza@theGoodTheBad.com",
      'picture' : "lee.jpeg"
    },
    {
        'name' : "Henry Fonda",
        'email' : "frank@onceUponInW.com",
        'picture' : "henry.jpeg"
    },
    {
        'name' : "Charles Bronson",
        'email' : "harmonica@onceUponInW.com",
        'picture' : "charles.jpeg"
    }
  ];

  _.each(dams, function(dam){
    Dams.insert(dam);
    console.log("Dam added to db ", dam.name);
  });
}

// ***** GameTitles

var gameTitleSeeds = [
  {
    product : "Fifa 2016",
    codename : "Euro16"
  },
  {
    product : "Drangon Age 2",
    codename : "project B"
  },
  {
    product : "Fallout New Vegas",
    codename : "Brotherhood"
  },
  {
    product : "Escape from castle Woflenstein",
    codename : "Project X"
  },
]
if(GameTitles.find().count() === 0){
  _.each(gameTitleSeeds, function(gameTitle){
    GameTitles.insert(gameTitle);
    console.log("Game Title added to db ", gameTitle.product);
  });
}
// ***** Engagements

var engagementsSeeds = [
  {
    "startDate" : moment([2016,1,1]).startOf("day").toISOString(),
    'endDate'   : moment([2016,1,5]).startOf("day").toISOString(),
    'visiting'  : {
      'name' : "John Doe",
      'location' : "Udine, Italy"
    },
    'title' : "Maintainance",
    'description' : "lorem",
    'engineersGoing' : [
      { id : getIdByName(Engineers, "Fabio Petris") },
      { id : getIdByName(Engineers, "Andrea Cremese") },
    ],
    'platform' : "Xbox",
    'dam' : { id : getIdByName(Dams, "Lee Van Cleef") },
    'gameTitle' : { id : getGameTitleIdByProduct('Fifa 2016')},
    'type' : "engagement"
  },
  {
    'startDate' : moment([2016,0,29]).startOf("day").toISOString(),
    'endDate'   : moment([2016,1,06]).startOf("day").toISOString(),
    'visiting'  : {
      'name' : "NA",
      'location' : "Mt Bachelor, OR"
    },
    'title' : "Skiing",
    'description' : "Skiing is fun",
    'engineersGoing' : [
        { id : getIdByName(Engineers, "Fabio Petris") },
        { id : getIdByName(Engineers, "Andrea Cremese") },
        { id : getIdByName(Engineers, "Phil King") },
        { id : getIdByName(Engineers, "Enrico Paglia") },
      ],
    'platform' : "Volkl",
    'dam' : { id : getIdByName(Dams, "Henry Fonda") },
    'gameTitle' : { id : getGameTitleIdByProduct('Drangon Age 2')},
    'type' : "vacation"
  },
  {
    'startDate' : moment([2016,1,2]).startOf("day").toISOString(),
    'endDate'   : moment([2016,1,14]).startOf("day").toISOString(),
    'visiting'  : {
      'name' : "NA",
      'location' : "London UK"
    },
    'title' : "Pub",
    'description' : "Pub game night",
    'engineersGoing' : [
      { id : getIdByName(Engineers, "Fabio Petris") },
      { id : getIdByName(Engineers, "Andrea Cremese") },
     ],
    'platform' : "London Pride",
    'dam' : { id : getIdByName(Dams, "Charles Bronson") },
    'gameTitle' : { id : getGameTitleIdByProduct('Fallout New Vegas')},
    'type' : "vacation"
  },
  {
    'startDate' : moment([2016,0,2]).startOf("day").toISOString(),
    'endDate'   : moment([2016,1,16]).startOf("day").toISOString(),
    'visiting'  : {
      'name' : "ARUP",
      'location' : "London UK"
    },
    'title' : "Glass Eng",
    'description' : "Second order analysis",
    'engineersGoing' : [ 
        { id : getIdByName(Engineers, "Enrico Paglia") }
      ],
    'platform' : "London Pride",
    'dam' : { id :  getIdByName(Dams, "Charles Bronson") },
    'gameTitle' : { id : getGameTitleIdByProduct('Escape from castle Woflenstein')},
    'type' : "engagement"
  }
];


if(Engagements.find().count() === 0){
  _.each(engagementsSeeds, function(event){
    Engagements.insert(event);
    console.log("Inserted ", event.title);
  })
}