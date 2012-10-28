/**
 * Eim v0.1
 * github.com/rafbgarcia/eimjs.git
 *
 * Dependencies: jQuery 1.8.2
 */

(function(window) {
    var Eim  = {},
        Form;

    Form = function(_p) {
        var _f, _v, j, _e, i,
            _that      = this,
            _errors    = {},
            _fields    = _p.fields,
            _addError = function(fieldName, error) {
                if(_fields.hasOwnProperty(fieldName)) {
                    _errors[fieldName]          = error;
                    _fields[fieldName].hasError = true;
                    _fields[fieldName].error    = error;
                }
            },
            _clearErrors = function(fieldName) {
                // console.log(_errors);
                // console.log(fieldName);
                // console.log(_errors.hasOwnProperty(fieldName));

                if(_errors.hasOwnProperty(fieldName)) {
                    _errors[fieldName] = undefined;
                }
                if(_fields.hasOwnProperty(fieldName)) {
                    _fields[fieldName].hasError = undefined;
                    _fields[fieldName].error    = undefined;
                }
            },
            _getFields = function(name) {
                if(name && _fields[name]) {
                    return _fields[name];
                }
                return _fields;
            },
            _getErrors = function() {
                return _errors;
            },
            _hasErrors = function() {
                for(i in _fields) {
                    if(_errors.hasOwnProperty(i)) {
                        return true;
                    }
                }
                return false;
            },
            _bind = function(data) {
                for(i in data) {
                    if(_fields.hasOwnProperty(i)) {
                        _validate(i, data[i], function(err) {
                            if(err) {
                                _addError(i, err);
                            }
                            _fields[i].value = data[i];
                        });
                    }
                }
            },
            _validate = function(fieldName, value, callback) {
                _clearErrors(fieldName);
                _f = _fields[fieldName];
                _v = _f.validators;
                _e = false;


                if(_v) {
                   if(_v.hasOwnProperty('isValid')) {
                        if( ! _v.isValid(value)) {
                            _e = true;
                            callback(_v.errMessage);
                        }
                    }
                    // Multiple validators
                    else if(_v.length) {
                        for(j in _v) {
                            // Sets only one message per validation
                            if( ! _f.hasErrors && ! _v[j].isValid(value)) {
                                _e = true;
                                callback(_v[j].errMessage);
                            }
                        }
                    }
                }
                // if has not validators or errors
                if( ! _v || ! _e) {
                    callback();
                }
            };

        return {
            fields: _getFields,
            errors: _getErrors,
            hasErrors: _hasErrors,
            bind: _bind,
            validate: _validate
        };
    };

    Eim.Form = function(data) {
        return new Form(data);
    };

    Eim.validators = {
        required: function(errMessage) {
            return {
                errMessage: errMessage || 'Field is required',
                isValid: function(val) {
                    return !!val.trim()
                }
            };
        },
        email: function(errMessage) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return {
                isValid: function(val) {
                    test = regex.test(val);
                    if(val && regex.test(val)) {
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
                    return val.toString().trim().length >= length;
                },
                errMessage: errMessage || ['The text is too short, minimum length is', length].join(' ')
            };
        },
        maxLength: function(length, errMessage) {
            return {
                isValid: function(val) {
                    return val.toString().trim().length <= length;
                },
                errMessage: errMessage || ['The text is too long, maximum length is', length].join(' ')
            };
        },
        betweenLength: function(minLength, maxLength, errMessage) {
            return {
                isValid: function(val) {
                    var valLength = val.toString().trim().length;
                    return (valLength >= minLength && valLength <= maxLength);
                },
                errMessage: errMessage || ['The text must have length between', minLength, 'and', maxLength].join(' ')
            };
        },
        numeric: function(errMessage) {
            return {
                isValid: function(val) {
                    return $.isNumeric(val);
                },
                errMessage: errMessage || 'Field accepts only numeric values'
            };
        },
        min: function(number, errMessage) {
            return {
                isValid: function(val) {
                    val = parseInt(val, 10);
                    if(typeof val !== 'number' && !val)
                        return true;
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
        },
        between: function(min, max, errMessage) {
            return {
                isValid: function(val) {
                    val = parseInt(val, 10);
                    return val >= min && val <= max;
                },
                errMessage: errMessage || ['The value must be between', min, 'and', max].join(' ')
            };
        },
        match: function(field, errMessage) {
            if(typeof field === 'string') {
                field = $('input[name="' + field + '"]')
            }

            return {
                isValid: function(val) {
                    return field.val() === val;
                },
                errMessage: errMessage || ['Field does not match with field', field.attr('name')].join(' ')
            };
        }
    };











    /**
     * Form validation
     * @params form, fields, onError, onSuccess
     */

     /*
    Eim.Form = {};
    Eim.Form.validate = function(_p) {
        var i, j, count, that, _field, _validators, _val, fields, form, _err = {}, errors = {}, has_errors = false;

        form    = _p.form   || $('form');
        fields  = _p.fields || {};

        _p.onSuccess = _p.onSuccess || function(form) {
            form.submit();
        };
        _p.onBlur    = _p.onBlur || function(err, field) {
            console.log(field + ': ' +err);
            // Clean errors for the next field
            _err = {};
        };
        _p.onError   = _p.onError || function(errors) {
            for(i in errors) {
                console.log(errors[i]);
            }
        };


        if( ! form.length) {
            throw 'There are no forms on the page';
        }

        // Trigger validators on blur
        for(i in fields) {
            // i = field name
            (function(i) {

                $('input[name="' + i + '"]').blur(function() {
                    that        = $(this);
                    _field      = fields[i];
                    _validators = _field.validators;
                    _val        = that.val();


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
                        _p.onBlur(_err[i], that);
                    }
                });

            })(i);
        }


        // TODO validate onsubmit too

        // form.submit(function(e) {
        //  e.prevenDefault();
        // });
    };

    // Validation types
    Eim.Form.



    Eim.sendMessage = function(message, title) {
        // TODO
    };



    Eim.improveInputFile = function(obj) {
        obj = obj || $('input:file');
        // TODO
    };


    /**
     * Placeholder (for IE only)
     *
     * @param callback set a callback if you need to validate your form fields,
     *                 it will be triggered if form has fields with value == placeholder
     *                 callback(fieldsNamesWithErrors, submittedForm)
    Eim.placeholder = function(callback) {
        // Apply the function only on IE
        if(navigator.appName === 'Microsoft Internet Explorer') {
            var _this, i, that, _inputs,
                submited = {},
                inputs   = $(':input[placeholder]'),
                forms    = $('form'),
                errors   = [],
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
                    errors  = [];
                    that    = $(this);
                    i       = that.index(forms);
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

     */

    window.Eim = Eim;
})(window);

