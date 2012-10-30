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
            errMessage: errMessage or 'Field is required',
            isValid: (val) ->
                if(typeof val != 'number')
                    return !!val.trim()
                return true

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


    Form = (data) ->
        formFields = data.fields
        formErrors = {}

        _validateField = (fieldName, callback) ->
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
            err = false
            for i of formFields
                _validateField i, (err) ->
                    if(err)
                        err = true

            callback(err)


        @element  = data.form

        @addError = (fieldName, error) ->
            formErrors[fieldName]          = error
            formFields[fieldName].hasError = true
            formFields[fieldName].error    = error

        @clearErrors = (fieldName) ->
            formErrors[fieldName]          = undefined
            formFields[fieldName].hasError = undefined
            formFields[fieldName].error    = undefined

        @getFields = (name) ->
            (name and formFields[name]) or formFields

            # if(name and formFields[name])
            #     return formFields[name]
            # formFields

        @getErrors = () ->
            formErrors

        @hasErrors = () ->
            for i of formFields
                if(formFields[i].hasError)
                    true
            false

        @bind = (data) ->
            for i of data
                if(formFields.hasOwnProperty(i))
                    formFields[i].value = data[i]

            @

        @validate = (fieldName, callback) ->
            if(typeof fieldName == 'function')
                callback = fieldName
                __validateForm(callback)

            else if(typeof fieldName == 'string')
                __validateField(fieldName, callback)

            @

        @

    window.Eim = Eim
