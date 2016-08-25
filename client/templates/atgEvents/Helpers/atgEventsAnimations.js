

if (Meteor.isClient) {
    // all helpers for use in Templates are encapsulated in an object for reference
    atgEventsAnimations = {};

    // ++++++++++++++++ DASHBOARD ANIMATIONS ++++++++++++

    var slidingTime = 0.6;

    var getUsableHeight = function () {
        var navbarHeigt = $('#top-bar').height();
        var totalHeight = $(window).height();
        return totalHeight - navbarHeigt;
    };

    var slideDownCreateUtils = function () {
        var button = $("#create-button");
        var typeContainer =$("#types-container");
        TweenLite.to(button, slidingTime, { bottom : button.outerHeight()/2});
        TweenLite.to(typeContainer, slidingTime, { bottom : button.outerHeight()/2 - parseInt(typeContainer.css("padding"))});
    };

    /**
     *
     * @param fromBottom - slide in cards from bottom of screen
     * @returns promise that resolves when animation is done
     */
    atgEventsAnimations.positionTrayAndCalendar = function(fromBottom) {
        var calendar = $("#calendar-container");
        var bottomTray = $("#list-panel-container");
        var usableAreaHeight = getUsableHeight() - $('#weekday-navbar').height();
        if (bottomTray.length != 0) {
            var cardsTotalHeight = $("#cards-container").height() + $("#filter-bar").outerHeight();
            var bottomTrayHeight = Math.min(usableAreaHeight / 2, cardsTotalHeight );
            mainAreaHeight = usableAreaHeight - bottomTrayHeight;

            // bottom tray
            if(fromBottom) {
                TweenLite.from(bottomTray, 0.1, {top : $(window).height() });
            }

            TweenLite.to(calendar, slidingTime, { height : mainAreaHeight});
            TweenLite.to(bottomTray, slidingTime, { top : usableAreaHeight - bottomTrayHeight + $('#top-bar').height() + $('#weekday-navbar').height()});
            TweenLite.to(bottomTray, slidingTime, { height : bottomTrayHeight});
            TweenLite.to($("#create-button"), slidingTime, { bottom : bottomTrayHeight - $("#create-button").outerHeight()/2});
            TweenLite.to($("#types-container"), slidingTime, { bottom : bottomTrayHeight - $("#types-container").outerHeight()/2 });
            $('#cards-viewport').height(bottomTrayHeight - $("#filter-bar").outerHeight());
        } else {
            slideDownCreateUtils();
            calendar.css("height", usableAreaHeight);
        }
        return jQuery.Deferred().resolve().promise();
    };

    atgEventsAnimations.hideEventsContainer = function() {
        var calendar = $("#calendar-container");
        var bottomTray = $("#list-panel-container");
        if (bottomTray.length == 0 ) {
            return jQuery.Deferred().resolve().promise();
        }
        var deferred = jQuery.Deferred();
        var usableAreaHeight = getUsableHeight() - $('#weekday-navbar').height();
        TweenMax.to(calendar, slidingTime, { height : usableAreaHeight});
        slideDownCreateUtils();
        TweenMax.to(bottomTray, slidingTime, {
            top : $(window).height(),
            onComplete : function () {
                Session.set("dayForEventsDetail", undefined);
                deferred.resolve();
            }
        });
        return deferred.promise();
    };

    atgEventsAnimations.scrollCalendarToDay = function (div) {
        if (!div) {return ;}
        var calendar = $('#calendar-container');
        var topY = calendar.scrollTop() + div.offset().top - 2* div.height();
        TweenLite.to(calendar, slidingTime, { scrollTop: topY });
    };

    // ++++++++++++++++ CREATE AND EDIT ANIMATIONS ++++++++++++

    /**
     * sizes div to area below navbar
     * @param targetDiv
     */
    atgEventsAnimations.sizeToUsableArea = function (targetDiv) {
        if(!targetDiv || targetDiv.length != 1) { return; }
        targetDiv.css("height", getUsableHeight());
    };

    /**
     * scrolls out the div passed in
     * @returns { promise }
     */
    atgEventsAnimations.slideOutTop = function (targetDiv) {
        if (!targetDiv || targetDiv.length == 0) {
            return jQuery.Deferred().resolve().promise();
        }

        // required as multiple divs may be on screen.
        targetDiv.each(function (e) {
            TweenMax.to(targetDiv[e], slidingTime, {
                top : - $('#top-bar').height() - getUsableHeight() + $(targetDiv[e]).offset().top
            });
        });

        var deferred = jQuery.Deferred();
        setTimeout(function () {
            deferred.resolve();
        }, slidingTime * 1000);

        return deferred.promise();
    };

    /**
     * scrolls out the div passed in
     * @returns { promise }
     */
    atgEventsAnimations.slideOutBottom = function (targetDiv) {
        if (!targetDiv || targetDiv.length == 0) {
            return jQuery.Deferred().resolve().promise();
        }

        var deferred = jQuery.Deferred();
        TweenMax.to(targetDiv, slidingTime, {
            top : $(window).height(),
            onComplete : function () {
                deferred.resolve();
            }
        });
        return deferred.promise();
    };

    /**
     * scroll in the target div form the bottom
     * @param targetDiv
     * @returns {promise}
     */
    atgEventsAnimations.slideInBottom = function (targetDiv) {
        if (!targetDiv || targetDiv.length == 0) {
            return jQuery.Deferred().resolve().promise();
        }
        targetDiv.css("height", getUsableHeight());
        TweenLite.set(targetDiv,{top:$(window).height()})
        var deferred = jQuery.Deferred();
        TweenMax.to(targetDiv, slidingTime, {
            top : 0,
            onComplete : function () {
                deferred.resolve();
            }
        });
        return deferred.promise();
    };

    /**
     * sizes the target div to the screen and scrolls it in form the top
     * @param targetDiv
     * @returns {promise}
     */
    atgEventsAnimations.slideInTop = function (targetDiv) {
        if (!targetDiv || targetDiv.length == 0) {
            return jQuery.Deferred().resolve().promise();
        }
        targetDiv.css("height", getUsableHeight());
        TweenLite.set(targetDiv, {top : - $(window).height()});
        var deferred = jQuery.Deferred();
        TweenMax.to(targetDiv, slidingTime, {
            top : 0,
            onComplete : function () {
                deferred.resolve();
            }
        });
        return deferred.promise();
    };

    /**
     * ensures #scroll-container is correctly sized and
     * registers window resizes for #scroll-containers and #scrollable-container
     * animates the slide in top and bottom automatically
     */
    atgEventsAnimations.sizePageConteiners = function () {
        if (Session.get("slideInBottom")){
            atgEventsAnimations.slideInBottom($("#slidable-container"));
            Session.set("slideInBottom", undefined);
        }

        if (Session.get("slideInTop")){
            atgEventsAnimations.slideInTop($("#slidable-container"));
            Session.set("slideInTop", undefined);
        }

        atgEventsAnimations.sizeToUsableArea($("#scroll-container"));

        // todo find a way to incorporate this everywhere
        $(window).resize(function() {
            atgEventsAnimations.sizeToUsableArea($("#slidable-container"));
            atgEventsAnimations.sizeToUsableArea($("#scroll-container"));
        });
    }

}