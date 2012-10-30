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
        var _f, _v, j, _e, i, _val, _err,
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
                    if(_fields[i].hasError) {
                        return true;
                    }
                }
                return false;
            },
            _bind = function(data) {
                for(i in data) {
                    if(_fields.hasOwnProperty(i)) {
                        _fields[i].value = data[i];
                    }
                }
                return this;
            },
            __validateField = function(fieldName, callback) {
                _clearErrors(fieldName);
                _f   = _fields[fieldName];
                _val = _f.value;
                _v   = _f.validators;
                _e   = false;
                j;

               if(_v.hasOwnProperty('isValid')) {
                    if( ! _v.isValid(_val)) {
                        _e = _v.errMessage;
                        _addError(fieldName, _e);
                        callback(_e);
                    }
                }
                // Multiple validators
                else if(_v.length) {
                    for(j in _v) {
                        // Sets only one message per validation
                        if( ! _f.hasError) {
                            if( ! _v[j].isValid(_val)) {
                                _e = _v[j].errMessage;
                                _addError(fieldName, _e);
                                callback(_e);
                            }
                        }
                    }
                }

                if( ! _e) {
                    callback();
                }
            },
            __validateForm = function(callback) {
                var _err = false;
                for(i in _fields) {
                    __validateField(i, function(err) {
                        if(err) {
                            _err = true;
                        }
                    });
                }
                callback(_err);
            },
            _validate = function(fieldName, callback) {
                if(typeof fieldName === 'function') {
                    callback = fieldName;
                    __validateForm(callback);
                }
                else if(typeof fieldName === 'string') {
                    __validateField(fieldName, callback);
                }
                return this;
            };

        return {
            element: _p.form,
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
                    if(typeof val !== 'number') {
                        return !!val.trim()
                    }
                    return true;
                }
            };
        },
        email: function(errMessage) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return {
                isValid: function(val) {
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
        min: function(value, errMessage) {
            return {
                isValid: function(val) {
                    val = parseInt(val, 10);
                    return val >= value;
                },
                errMessage: errMessage || ['Minimum value is', value].join(' ')
            };
        },
        max: function(value, errMessage) {
            return {
                isValid: function(val) {
                    val = parseInt(val, 10);
                    return val <= value;
                },
                errMessage: errMessage || ['Maximum value is', value].join(' ')
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


    Eim.Slider = function(_p) {
        // Implementation sample
        _p = {
            targets: $('#images .item, #descriptions .item'), // Fade
            triggers: $('#controls a'), // trigger fade
            targetActiveClass: 'active', // target class
            triggerActiveClass: 'active', //trigger class
            isNumeric: false, // true: [1]  [2]  [3]  [4];    false:  [<]  [>]
            needCss: false,
            needBuildTriggersHtml: false
        };

        // TODO
    };



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
     */
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
            if(typeof callback === 'function') {
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
                                errors.push(_this);
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

