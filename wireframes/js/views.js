$( document ).ready(function() {

/**
 * Change Views
 * Views is a generic term for pages, views, subsections, steps, etc.
 * May optionally change corresponding navigation
 * Adds .active to the current view
 * Use .active on the default view in the markup
 */
	
/*
* Listener for changing views
* Processes the change request and routes accordingly
*/
$('.change-view').click(function () {

	var thisClicked = $(this);

	console.log('Change view clicked');
	console.log('thisClicked=' + thisClicked);

	// Call changeView function
	changeView(thisClicked);

	// Prevent normal action
	return false;
});

// Handler for changing views
changeView = function(thisClicked) {

	var viewType = ".view";
	if (thisClicked.attr('data-view-type')) {
		viewType = '.' + thisClicked.attr('data-view-type');
	}

	var viewContainer = "#viewContainer";
	if (thisClicked.attr('data-view-container')) {
		viewContainer = '#' + thisClicked.attr('data-view-container');
	}

	var currentView = $(viewContainer).find(viewType + '.active').attr('id');
	currentView = "#" + currentView;

	var nextView = thisClicked.attr('data-view');
	nextView = "#" + nextView;

	console.log('changeView function');
	console.log('viewContainer: ' + viewContainer);
	console.log('viewType: ' + viewType);
	console.log('currentView: ' + currentView);
	console.log('nextView: ' + nextView);
	
	// Hide current view
	$(currentView).addClass('d-none').removeClass('active');

	// Scroll window to top of view
	window.scrollTo(0, 0);

	// Show next view
	// Add animation classes, then unhide for smooth transition
	$(nextView).addClass('animated fadeIn faster').removeClass('d-none').addClass('active');

	// After animation completes, remove classes
	$(nextView).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
		$(this).removeClass('animated fadeIn faster');
	});
	
};


/**
 * Change sidebar nav
 * Updates active item of selected nav menu
 */
$('.app-sidebar a').click(function () {

	var nav = $('.app-sidebar');
	var parentTag = $(this).parent().get(0).tagName;
	var isActive = $(this).parent().hasClass('active');

	console.log('Change nav clicked');
	console.log('parentTag: ' + parentTag);

	if (isActive) {
		// Already the active item, do nothing
		console.log('clicked the active link, did not change anything');
	} else {
		// Change to the active item
	
		// When subnav item
		// must already have an active parent item to be visible and selectable
		if (parentTag === 'LI') {
			console.log('changing the active subnav item');
			$(this).parents('.sb-toc-nav').find('.active').removeClass('active');
			$(this).parent('li').addClass('active');
		} else {
			console.log('changing the active nav item');
			// Not a subnav, must be a main nav item
			// Close other submenus and open this one
			$(nav).find('.active').removeClass('active');
			$(this).parent('.sb-toc-item').addClass('active');
		}
	}	

	return false;
});

}); // end document.ready