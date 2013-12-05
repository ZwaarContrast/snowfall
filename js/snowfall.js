/*
 *
 * Version: 1.0
 *
 * Dependencies: jQuery (Developed and tested on version 1.10.2)
 *
 * Inspiration from: http://thecodeplayer.com/walkthrough/html5-canvas-snow-effect
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
		this.element = elem;
		this.options = options;
	};

	//Prototype
	Snowfall.prototype = {

		//Configuration
		defaults:{
			amount:125,		//Amount of particles
		},

		//Initialisation
		init: function() {
			//Get the options and merge with defaults
			this.config = $.extend({}, this.defaults, this.options, this.metadata);

			//Variables
			this.angle = 0;

			//Get the context from our canvas element
			this.ctx = this.element.getContext('2d');

			//Call necessary functions
			this.setCanvas();
			this.createElements();

			//Bind events
			this.bindResize();
			this.bindRequestKeyframes();

			return this;
		},
		setCanvas: function(){
			//Get window dimensions
			this.windowWidth = window.innerWidth;
			this.windowHeight = window.innerHeight;

			//Explicitly set canvas width and height
			this.element.width=this.windowWidth;
			this.element.height=this.windowHeight;
		},

		//Function to create the elements
		createElements: function(){
			this.particles = [];
			for(var i = 0; i < this.config.amount; i++)
			{
				//Add particle to the array
				this.particles.push({
					x: Math.round(Math.random()*this.windowWidth), //x-coordinate
					y: Math.round(Math.random()*this.windowHeight), //y-coordinate
					r: Math.round(Math.random()*4+1), //radius
					d: Math.round(Math.random()*this.config.amount), //density
					s: Math.random()
				})
			}
		},
		//Function to draw all the elements on screen
		drawElements: function(){
			//Clear the context
			this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

			//Set the fill style
			this.ctx.fillStyle = "rgba(255, 255, 255,1)";
			
			//Begin drawing
			this.ctx.beginPath();

			//Loop through the particles
			for(var i = 0; i < this.config.amount; i++)
			{	
				//Get particle, move to coordinate and draw circle
				var p = this.particles[i];
				this.ctx.moveTo(p.x, p.y);
				this.ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, false);
			}

			//Fill
			this.ctx.fill();
			
		},

		//Function to update position of the elements
		updateElements: function(){

			//Loop through the particles
			for(var i = 0; i < this.config.amount; i++)
			{
				//Get the particle
				var p = this.particles[i];
				
				//Set y position
				p.y += p.s;
				
				//Check for out of screen
				if(p.y > this.element.height)
				{
					//Put the particle on a random coordinate along the top of the screen
					this.particles[i]= {x: Math.random()*this.element.width, y: -10, r: p.r, d: p.d, s:p.s};
				}
			}
		},
		//Bind resize
		bindResize: function(){
			var _self=this, TO = false;
			//Debounced resize handling
			$(window).resize(function() {
				if (TO !== false){
					clearTimeout(TO);
				}
				TO = setTimeout(function(){
					_self.setCanvas();
				}, 300);
			});
		},

		//Bind animation frame
		bindRequestKeyframes: function(){
			
			//Check for requestAnimationFrame support, fall back to setTimeout (60fps)
			window.requestAnimFrame = (function(){
				return  window.requestAnimationFrame       ||
						window.webkitRequestAnimationFrame ||
						window.mozRequestAnimationFrame    ||
						window.oRequestAnimationFrame      ||
						window.msRequestAnimationFrame     ||
						function( callback ){
							window.setTimeout(callback, 1000 / 60);
						};
			})();

			//Reference to Snowfall context so we can call class functions within the animation loop
			var _self = this;
			(function animloop(){
				//Call for animation loop
				window.requestAnimFrame(animloop);
				
				//Draw all the elements
				_self.drawElements();

				//Update position of elements for the next draw
				_self.updateElements();
			})();
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