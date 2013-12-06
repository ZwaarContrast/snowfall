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
			//Amount of particles
			amount: 100,

			//Positioning
			horizontalOffsetLeft:-100,				//Horizontal offset from the left (can be positive or negative) in px, to shift starting point, useful when having diagonal snow
			horizontalOffsetRight:-200,				//Horizontal offset from the right (can be positive or negative) in px, to shift starting point, useful when having diagonal snow
			verticalOffsetTop:-100,					//Vertical offset from the top (can be positive or negative) in px, useful for the start position of the snow above the canvas

			//Vertical speed configuration
			verticalSpeed: 23,						//Somewhere between 0.5 and 10 works best
			randomVerticalSpeed: true,				//True or false
			minimumRandomVerticalSpeed: 3,			//Minimum shouldn't be lower than zero and probably heigher than 0.5
			maxiumumRandomVerticalSpeed: 6,			//Maxiumum shouln't be lower than zero and probably lower than 10

			//Horizontal speed configuration
			horizontalSpeed:10,						//Somewhere between -10 and 10 works best, negative values for left moving particles
			randomHorizontalSpeed: true,			//True or false
			minimumRandomHorizontalSpeed: -4,		//Minimum shouldn't be lower than zero and probably heigher than 0.5
			maxiumumRandomHorizontalSpeed: 4,		//Maxiumum shouln't be lower than zero and probably lower than 10

			//Graphics
			graphicMode: true,						//True or false, draws a circle when false
			radius: 4,								//In case graphicMode false: radius for drawn circles
			randomRadius: true,						//In case graphicMode false: toggle random radius for drawn circles
			minimumRandomRadius:10,					//In case graphicMode false: minimum random radius
			maxiumRandomRadius:20,					//In case graphicMode false: maximum random radius
			graphics: [
				'images/flake2.png',
				'images/flake.png'
			]										//In case graphicMode true: array of image urls to use
		},

		//Initialisation
		init: function() {
			//Get the options and merge with defaults
			this.config = $.extend({}, this.defaults, this.options, this.metadata);

			//Variables
			this.x = 0;

			//Get the context from our canvas element
			this.ctx = this.element.getContext('2d');

			//Check if we need to load images (we are in graphic mode)
			if(this.config.graphicMode){

				//Variables we need
				var loadedImages = 0, _self = this;
				this.graphics = [];

				//Loop through the urls in the config
				$.each(this.config.graphics,function(i,el){
					//Push image and set source
					_self.graphics.push(new Image());
					_self.graphics[i].src = el;

					//On load, check if we loaded all images
					_self.graphics[i].onload = function(){
						loadedImages++;

						//Check all images loaded
						if(loadedImages==_self.config.graphics.length){
							//Call necessary functions
							_self.setCanvas();
							_self.createElements();

							//Bind events
							_self.bindResize();
							_self.bindRequestKeyframes();
						}
					};
				});
			}else{
				//Call necessary functions
				this.setCanvas();
				this.createElements();

				//Bind events
				this.bindResize();
				this.bindRequestKeyframes();
			}

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
				this.particles.push(this.createParticle());
			}
		},

		//Function to create a particle
		createParticle: function(config){
			var particle, verticalSpeed, horizontalSpeed, radius,graphic;
			
			//Determine horizontal speed
			if(this.config.randomHorizontalSpeed){
				horizontalSpeed = this.randomValueBetween(this.config.minimumRandomHorizontalSpeed,this.config.maxiumumRandomHorizontalSpeed);
			}else{
				horizontalSpeed = this.config.horizontalSpeed;
			}

			//Determine vertical speed
			if(this.config.randomVerticalSpeed){
				verticalSpeed = this.randomValueBetween(this.config.minimumRandomVerticalSpeed,this.config.maxiumumRandomVerticalSpeed);
			}else{
				verticalSpeed = this.config.verticalSpeed;
			}

			//Determine radius
			if(this.config.randomRadius){
				radius = this.randomValueBetween(this.config.minimumRandomRadius,this.config.maxiumRandomRadius);
			}else{
				radius = this.config.radius;
			}
			
			//In graphic mode, set graphic
			if(this.config.graphicMode){
				graphic = this.graphics[Math.floor(this.randomValueBetween(0,this.graphics.length-1))];
			}

			//Create particle object
			particle =  {
				x: this.randomValueBetween(this.config.horizontalOffsetLeft, this.element.width-this.config.horizontalOffsetRight),
				y:  Math.random()*this.element.height,
				verticalSpeed: verticalSpeed,
				horizontalSpeed: horizontalSpeed,
				radius: radius,
				graphic: graphic
			};
			
			//Return particle with any overrides supplied in config
			return $.extend({}, particle, config);
		},
		randomValueBetween: function(min,max){
			//Random value for two negative values
			if(min<0 && max<0){
				var absMin = Math.abs(max);
				var absMax = Math.abs(min);
				return Math.random()*(absMax-absMin+1) + min;
			//Random value between a negative and a positive value
			}else if(min<0){
				return Math.random()*(max-min) + min;
			//Random value for two positive values
			}else{
				return Math.random()*(max-min+1) + min;
			}
		},
		//Function to draw all the elements on screen
		drawElements: function(){
			//Clear the context
			this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

			//Set the fill style
			this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
			
			//Loop through the particles
			for(var i = 0; i < this.config.amount; i++)
			{	
				//Get particle, move to coordinate and draw circle
				var p = this.particles[i];
				
				//Check graphic mode
				if(this.config.graphicMode){
					//Draw image at coordinates
					this.ctx.drawImage(p.graphic,p.x,p.y);						
				}else{
					//Draw circle at coordinates
					this.ctx.beginPath();
					this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2, false);
					this.ctx.fill();	
				}
			}
		},

		//Function to update position of the elements
		updateElements: function(){
			
			//Time used in sin and cos functions
			this.x+=0.01;

			//Loop through the particles
			for(var i = 0; i < this.config.amount; i++)
			{
				//Get the particle
				var p = this.particles[i];
				
				//Set y position
				p.x += p.horizontalSpeed;
				p.y += p.verticalSpeed;
				
				//Check for out of screen
				if(p.y > this.element.height+p.radius*2){
					//Put the particle on a random coordinate along the top of the screen
					this.particles[i]= this.createParticle({y:this.config.verticalOffsetTop});
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
	};

	//Extend Jquery with the SnowFall function/object
	$.fn.Snowfall = function(options) {
		return this.each(function() {
			//Construct new SnowFall object and call init function
			new Snowfall(this, options).init();
		});
	};
})(jQuery, window, document);