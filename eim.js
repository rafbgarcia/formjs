/**
 * Eim v0.1
 * github.com/rafbgarcia/eimjs.git
 *
 * Dependencies: jQuery 1.8.2
 */

(function(window) {
	var Eim = {};

	/**
	 * Form validation
	 * @params form, fields, onError, onSuccess
	 */
	Eim.Form = {};
	Eim.Form.validate = function(_p) {
		var i, j, count, _field, _validators, _val, fields, form, _err = {}, errors = {};

		form 	= _p.form   || $('form');
		fields 	= _p.fields || {};

		_p.onSuccess = _p.onSuccess || function(form) {
			form.submit();
		};
		_p.onBlur	 = _p.onBlur || function(err) {
			console.log(err);
			// Clean errors for the next field
			_err = {};
		};
		_p.onError 	 = _p.onError || function(errors) {
			for(i in errors) {
				console.log(errors[i]);
			}
		};


		if( ! form.length) {
			throw 'There is no forms on the page';
		}

		// Trigger validators on blur
		for(i in fields) {
			// i = field name
			(function(i) {

				$('input[name="' + i + '"]').blur(function() {
					_field 		= fields[i];
					_validators = _field.validators;
					_val		= $(this).val();

					if(_validators.hasOwnProperty('isValid')) {
						if( ! _validators.isValid(_val)) {
							_err[i] = _validators.errMessage;
						}
					}
					// Multiple validators
					else {
						for(j in _validators) {
							// Sets only one message per validation
							if( ! _err[i] && ! _validators[j].isValid(_val)) {
								_err[i] = _validators[j].errMessage;
							}
						}
					}

					if(_err[i]) {
						_p.onBlur(_err[i]);
					}
				});

			})(i);
		}


		// TODO validate onsubmit too

		// form.submit(function(e) {
		// 	e.prevenDefault();
		// });
	};

	// Validation types
	Eim.Form.validators = (function() {
		return {
			required: function(errMessage) {
				return {
					errMessage: errMessage || 'Field is required',
					isValid: function(val) {
						// TODO trim
						return !!val
					}
				};
			},

			email: function(errMessage) {
				return {
					isValid: function(val) {
						if(val && 'email_is_valid') {
							// TODO
							return true;
						}
						return false;
					},
					errMessage: errMessage || 'Email is invalid'
				};
			},

			minLength: function(length, errMessage) {
				return {
					isValid: function(val) {
						// TODO dar trim no valor
						return val.length >= length;
					},
					errMessage: errMessage || ['The text is too short, minimum length is', length].join(' ')
				};
			},

			maxLength: function(length, errMessage) {
				return {
					isValid: function(val) {
						// TODO dar trim no valor
						return val.length <= length;
					},
					errMessage: errMessage || ['The text is too long, maximum length is', length].join(' ')
				};
			},

			between: function(min, max, errMessage) {
				return {
					isValid: function(val) {
						// TODO dar trim no valor
						return val.length >= min && val.length <= max;
					},
					errMessage: errMessage || ['The text must have length between', min, 'and', max].join(' ')
				};
			},

			integer: function(errMessage) {
				return {
					isValid: function(val) {
						return val.test(/\d+/);
					},
					errMessage: errMessage || 'Field accepts only numeric values'
				};
			},

			min: function(number, errMessage) {
				return {
					isValid: function(val) {
						if( ! val) return true;
						return val >= number;
					},
					errMessage: errMessage || ['Minimum value is', number].join(' ')
				};
			},

			max: function(number, errMessage) {
				return {
					isValid: function(val) {
						return val <= number;
					},
					errMessage: errMessage || ['Maximum value is', number].join(' ')
				};
			}
		};
	})();



	/**
	 * Send message
	 * Send a message to the user
	 */
	Eim.sendMessage = function(message, title) {
		// TODO
	};




	/**
	 * Improve input files
	 * Gives a better visual for input files
	 */
	Eim.improveInputFile = function(obj) {
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
	Eim.placeholder = function(callback) {
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


	window.Eim = Eim;
})(window);

