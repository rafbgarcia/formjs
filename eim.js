/**
 * Eim.js v0.1
 * Common functions for websites
 *
 * Dependencies: jQuery 1.8.2
 *
 * @author Rafael Garcia
 */

var Eim = function() {
	var _ = this;

	/**
	 * Form validation
	 */
	_.formValidate = function(form, fields, callback) {
		var i,
			errors = {},
			val = '';
		form.submit(function() {
			for(i in Object.keys(fields)) {
				val = form.children(i);
				console.log(i);
			}
		});
	};

	// Validation types
	_.validation = {
		// Checks if email is valid
		email: function(errMessage) {
			return {
				isValid: function(val) {
					// TODO
				}
				errMessage: errMessage || 'Email is invalid';
			};
		},
		minLength: function(length, errMessage) {
			return {
				isValid: function(val) {
					// TODO dar trim no valor
					return val.length >= length;
				}
				errMessage: errMessage || ['The text is too short, minimum length is', length].join(' ');
			};
		},
		maxLength: function(length, errMessage) {
			return {
				isValid: function(val) {
					// TODO dar trim no valor
					return val.length <= length;
				}
				errMessage: errMessage || ['The text is too long, maximum length is', length].join(' ');
			};
		},
		between: function(min, max, errMessage) {
			return {
				isValid: function(val) {
					// TODO dar trim no valor
					return val.length >= min && val.length <= max;
				},
				errMessage: errMessage || ['The text must have length between', min, 'and', max].join(' ');
			};
		},
		// Checks if field has only numeric values
		integer: function(errMessage) {
			return {
				isValid: function(val) {
					return val.test(/\d+/);
				}
				errMessage: errMessage || 'Field accepts only numeric values';
			};
		}
	};

	/**
	 * Send message
	 * Send a message to the user
	 */
	_.sendMessage = function(message, title) {
		// TODO
	};




	/**
	 * Improve input files
	 * Gives a better visual for input files
	 */
	_.improveInputFile = function(obj) {
		obj = obj || $('input:file');
		// TODO
	};


	/**
	 * Placeholder (for IE only)
	 *
	 * @param callback set a callback if you need to validate your form fields,
	 *				   it will be triggered if form has fields with value == placeholder
	 * 				   callback(fieldsNamesWithErrors, submittedForm)
	 */
	_.placeholder = function(callback) {
		// Apply the function only on IE
		if(navigator.appName === 'Microsoft Internet Explorer') {
			var _this, i, that, _inputs,
				submited = {},
				inputs 	 = $(':input[placeholder]'),
				forms  	 = $('form'),
				errors 	 = [],
				valueEqualsPlaceholder = function(element) {
					return ( element.val() == element.attr('placeholder') );
				};


			// Input actions
	        inputs.each(function() {
	        	_this = $(this);
	            _this.val(_this.attr('placeholder'));
	        })
	        .focus(function(){
	        	_this = $(this);
	            if(valueEqualsPlaceholder(_this)) {
	                _this.val('');
	            }
	        })
	        .blur(function(){
	        	_this = $(this);
	            if( ! _this.val()) {
	                _this.val(_this.attr('placeholder'));
	            }
	        });


	        // Checks if the form has fields with value attribute equals to placeholder
	        if(callback && typeof callback === 'function') {
	        	forms.submit(function(e) {
	        		errors 	= [];
	        		that   	= $(this);
	        		i 	   	= that.index(forms);
	        		_inputs = that.find('input[placeholder]');

	        		// Avoids recursion
	        		if( ! submited[i]) {
		        		e.preventDefault();
						submited[i] = true;

				        _inputs.each(function() {
				        	_this = $(this);
				        	if(valueEqualsPlaceholder(_this)) {
				        		errors.push(_this.attr('name'));
				        	}
				        });

				        if(errors.length) {
							submited[i] = false;
				        }
				        callback(errors, that);
	        		}
		        });
	        }
	    }
	};


	// Return obj
	return _;
}();
