/*
* RadioButtonHelper
*
* Copyright (c) 2016 James Tiller Software
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * @module EaselJS
 */

// namespace:
this.createjs = this.createjs||{};

(function() {
	"use strict";


// constructor:
	/**
	 * The RadioButtonHelper is a helper class to create interactive radiobuttons from {{#crossLink "MovieClip"}}{{/crossLink}} or
	 * {{#crossLink "Sprite"}}{{/crossLink}} instances. This class will intercept mouse events from an object, and
	 * automatically call {{#crossLink "Sprite/gotoAndStop"}}{{/crossLink}} or {{#crossLink "Sprite/gotoAndPlay"}}{{/crossLink}},
	 * to the respective animation labels, add a pointer cursor, and allows the user to define a hit state frame.
	 *
	 * This class is based on createjs's standard ButtonHelper class, but it does not derive from it.
	 *
	 * The RadioButtonHelper instance does not need to be added to the stage, but a reference should be maintained to prevent
	 * garbage collection.
	 *
	 * Note that over states will not work unless you call {{#crossLink "Stage/enableMouseOver"}}{{/crossLink}}.
	 *
	 * <h4>Example</h4>
	 *
	 *      var helper = new createjs.RadioButtonHelper(myInstance, "outfalse", "overfalse", "downfalse", "outtrue", "overtrue", "downtrue", false, myInstance, "hit");
	 *      myInstance.addEventListener("click", handleClick);
	 *      function handleClick(event) {
	 *          // Click Happened.
	 *      }
	 *
	 * @class ButtonHelper
	 * @param {Sprite|MovieClip} target The instance to manage.
	 * @param {String} [outLabel="outfalse"] The label or animation to go to when the user rolls out of the button.
	 * @param {String} [overLabel="overfalse"] The label or animation to go to when the user rolls over the button.
	 * @param {String} [downLabel="downfalse"] The label or animation to go to when the user presses the button.
	 * @param {String} [outLabel="outtrue"] The label or animation to go to when the user rolls out of the button.
	 * @param {String} [overLabel="overtrue"] The label or animation to go to when the user rolls over the button.
	 * @param {String} [downLabel="downtrue"] The label or animation to go to when the user presses the button.
	 * @param {Boolean} [play=false] If the helper should call "gotoAndPlay" or "gotoAndStop" on the button when changing
	 * states.
	 * @param {DisplayObject} [hitArea] An optional item to use as the hit state for the button. If this is not defined,
	 * then the button's visible states will be used instead. Note that the same instance as the "target" argument can be
	 * used for the hitState.
	 * @param {String} [hitLabel] The label or animation on the hitArea instance that defines the hitArea bounds. If this is
	 * null, then the default state of the hitArea will be used. *
	 * @constructor
	 */
	function RadioButtonHelper(target, outFalseLabel, overFalseLabel, downFalseLabel, outTrueLabel, overTrueLabel, downTrueLabel, play, hitArea, hitLabel) {
		if (!target.addEventListener) { return; }


	// public properties:
		/**
		 * The target for this button helper.
		 * @property target
		 * @type MovieClip | Sprite
		 * @readonly
		 **/
		this.target = target;

		/**
		 * The label name or frame number to display when the user mouses out of the target. Defaults to "overFalse".
		 * @property overFalseLabel
		 * @type String | Number
		 **/
		this.overFalseLabel = overFalseLabel == null ? "overFalse" : overFalseLabel;

		/**
		 * The label name or frame number to display when the user mouses over the target. Defaults to "outFalse".
		 * @property outFalseLabel
		 * @type String | Number
		 **/
		this.outFalseLabel = outFalseLabel == null ? "outFalse" : outFalseLabel;

		/**
		 * The label name or frame number to display when the user presses on the target. Defaults to "downFalse".
		 * @property downFalseLabel
		 * @type String | Number
		 **/
		this.downFalseLabel = downFalseLabel == null ? "downFalse" : downFalseLabel;

		/**
		 * The label name or frame number to display when the user mouses out of the target. Defaults to "overTrue".
		 * @property overTrueLabel
		 * @type String | Number
		 **/
		this.overTrueLabel = overTrueLabel == null ? "overTrue" : overTrueLabel;

		/**
		 * The label name or frame number to display when the user mouses over the target. Defaults to "outTrue".
		 * @property outTrueLabel
		 * @type String | Number
		 **/
		this.outTrueLabel = outTrueLabel == null ? "outTrue" : outTrueLabel;

		/**
		 * The label name or frame number to display when the user presses on the target. Defaults to "downTrue".
		 * @property downTrueLabel
		 * @type String | Number
		 **/
		this.downTrueLabel = downTrueLabel == null ? "downTrue" : downTrueLabel;

		/**
		 * If true, then ButtonHelper will call gotoAndPlay, if false, it will use gotoAndStop. Default is false.
		 * @property play
		 * @default false
		 * @type Boolean
		 **/
		this.play = play;


	//  private properties
		/**
		 * @property _isPressed
		 * @type Boolean
		 * @protected
		 **/
		this._isPressed = false;

		/**
		 * @property _isOver
		 * @type Boolean
		 * @protected
		 **/
		this._isOver = false;

		/**
		 * @property _enabled
		 * @type Boolean
		 * @protected
		 **/
		this._enabled = false;

		/**
		 * @property _checked
		 * @type Boolean
		 * @protected
		 **/
		this._checked = false;

	// setup:
		target.mouseChildren = false; // prevents issues when children are removed from the display list when state changes.
		this.enabled = true;
		this.handleEvent({});
		if (hitArea) {
			if (hitLabel) {
				hitArea.actionsEnabled = false;
				hitArea.gotoAndStop&&hitArea.gotoAndStop(hitLabel);
			}
			target.hitArea = hitArea;
		}
	}
	var p = RadioButtonHelper.prototype;


// getter / setters:
	/**
	 * Use the {{#crossLink "ButtonHelper/enabled:property"}}{{/crossLink}} property instead.
	 * @method setEnabled
	 * @param {Boolean} value
	 * @deprecated
	 **/
	p.setEnabled = function(value) { // TODO: deprecated.
		if (value == this._enabled) { return; }
		var o = this.target;
		this._enabled = value;
		if (value) {
			o.cursor = "pointer";
			o.addEventListener("rollover", this);
			o.addEventListener("rollout", this);
			o.addEventListener("mousedown", this);
			o.addEventListener("pressup", this);
			if (o._reset) { o.__reset = o._reset; o._reset = this._reset;}
		} else {
			o.cursor = null;
			o.removeEventListener("rollover", this);
			o.removeEventListener("rollout", this);
			o.removeEventListener("mousedown", this);
			o.removeEventListener("pressup", this);
			if (o.__reset) { o._reset = o.__reset; delete(o.__reset); }
		}
	};
	/**
	 * Use the {{#crossLink "ButtonHelper/enabled:property"}}{{/crossLink}} property instead.
	 * @method getEnabled
	 * @return {Boolean}
	 * @deprecated
	 **/
	p.getEnabled = function() {
		return this._enabled;
	};

	/**
	 * Enables or disables the button functionality on the target.
	 * @property enabled
	 * @type {Boolean}
	 **/
	try {
		Object.defineProperties(p, {
			enabled: { get: p.getEnabled, set: p.setEnabled }
		});
	} catch (e) {} // TODO: use Log


// public methods:
	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[RadioButtonHelper]";
	};

	/**
	 * Returns the boolean value of this object
	 * @method getValue
	 * @return {Boolean} the boolean value of the object state
	 **/
	p.getValue = function() {
		return this._checked;
	};

	/**
	 * Sets the boolean value of this object externally
	 * @method setValue
	 * @return {void}
	 **/
	p.setValue = function(val) {
		var label, t = this.target;
		this._checked = val;
		if(this._checked) {
			if(this._isPressed){
				label = this.downTrueLabel;
			} else if (this._isOver) {
				label = this.overTrueLabel;
			} else {
				label = this.outTrueLabel;
			}
		}
		else {
			if(this._isPressed){
				label = this.downFalseLabel;
			} else if (this._isOver) {
				label = this.overFalseLabel;
			} else {
				label = this.outFalseLabel;
			}
		}

		if (this.play) {
			t.gotoAndPlay&&t.gotoAndPlay(label);
		} else {
			t.gotoAndStop&&t.gotoAndStop(label);
		}
	};

// private methods:
	/**
	 * @method handleEvent
	 * @param {Object} evt The mouse event to handle.
	 * @protected
	 **/
	p.handleEvent = function(evt) {
		var label, t = this.target, type = evt.type;
		if(this._checked){
			if (type == "mousedown") {
				this._isPressed = true;
				this._checked = false;
				label = this.downFalseLabel;
			} else if (type == "pressup") {
				this._isPressed = false;
				label = this._isOver ? this.overTrueLabel : this.outTrueLabel;
			} else if (type == "rollover") {
				this._isOver = true;
				label = this._isPressed ? this.downTrueLabel : this.overTrueLabel;
			} else { // rollout and default
				this._isOver = false;
				label = this._isPressed ? this.overTrueLabel : this.outTrueLabel;
			}
		} else {
			if (type == "mousedown") {
				this._isPressed = true;
				this._checked = true;
				label = this.downTrueLabel;
			} else if (type == "pressup") {
				this._isPressed = false;
				label = this._isOver ? this.overFalseLabel : this.outFalseLabel;
			} else if (type == "rollover") {
				this._isOver = true;
				label = this._isPressed ? this.downFalseLabel : this.overFalseLabel;
			} else { // rollout and default
				this._isOver = false;
				label = this._isPressed ? this.overFalseLabel : this.outFalseLabel;
			}
		}
		if (this.play) {
			t.gotoAndPlay&&t.gotoAndPlay(label);
		} else {
			t.gotoAndStop&&t.gotoAndStop(label);
		}
	};

	/**
	 * Injected into target. Preserves the paused state through a reset.
	 * @method _reset
	 * @protected
	 **/
	p._reset = function() {
		// TODO: explore better ways to handle this issue. This is hacky & disrupts object signatures.
		var p = this.paused;
		this.__reset();
		this.paused = p;
	};


	createjs.RadioButtonHelper = RadioButtonHelper;
}());
