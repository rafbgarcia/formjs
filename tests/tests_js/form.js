var form, f, i,
validators = Eim.validators,
formHtml   =
'<form action="" id="form-test">' +
	'<div><label>Name: </label><input type="text" name="name"></div>' +
	'<div><label>Email: </label><input type="text" name="email"></div>' +
	'<div><label>Age: </label><input type="text" name="age"></div>' +
	'<div><button type="submit">Send</button></div>' +
'</form>'
;

$(function() {
	$('#qunit').after(formHtml);

	form = Eim.Form({
		form: $('#form-test'),
		fields : {
			email: {
				validators: [validators.required(), validators.email()]
			},
			name: {
				validators: [validators.required(), validators.betweenLength(4, 30)]
			},
			age: {
				validators: [validators.required(), validators.min(14)]
			}
		}
	});
});



module('Form');


test('fields', 7, function() {
	f = form.fields();

	equal( Object.keys(f).length, 3);
	for(i in f) {
		ok( f.hasOwnProperty(i) );
		ok( f[i].hasOwnProperty('validators') );
	}
});


test('bind', function() {
	form.bind({
		name : 'person name',
		email: 'test@gmail.com',
		age: 15
	});

	equal( form.fields('name').value, 'person name');
	equal( form.fields('email').value, 'test@gmail.com');
	equal( form.fields('age').value, 15);

	form.bind({
		name : 'person name is too looooooooooong',
		email: 'invalid email',
		age: 11
	});

	equal( form.fields('name').value, 'person name is too looooooooooong');
	equal( form.fields('email').value, 'invalid email');
	equal( form.fields('age').value, 11);
});


test('validate', function() {
	form.bind({
		email: 'valid@valid.com'
	})
	// Validates a single field
	.validate('email', function(err) {
		equal(err, undefined );
		equal(form.fields('email').hasError, undefined);
		equal(form.fields('email').error, undefined);
	})


	.bind({
		email: 'invalid',
		name: '',
		age: 16
	})
	// Validates all form fields
	.validate(function(err) {
		equal(err, true);

		equal(form.fields('email').hasError, true);
		equal(form.fields('email').error, 'Email is invalid');
		equal(form.fields('name').hasError, true);
		equal(form.fields('name').error, 'Field is required');
		equal(form.fields('age').hasError, undefined);
		equal(form.fields('age').error, undefined);
	});
});

test('hasErrors', function() {
	// valid data
	form.bind({
		name : 'person name',
		email: 'test@gmail.com',
		age: 15
	})
	.validate(function() {
		equal(form.fields('email').hasError, undefined);
		equal(form.fields('name').hasError, undefined);
		equal(form.fields('age').hasError, undefined);
		equal(form.hasErrors(), false);
	})

	// invalid data
	.bind({
		name : 'person name is too looooooooooong',
		email: 'invalid email',
		age: 11
	})
	.validate(function() {
		equal(form.fields('email').hasError, true);
		equal(form.fields('name').hasError, true);
		equal(form.fields('age').hasError, true);
		equal(form.hasErrors(), true);
		deepEqual(form.errors, {
			age: "Minimum value is 14",
			email: "Email is invalid",
			name: "The text must have length between 4 and 30"
		});
	});

});

test('onBlur', function() {
	$(function() {
		var input = $('input[name="email"]'),
			err;


		// blurType = 'each'
		form = Eim.Form({
			form: $('#form-test'),
			fields : {
				email: {
					validators: [validators.required(), validators.email()]
				},
				name: {
					validators: [validators.required(), validators.betweenLength(4, 30)]
				},
				age: {
					validators: [validators.required(), validators.min(14)]
				}
			},
			fieldBlur: true,
			blurType: 'each'
		});


		equal($('.field-error').length, 3);

		input.focus().blur();
		err = input.next('.field-error');

		equal(err.html(), 'Field is required');


		input.val('asd').blur();
		equal(err.html(), 'Email is invalid');


		input.val('valid@gmail.com').blur();
		equal(err.html(), '');


		// blurType = 'aio'
		form = Eim.Form({
			form: $('#form-test'),
			fields : {
				email: {
					validators: [validators.required(), validators.email()]
				},
				name: {
					validators: [validators.required(), validators.betweenLength(4, 30)]
				},
				age: {
					validators: [validators.required(), validators.min(14)]
				}
			},
			fieldBlur: true,
			blurType: 'aio'
		});

		equal($('#form-errors').length, 1);

		input.val('').blur();
		err = $('#field-error-email');

		equal($('#form-errors p').length, 1);
		equal(err.html(), 'email: Field is required');

		input.val('asd').blur();
		input.val('asasdsdd').blur();
		input.val('asasdsdd').blur();
		equal(err.html(), 'email: Email is invalid');
		equal(err.length, 1);

		input.val('ads@asd.com').blur();
		equal(err.html(), '');

	});
});
