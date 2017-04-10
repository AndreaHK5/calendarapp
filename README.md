# Meteor Sample app 

Visit the deployed app at this [link](http://demoandrea.cloudapp.net/). Check out the [app's video](https://www.youtube.com/watch?v=Qu03mRNWPbE&t=4s)).

Calendar sample app. All code is done by Andrea Cremese. UI/UX concept had one other contributor/reviewer. 

... and well, yes, the calendar behavior is inspired by [virgin america's booking system](https://www.virginamerica.com/book/rt/a1/sea_bos), even though the rest of the experience is completely different.

Some things to look at:

## on the calendar

- Sign in to create events.
- The app is responsive (check it out on mobile / tablet).
- The app is reactive (open two windows and start creating events, like in [this video](https://www.youtube.com/watch?v=Qu03mRNWPbE&t=4s)).
- Tap / click on a day to see all the events for that day.
- Tap / click on the day's grey bar's to filter events.
- Tap / click on the day's circles to see only those events.
- Tap / click on an event's calendar icon to see its extent on the calendar.
- Note the animations.
- Tap on chevrons next to the month (top right), in order to swipe through months.


## on the event creation

- Sign in to create events (a fake email is ok).
- Note the navigation at the top, as you progress with the event creation you can review / edit the event, as seen in [the video](https://www.youtube.com/watch?v=Qu03mRNWPbE&t=4s).


## partners and products

- All CRUD operations allowed.
- With fun animations!



## Technologies

* Meteor 
* Semantic UI
* MongoDB
* Simple Schema with event types injected and validations
* Meteor accounts
* Azure VM Classic (why complicate life?=) )
* Ubuntu 14.04
* Webstorm / Sublime (tried Visual Studio Code but had some issues with Caching of the files in the .meteor folder, and moved away from it)

## On the tech involved

* code is Single Responsibility for maintainability (e.g. the helpers, the templates)
* code is DRY, e.g. the date picker is not copy pasted nut extracted in a template and injected.
* mup deploy is in separate folders, not all in the same, to allow staging, UAT, ...
* event types are not hard coded but are read from database
* the templates are dynamically injected depending on the type of event that is selected (see `eventTypeSettings` object in front end, should be considered to go in the DB?)
* backend validation on the event types are not in Simple Schema but rather on the schema that is saven in the DB. New event types can be added without changing the code
* script to backup database on VM included
* the I_ids are stored in the documents for the reationships, not the full referenced document (e.g. engineers for engagment). Mongo > 3.3.4 allows aggregation, making these lookup methods really fast. Refer to [this blog entry](http://www.andreacremese.com/2016/09/26/Mongo-Sql-a-comparison/)



## TODO

- improve top navbar on mobile
- port over the Meteor method tests
- remove clicking / hovering from pictures and create event types - not mobile friendly
- animation on engagement create and on change route is not working properly
- loading of location for partner is sometimes sluggish
- update meteor
- use flower router rather than iron router
- update deployment to mupx and docker

#### Some of the experience's features to point the attention at in the ReadMe:

* filters
* animations
* create experience (backwards actions on the top, forwards)
* log in / register to create stuff
* hover/tap on images for names
* event types are programmatically created and validated
* arrows in the calendar
* go mobile
* type a product that already exists on create
* pictures upload
* navigate to a create product that does not exist has an error (not only white screen)
* on the engagement site the goals can be added without needing top touch the mouse =)