// helper methods

getIdByName = function (collection, string) {
  return collection.findOne({name : string})["_id"];
} 


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

var lorem = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
 

var eventsSeeds = [
  {
    "startDate" : moment([2016,1,1]).startOf("day").unix(),
    'endDate'   : moment([2016,1,5]).startOf("day").unix(),
    'visiting'  : {
      'name' : "John Doe",
      'location' : "Udine, Italy"
    },
    'title' : "Maintainance",
    'description' : lorem,
    'engineersGoing' : [
      { id : getIdByName(Engineers, "Fabio Petris") },
      { id : getIdByName(Engineers, "Andrea Cremese") },
    ],
    'platform' : "Xbox",
    'dam' : { id : getIdByName(Dams, "Lee Van Cleef") },
    'type' : "engagement"
  },
  {
    'startDate' : moment([2016,0,29]).startOf("day").unix(),
    'endDate'   : moment([2016,1,06]).startOf("day").unix(),
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
    'type' : "vacation"
  },
  {
    'startDate' : moment([2016,1,2]).startOf("day").unix(),
    'endDate'   : moment([2016,1,14]).startOf("day").unix(),
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
    'type' : "vacation"
  },
  {
    'startDate' : moment([2016,0,2]).startOf("day").unix(),
    'endDate'   : moment([2016,1,16]).startOf("day").unix(),
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
    'type' : "engagement"
  }
];


if(Events.find().count() === 0){
  _.each(eventsSeeds, function(event){
    Events.insert(event);
    console.log("Inserted ", event.title);
  })
}