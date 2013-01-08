###
Eim v0.1
github.com/rafbgarcia/eimjs.git

Dependencies: jQuery 1.8.2
###
do(window) ->
    Eim = {}


    # Form
    Eim.Form = (params) ->
        new Form(params)


    # Validators
    Eim.validators =
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



    ###
    Slider

    Keep in mind that, because of the targets which can be an array of jQuery elements,
    this functions works with the indexes of these elements.
    This way, the number of controls and all targets must be the same, as it actually
    should be!

    params example:
    @param params = {
        targets           : $('.photos .photo'), // [$('.pictures'), $('.descriptions')]
        indexControls     : $('.control'),
        prevControl       : $('.slider-prev'),
        nextControl       : $('.slider-next'),
        auto              : false, // Default
        activeClass       : 'active', // Default
        transitionDuration: 600, // Default
        visibleTime       : 6000 // Default
    }
    ###
    Eim.Slider = (params) ->
        new Slider(params)

    Slider = (p) ->
        transitionDuration = p.transitionDuration or 600
        visibleTime        = p.visibleTime or 6000
        targetsArr = p.targets
        if targetsArr instanceof window.jQuery
            targetsArr = [targetsArr]
        controls    = p.indexControls
        prevControl = p.prevControl # TODO
        nextControl = p.nextControl # TODO
        activeClass = p.activeClass or 'active'
        count       = targetsArr[0].length
        interval    = null
        firstTarget = 0
        lastTarget  = targetsArr[0].length - 1

        # Can't have slider if targets are less than 2
        return false if count < 2

        # Exceptions
        throw 'Which are the targets?' if ! targetsArr[0]
        throw 'Which are the triggers?' if ! (controls or prevControl or nextControl)

        # Checks if the number of elements are the same
        for i, targets of targetsArr
            throw ['The number of elements "', targets.selector, '" must be the same as the others targets and indexControls!'].join('') if count != targets.length
        throw 'The number of indexControls must be the same as the targets!' if controls && count != controls.length



        @current = firstTarget

        # Hide first targets
        for i, targets of targetsArr
            targets.not(':first').hide(0)
            # targets.first().siblings().hide(0)

        _addActiveClass = (index) ->
            for i, targets of targetsArr
                targets.removeClass(activeClass)
                targets.eq(index).addClass(activeClass)

            if controls
                controls.removeClass(activeClass)
                controls.eq(index).addClass(activeClass)

            @

        _loadTarget = (index) =>
            return false if @current == index

            for i, targets of targetsArr
                targets.stop(true, true).fadeOut(transitionDuration)
                targets.eq(index).stop(true, true).fadeIn(transitionDuration)
                _addActiveClass(index)

            @current = index
            @

        _loadNextTarget = () ->
            # Checks if exists an next target, if not, firstTarget is passed
            next   = targetsArr[0].siblings(':visible').next(targetsArr[0])
            target = (next.length and targetsArr[0].index(next)) or firstTarget
            _loadTarget target
            @

        _loadPrevTarget = () ->
            # Checks if exists an previous target, if not, lastTarget is passed
            prev   = targetsArr[0].siblings(':visible').prev(targetsArr[0])
            target = (prev.length and targetsArr[0].index(prev)) or lastTarget
            _loadTarget target
            @

        _setInterval = (callback) ->
            interval = window.setInterval(callback, visibleTime)
            @

        _stopSlider = () ->
            window.clearInterval(interval)
            @

        _startSlider = () ->
            if ! p.inverseDirection
                _setInterval () -> _loadNextTarget()
            else
                _setInterval () -> _loadPrevTarget()
            @
        _restartSlider = ->
            _stopSlider()
            _startSlider()

        _addActiveClass(firstTarget)



        # Init slider and its events
        @init = () ->
            # Auto slider
            if p.auto
                _startSlider()

            # On click event
            ## Numeric triggers
            if controls?
                controls.bind 'click', (e) ->
                    e.preventDefault()

                    _loadTarget(controls.index($(this)))
                    if p.auto
                        _restartSlider()

            if prevControl or nextControl
                prevControl.click (e) ->
                    e.preventDefault()
                    _loadPrevTarget()
                    _restartSlider()
                nextControl.click (e) ->
                    e.preventDefault()
                    _loadNextTarget()
                    _restartSlider()

            @

        # Destroy Slider
        @destroy = () ->
            _stopSlider()
            controls.unbind('click')
            @

        # Remake Slider
        @remake = () ->
            @init()
            @

        @init()
        # End Slider


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
                    _inputs = that.find(':input[placeholder]')

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

        # End placeholder


    Form = (params) ->
        formFields = params.fields
        formErrors = {}
        _this      = @

        _validateField = (fieldName, callback) =>
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
                    if( ! field.hasError)
                        if( ! validators[i].isValid(fieldValue))
                            err = validators[i].errMessage
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
                _validateForm(callback)

            else if(typeof fieldName == 'string')
                _validateField(fieldName, callback)

            @

        blurType = params.blurType


        # On Blur
        # # Defaults

        _onBlurTarget = (field, form) ->
            # return target which will receive the errors
            if blurType == 'each' then field.next('.field-error') else $('#form-errors')


        # Each field error has its own element handler
        _blurEach = (error, target, field, form) ->
            target.html(error or '')


        # All in one: all field errors in one element handler
        _blurAio  = (err, target, field, form) ->
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
                blurTarget = _onBlurTarget

            if blurType? and blurType != 'each'
                _this.element.before('<div id="form-errors"></div>')

            for i of formFields
                do (i) ->
                    field = _this.element.find(":input[name='#{i}']")

                    if blurType? and blurType == 'each'
                        field.after('<span class="field-error"></span>')

                    field.blur (e) ->
                        data = {}
                        data[i] = field.val()
                        _this.bind(data)
                        _this.validate i, (err) ->
                            target = blurTarget(field, _this.element)

                            if blurType == 'each'
                                _blurEach(err, target, field, _this.element)
                            else if blurType == 'aio'
                                _blurAio(err, target, field, _this.element)

        # Validates all fields
        ###
        if params.onSubmit?
            @element.submit (e) =>
                e.preventDefault()
                params = @element.serialize()
        ###


        return @
        # End Form


    window.Eim = Eim
