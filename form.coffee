###
github.com/rafbgarcia/form

Dependencies: jQuery 1.8.2
###
do(window) ->
    # Form
    window.Form = (params) ->
        new Form(params)

    # Validators
    window.Validators = ->
        required: (errMessage) ->
            isValid: (val) ->
                !!val.toString().trim()
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
            errMessage: errMessage or "The text is too short, minimum length is #{length}"

        maxLength: (length, errMessage) ->
            isValid: (val) ->
                val.toString().trim().length <= length
            errMessage: errMessage or "The text is too long, maximum length is #{length}"

        betweenLength: (minLength, maxLength, errMessage) ->
            isValid: (val) ->
                valLength = val.toString().trim().length
                return (valLength >= minLength and valLength <= maxLength)
            errMessage: errMessage or "The text must have length between #{minLength} and #{maxLength}"

        numeric: (errMessage) ->
            isValid: (val) ->
                $.isNumeric(val)
            errMessage: errMessage or 'Field accepts only numeric values'

        min: (value, errMessage) ->
            isValid: (val) ->
                val = parseInt(val, 10)
                return val >= value
            errMessage: errMessage or "Minimum value is #{value}"

        max: (value, errMessage) ->
            isValid: (val) ->
                val = parseInt(val, 10)
                return val <= value
            errMessage: errMessage or "Maximum value is #{value}"

        between: (min, max, errMessage) ->
            isValid: (val) ->
                val = parseInt(val, 10)
                return val >= min and val <= max
            errMessage: errMessage or "The value must be between #{min} and #{max}"

        match: (field, errMessage) ->
            if(typeof field == 'string')
                field = $(":input[name='#{field}']")

            isValid: (val) ->
                return field.val() == val
            errMessage: errMessage or ['Field does not match with field', field.attr('name')].join(' ')


    Form = (params) ->
        formFields = params.fields
        formErrors = {}
        self       = @

        validateField = (fieldName, callback) =>
            @clearErrors(fieldName)
            field      = formFields[fieldName]
            fieldValue = field.value
            validators = field.validators
            err        = false

            if(validators.hasOwnProperty('isValid'))
                if( ! validators.isValid(fieldValue))
                    err = validators.errMessage
                    @addError(fieldName, err)
                    callback(err)

            # Multiple validators
            else if(validators.length)
                for i of validators
                    # Sets only one message per validation
                    if(!field.hasError && !validators[i].isValid(fieldValue))
                        err = validators[i].errMessage
                        @addError(fieldName, err)
                        callback(err)

            if( ! err)
                callback()

        validateForm = (callback) ->
            error = false
            for i of formFields
                validateField i, (err) ->
                    if(err)
                        error = true

            callback(error)

        @element = params.form

        @fields = (name) ->
            (name and formFields[name]) or formFields

        @bind = (data) ->
            for i of data
                if(formFields.hasOwnProperty(i))
                    formFields[i].value = data[i]

            @

        @errors = formErrors

        @addError = (fieldName, error) ->
            formErrors[fieldName]          = error
            formFields[fieldName].hasError = true
            formFields[fieldName].error    = error

        @hasErrors = () ->
            for i of formFields
                if(formFields[i].hasError)
                    return true
            return false

        @clearErrors = (fieldName) ->
            formErrors[fieldName]          = undefined
            formFields[fieldName].hasError = undefined
            formFields[fieldName].error    = undefined

        @validate = (fieldName, callback) ->
            if(typeof fieldName == 'function')
                callback = fieldName
                validateForm(callback)

            else if(typeof fieldName == 'string')
                validateField(fieldName, callback)

            @

        blurType = params.blurType


        # On Blur
        # # Defaults

        onBlurTarget = (field, form) ->
            # return target which will receive the errors
            if blurType == 'each' then field.next('.field-error') else $('#form-errors')


        # Each field error has its own element handler
        blurEach = (error, target, field, form) ->
            target.html(error or '')


        # All in one: all field errors in one element handler
        blurAio  = (err, target, field, form) ->
            name = field.attr('name')
            error = $("#field-error-#{name}")
            if(err)
                message = "#{name}: #{err}"

                if error.length
                    if message != error.html()
                        error.html(message)
                else
                    message = "<p id='field-error-#{name}'>#{message}</p>"
                    target.append(message)

            else if error.length
                error.html('')

        # # Actions
        if params.fieldBlur == true
            blurTarget = params.onBlurTarget

            if typeof blurTarget != 'function'
                blurTarget = onBlurTarget

            if blurType? and blurType != 'each'
                self.element.before('<div id="form-errors"></div>')

            for i of formFields
                do (i) ->
                    field = self.element.find(":input[name='#{i}']")

                    if blurType? and blurType == 'each'
                        field.after('<span class="field-error"></span>')

                    field.blur (e) ->
                        data = {}
                        data[i] = field.val()
                        self.bind(data)
                        self.validate i, (err) ->
                            target = blurTarget(field, self.element)

                            if blurType == 'each'
                                blurEach(err, target, field, self.element)
                            else if blurType == 'aio'
                                blurAio(err, target, field, self.element)

        # Validates all fields
        ###
        if params.onSubmit?
            @element.submit (e) =>
                e.preventDefault()
                params = @element.serialize()
        ###


        return @
        # End Form

