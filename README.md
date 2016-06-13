# CreateJSRadioButtons
Helper classes for creating RadioButtons and CheckBoxes in CreateJS/EaselJS 

These are used in pretty much the same way as the ButtonHelper class, with a few exceptions.
There are now 6 state params instead of 3, which are exactly the same as ButtonHelper's out, over, down states, but they've been doubled to handle true/false behavior. 

If you want to get/set the value of the radio button, use the getValue and setValue of the helper class.

Remember, like ButtonHelper, to store the helper somewhere other than the frame function, or it'll get garbage collected, and you'll get odd behavior.
// somewhere
var helpers = {};

// in frame
var helper = helpers[this.name] ? helpers[this.name] : new RadioButtonHelper(this);
