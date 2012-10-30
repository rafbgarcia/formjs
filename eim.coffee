###
Eim v0.1
github.com/rafbgarcia/eimjs.git

Dependencies: jQuery 1.8.2
###
do(window) ->
    Eim = {}

    # Form
    Eim.Form = (data) ->
        new Form(data)

    # Validators
    Eim.validators =
        required: (errMessage) ->
            isValid: (val) ->
                if(typeof val != 'number')
                    return !!val.trim()
                return true
            errMessage: errMessage or 'Field is required',

        email: (errMessage) ->
            regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

            isValid: (val) ->
                if(val and regex.test(val))
                    return true
                return false
            errMessage: errMessage or 'Email is invalid'

        minLength: (length, errMessage) ->
            isValid: (val) ->
                val.toString().trim().length >= length
            errMessage: errMessage or ['The text is too short, minimum length is', length].join(' ')

        maxLength: (length, errMessage) ->
            isValid: (val) ->
                val.toString().trim().length <= length
            errMessage: errMessage or ['The text is too long, maximum length is', length].join(' ')

        betweenLength: (minLength, maxLength, errMessage) ->
            isValid: (val) ->
                valLength = val.toString().trim().length
                return (valLength >= minLength and valLength <= maxLength)
            errMessage: errMessage or ['The text must have length between', minLength, 'and', maxLength].join(' ')

        numeric: (errMessage) ->
            isValid: (val) ->
                $.isNumeric(val)
            errMessage: errMessage or 'Field accepts only numeric values'

        min: (value, errMessage) ->
            isValid: (val) ->
                val = parseInt(val, 10)
                return val >= value
            errMessage: errMessage or ['Minimum value is', value].join(' ')

        max: (value, errMessage) ->
            isValid: (val) ->
                val = parseInt(val, 10)
                return val <= value
            errMessage: errMessage or ['Maximum value is', value].join(' ')

        between: (min, max, errMessage) ->
            isValid: (val) ->
                val = parseInt(val, 10)
                return val >= min and val <= max
            errMessage: errMessage or ['The value must be between', min, 'and', max].join(' ')

        match: (field, errMessage) ->
            if(typeof field == 'string')
                field = $(['input[name="', field, '"]'].join(''))

            isValid: (val) ->
                return field.val() == val
            errMessage: errMessage or ['Field does not match with field', field.attr('name')].join(' ')




    Eim.Slider = (_p) ->
        # Implementation sample
        _p =
            targets: $('#images .item, #descriptions .item') # targets which will receive the effect
            triggers: $('#controls a')                       # numeric triggers
            targetActiveClass: 'active'                      # active class for target
            triggerActiveClass: 'active'                     # active class for trigger
            sliderType: 'numeric'                            # numeric, side, both
            needCss: false
            needBuildTriggersHtml: false

        # TODO



    Eim.sendMessage = (message, title) ->
        # TODO


    Eim.improveInputFile = (obj) ->
        obj = obj or $('input:file')
        # TODO


    ###
    Placeholder (for IE only)
    @param callback set a callback if you need to validate your form fields,
           it will be triggered if form has fields with value == placeholder
           callback(fieldsNamesWithErrors, submittedForm)
     ###
    Eim.placeholder = (callback) ->
        # Apply the function only on IE
        if(navigator.appName == 'Microsoft Internet Explorer')
            submited = {}
            inputs   = $(':input[placeholder]')
            forms    = $('form')
            errors   = []
            valueEqualsPlaceholder = (element) ->
                element.val() == element.attr('placeholder')


            # Input actions
            inputs.each(() ->
                _this = $(this)
                _this.val(_this.attr('placeholder'))
            )
            .focus(() ->
                _this = $(this)
                if(valueEqualsPlaceholder(_this))
                    _this.val('')
            )
            .blur () ->
                _this = $(this)
                if( ! _this.val())
                    _this.val(_this.attr('placeholder'))


            # Checks if the form has fields with value attribute equals to placeholder
            if(typeof callback == 'function')
                forms.submit (e) ->
                    errors  = []
                    that    = $(this)
                    i       = that.index(forms)
                    _inputs = that.find('input[placeholder]')

                    # Avoids recursion
                    if( ! submited[i])
                        e.preventDefault()
                        submited[i] = true

                        _inputs.each () ->
                            _this = $(this)
                            if(valueEqualsPlaceholder(_this))
                                errors.push(_this)

                        if(errors.length)
                            submited[i] = false

                        callback(errors, that)




    Form = (data) ->
        formFields = data.fields
        formErrors = {}


        _validateField = (fieldName, callback) =>
            @clearErrors(fieldName)
            field       = formFields[fieldName]
            fieldValue  = field.value
            validator   = field.validators
            err         = false

            if(validator.hasOwnProperty('isValid'))
                if( ! validator.isValid(fieldValue))
                    err = validator.errMessage
                    @addError(fieldName, err)
                    callback(err)

            # Multiple validators
            else if(validator.length)
                for i of validator
                    # Sets only one message per validation
                    if( ! field.hasError)
                        if( ! validator[i].isValid(fieldValue))
                            err = validator[i].errMessage
                            @addError(fieldName, err)
                            callback(err)

            if( ! err)
                callback()


        _validateForm = (callback) ->
            error = false
            for i of formFields
                _validateField i, (err) ->
                    if(err)
                        error = true

            callback(error)



        @element  = data.form

        @addError = (fieldName, error) ->
            formErrors[fieldName]          = error
            formFields[fieldName].hasError = true
            formFields[fieldName].error    = error

        @clearErrors = (fieldName) ->
            formErrors[fieldName]          = undefined
            formFields[fieldName].hasError = undefined
            formFields[fieldName].error    = undefined

        @fields = (name) ->
            (name and formFields[name]) or formFields

        @errors = () ->
            formErrors

        @hasErrors = () ->
            for i of formFields
                if(formFields[i].hasError)
                    return true
            return false

        @bind = (data) ->
            for i of data
                if(formFields.hasOwnProperty(i))
                    formFields[i].value = data[i]

            @

        @validate = (fieldName, callback) ->
            if(typeof fieldName == 'function')
                callback = fieldName
                _validateForm(callback)

            else if(typeof fieldName == 'string')
                _validateField(fieldName, callback)

            @


        return @


    window.Eim = Eim
