
## In development


### Starting

    <script src="jquery.js"></script>
    <script src="eim.js"></script>


_View samples page for examples of implementation_


# Form

Form validation is easy as follow:

    <form action="" method="post" id="form">
        <div>
            <label for="">Name</label>
            <input type="text" name="name">
        </div>
        <div>
            <label for="">Email</label>
            <input type="text" name="email">
        </div>
        <div>
            <label for="">Age</label>
            <input type="text" name="age">
        </div>
        <button type="submit">Submit</button>
    </form>


	$(function() {
        var form,
            validators = Eim.validators;

        form = Eim.Form({
            form: $('#form'),
            fields : {
                email: {
                    validators: [validators.required(), validators.email()]
                },
                name: {
                    validators: [validators.required(), validators.betweenLength(4, 30)]
                },
                age: {
                    validators: [validators.required(), validators.numeric(), validators.min(14, 'You are too young!')]
                }
            },
            fieldBlur: true, // true if you want validation on field blur
            blurType: 'each' // 'each' or 'aio'
                             // 'each' puts validation below of each field
                             // 'aio' puts all validations in a single element before form tag
        });
    });

    <!-- If the field has error, an span will be placed after the input -->
    ...
    <div>
        <label for="">Name</label>
        <input type="text" name="name">
        <span class="field-error">Field is required</span>
    </div>
    ...



## Eim.Validators

You are not required to use integrated to Eim.Form

	$(function() {
		$('input#email').blur(function() {
			var _this      = $(this),
				value 	   = _this.val(),
				validators = Eim.validators;

			if( ! validators.email().isValid(value)) {
				_this.css('border-color', '#f00');
			}
		});
	});

If you need a custom message: `validators.email('Hey! This is not a valid email!')`

Need a new validator? No problem:

    ...
    <input type="text" name="custom">
    ...

    ...
    validators.custom = {
        isValid: function(val) {
            return val === "Hello there";
        },
        errMessage: 'Value must be "Hello there"'
    };
    ...
    custom: validators.custom
    ...




# Placeholder

Apply placeholder **(IE only)**.

`Eim.placeholder();`


If you need to handle the submited form, just use:

`Eim.placeholder(function(errors, form) {});`

`form` is the form which is being submitted.

`errors` brings the $('input') elements that has value == placeholder, so you can handle it:

	Eim.placeholder(function(errors, form) {
		if( ! errors) {
			form.submit();
		}
		else {
			for(i in errors) {
				console.log(errors[i].attr('name'));
			}
		}
	});



