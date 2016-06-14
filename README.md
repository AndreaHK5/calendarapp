# Meteor Sample app

## TODO

- write a more verbose readme
- improve top navbar on mobile
- port over the Meteor method tests
- remove clicking / hovering from pictures - not mobile friendly
- animation on engagement create and on change route is off
- loading of location for partner is sometimes sluggish
- update to 1.3 / ES2015 ?
- use flower router rather than iron router
- move mup outside the project (does not interact with Env Variables)
- update deployment to mupx and docker

## Some of the features to point the attention at:

** on the experience **
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


## Technologies

* Meteor 
* Semantic UI
* MongoDB
* Simple Schema with event types injected
* Meteor accounts
* Azure VM, Classic (why complicate life?=) )
* Ubuntu 14.04 (15 seems to have some issues with mup deploy, mongo does not start correctly)
* Webstorm / Sublime (tried Visual Studio Code but had some issues with Caching of the files in the .meteor folder, and moved away from it)

** on the tech involved **
* code is Single Responsibility for maintainability (e.g. the helpers, the templates)
* code is DRY, e.g. the date picker is not copy pasted nut extracted in a template and injected.
* mup deploy is in separate folders, not all in the same, to allow staging, UAT, ...
* event types are not hard coded but are read from database
* the templates are dynamically injected depending on the type of event that is selected (see `eventTypeSettings` object in front end, should be considered to go in the DB?)
* backend validation on the event types are not in Simple Schema but rather on the schema that is saven in the DB. New event types can be added without changing the code
