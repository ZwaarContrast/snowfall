$(document).ready(function() {
	/*
	 * Initialize our snowfall plugin on the canvas element
	 */
	 
	 $("#snowfall").Snowfall();

	/*
	 * For demo purpose: Start snippet for sizing the body to the window height
	 */

	//Bind the resize function to the resize event
	$(window).bind('resize',resize);

	//Variable to store window height
	var windowHeight;

	//Function to get window height and set body height
	function resize(){
		windowHeight = $(window).height();
		$('body').height(windowHeight);
	}

	//Call initial resize function
	resize();

});