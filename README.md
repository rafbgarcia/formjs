
## In development


### Starting

    <script src="jquery.js"></script>
    <script src="eim.js"></script>


_View samples page for examples of implementation_


# Form

Form validation is easy as follow:

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
                },
                text: {
                    validators: validators.maxLength(10)
                },
                people: {
                    validators: [validators.required(), validators.max(4, 'Sorry, only 4 people are allowed!')]
                }
            },
            fieldBlur: true, // true if you want validation on field blur
            blurType: 'each' // 'each' or 'aio'
                             // 'each' puts validation below of each field
                             // 'aio' puts all validations in a single element before form tag
        });
    });



## Eim.Validators

`Eim.validators` has validators that you can use to validate anything you need

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



