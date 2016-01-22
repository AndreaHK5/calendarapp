var lorem = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
 

var eventsSeeds = [
  {
    "startDate" : moment([2016,2,1]).startOf("day").unix(),
    'endDate'   : moment([2016,2,1]).startOf("day").unix(),
    'visiting'  : {
      'name' : "John Doe",
      'location' : "Udine, Italy"
    },
    'title' : "Maintainance",
    'description' : lorem,
    'engineersGoing' : [
      {
        'name' : "Fabio Petris",
        'email' : "fabio@noemail.com",
        'picture' : "placholder.jpg"
      },
      {
        'name' : "Enrico Paglia",
        'email' : "enrico@noemail.com",
        'picture' : "placholder.jpg"
      }
    ],
    'platform' : "Xbox",
    'dam' : {
      'name' : "Andre Cremese",
      'email' : "andrea@noemail.com",
      'picture' : "placholder.jpg"
    },
    'type' : "engagement"
  },
  {
    'startDate' : moment([2016,2,19]).startOf("day").unix(),
    'endDate'   : moment([2016,2,22]).startOf("day").unix(),
    'visiting'  : {
      'name' : "NA",
      'location' : "Mt Bachelor, OR"
    },
    'title' : "Skiing",
    'description' : "Skiing is fun",
    'engineersGoing' : [
      {
        'name' : "Andrea Cremese",
        'email' : "andrea@noemail.com",
        'picture' : "placholder.jpg"
      }
    ],
    'platform' : "Volkl",
    'dam' : {
      'name' : "Andre Cremese",
      'email' : "andrea@noemail.com",
      'picture' : "placholder.jpg"
    },
    'type' : "vacation"
  },
  {
    'startDate' : moment([2016,1,29]).startOf("day").unix(),
    'endDate'   : moment([2016,2,02]).startOf("day").unix(),
    'visiting'  : {
      'name' : "NA",
      'location' : "London UK"
    },
    'title' : "Pub",
    'description' : "Pub game night",
    'engineersGoing' : [
      {
        'name' : "Phil King",
        'email' : "phil@noemail.com",
        'picture' : "placholder.jpg"
      }
    ],
    'platform' : "London Pride",
    'dam' : {
      'name' : "Andre Cremese",
      'email' : "andrea@noemail.com",
      'picture' : "placholder.jpg"
    },
    'type' : "vacation"
  }
];


if(Events.find().count() === 0){
  _.each(eventsSeeds, function(event){
    Events.insert(event);
    console.log("Inserted ", event.title);
  })
}