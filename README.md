## Form & Validators


### Starting

    <script src="jquery.js"></script>
    <script src="form.js"></script>


_View samples page for examples of implementation_


# Form

Suppose you have a form:

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


Validating will be

	$(function() {
        var form,
            validators = Validators();

        form = Form({
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



## Validators

You are not required to use integrated to Form

	$(function() {
		$('input#email').blur(function() {
			var self  = $(this),
				value = self.val();

			if( ! Validators().email().isValid(value)) {
				self.css('border-color', '#f00');
			}
		});
	});

If you need a custom message: `validators.email('Hey! This is not a valid email!')`

Need a new validator?

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


