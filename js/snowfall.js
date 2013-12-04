/*
 *
 * Version: 1.0
 *
 * Dependencies: jQuery (Developed and tested on version 1.10.2)
 *
 * Author: Roy Bakker
 *
 * Contact: roy@zwaarcontrast.nl
 *
 */

(function($, window, document, undefined) {
	"use strict";

	//Constructor
	var Snowfall = function(elem, options) {
		this.element = $(elem);
		this.options = options;
	};

	//Prototype
	Snowfall.prototype = {

		//Configuration
		defaults:{

		},

		//Initialisation
		init: function() {
			//Get the options and merge with defaults
			this.config = $.extend({}, this.defaults, this.options, this.metadata);

			return this;
		}

	}

	//Extend Jquery with the SnowFall function/object
	$.fn.Snowfall = function(options) {
		return this.each(function() {
			//Construct new SnowFall object and call init function
			new Snowfall(this, options).init();
		});
	};
})(jQuery, window, document);