Session.set('currentRESTQuery', '');

Template.atgDash.helpers({
	startDate: function(){
		return moment(Session.get('startDate')).format('MM/DD/YYYY');
	},
	endDate: function(){
		return moment(Session.get('endDate')).format('MM/DD/YYYY');
	},
	forumHotTopics: function(){
		return Session.get('forumsHotTopics');
	},
	hotTopicsLoaded: function(){
		return Session.get('hotTopicsLoaded');
	},
	questionAsked: function(){
		return Session.get('forumsQuestionsAsked');
	},
	questionsAskedLoaded: function(){
		return Session.get('questionsAskedLoaded');
	},
	questionsUnanswered: function() {
		return Session.get('forumsQuestionsUnanswered');
	},
	questionsUnansweredLoaded: function(){
		return Session.get('questionsUnansweredLoaded');
	},
	questionsUnassigned: function() {
		return Session.get('forumsQuestionsUnassigned');
	},
	questionsUnassignedLoaded: function(){
		return Session.get('questionsUnassignedLoaded');
	},
	questionsAvgAnswer: function() {
		return Session.get('forumsQuestionsAverageAnswerTime');
	},
	questionsAverageAnswerLoaded: function(){
		return Session.get('questionsAverageAnswerLoaded');
	},
	vsoInfo: function(){
		var data = vsoInfo.findOne();
		if (!data) return null;
		data.pieName = _.keys(data.statistics);
		data.pieValue = _.values(data.statistics);

		return data;
	},
	tripScheduled: function() {
		return {
			embeddedLink:'/trips/scheduled',
			numberOfTrips: developerVisits.find({visitStartDate: {$gt: new Date()}}).count()
		};
	},
	tripInProgress: function() {
		return {
			embeddedLink:'/trips/in-progress',
			numberOfTrips: developerVisits.find({visitStartDate: {$lt: new Date()}, visitEndDate: {$gt: new Date()}}).count()
		};
	},
	tripCompleted: function() {
		return {
			embeddedLink:'/trips/completed',
			numberOfTrips: developerVisits.find({visitEndDate: {$lt: Session.get('endDate')}, visitStartDate: {$gt: Session.get('startDate')}}).count()
		};
	},
	tripCompletedRange: function(){
		var _startDate = new Date(Session.get('startDate'));
		var _endDate = new Date(Session.get('endDate'));

		return{
			embeddedLink:'/trips/completed?startDate=' + new Date(_startDate) + '&endDate=' + new Date(_endDate),
			numberOfTrips: developerVisits.find({visitEndDate: {$lt: _endDate}, visitStartDate: {$gt: _startDate}}).count()
		}
	},
	currentUser: function(){
		return Meteor.user();
	},
	areas: function(){
		return [
			{item: 'forums', text: 'Developer Forums'},
			{item: 'vso', text: 'Visual Studio'},
			{item: 'engagements', text: 'Engagements'}
		];
	},
	currentRESTQuery: function(){
		return Session.get('currentRESTQuery');
	}
});

Template.atgDash.events({
	'mouseenter .grid-item': function(event, template){
		//$('#debug-output').html('<h3>REST call: ' + this.restQuery + '</h5>');
		Session.set('currentRESTQuery', this.restQuery);
	},
	'mouseleave .grid-item': function(event, template){
		//$('#debug-output').html('');
		Session.set('currentRESTQuery', '');
	}

});

Template.atgDash.onRendered( function(){
	$('.filter-pane-toggle').on('click', function(e, template){
		var _filterStatus = Session.get('filterStatus');

		if(!_filterStatus){
			TweenLite.to($('.filter-pane-toggle'), .8, {rotation: 135, transformOrigin: '50% 50%'});
			TweenLite.to($('.filter-pane'), .8, {height: '100%', ease: Power4.easeOut, onComplete: function(){
				$('.filter-pane').css('overflow', 'visible');
			}});
			Session.set('filterStatus', true);
		} else {
			$('.filter-pane').css('overflow', 'hidden');
			TweenLite.to($('.filter-pane-toggle'), .8, {rotation: 0, transformOrigin: '50% 50%'});
			TweenLite.to($('.filter-pane'), .8, {height: 0, ease: Power4.easeOut});
			Session.set('filterStatus', false);
		}
	});

	$('.ui.dropdown')
		.dropdown({
			onChange: function(e){
				switch (e) {
					case 'forums':
					{
						TweenLite.to($('.grid-section'), 0.21, {opacity: 0, height: 0, display: 'none', ease: Power4.easeOut});
						TweenLite.to($('.forums-grid'), 0.55, {display: 'block', height: '100%', opacity: 1, delay: 0.21, ease: Power4.easeOut});
						$('#debug-output-container').css('height', '100%');
						break;
					}
					case 'vso':
					{
						TweenLite.to($('.grid-section'), 0.21, {opacity: 0, height: 0, display: 'none', ease: Power4.easeOut});
						TweenLite.to($('.vso-grid'), 0.55, {display: 'block', height: '100%', opacity: 1, delay: 0.21, ease: Power4.easeOut});
						$('#debug-output-container').css('height', 0);
						break;
					}
					case 'engagements':
					{
						TweenLite.to($('.grid-section'), 0.21, {opacity: 0, height: 0, display: 'none', ease: Power4.easeOut});
						TweenLite.to($('.trips-grid'), 0.55, {display: 'block', height: '100%', opacity: 1, delay: 0.21, ease: Power4.easeOut});
						$('#debug-output-container').css('display', 0);
						break;
					}
				}
			}
		});

	$('.grid-item').hover(
		function(e){
			$(this).addClass('larger');
		}, function(e){
			$(this).removeClass('larger');
		});

	$('.trips-grid').css('display', 'none');
	$('.vso-grid').css('display', 'none');
});