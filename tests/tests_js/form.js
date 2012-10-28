var form, f, i,
validators = Eim.validators,
formHtml   =
'<form action="" id="form-test" style="display:none">' +
	'<input type="text" name="name">' +
	'<input type="text" name="email">' +
	'<input type="text" name="age">' +
	'<button type="submit">Send</button>' +
'</form>'
;

$('#qunit').after(formHtml);



module('Form');

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
		deepEqual(form.errors(), {
			age: "Minimum value is 14",
			email: "Email is invalid",
			name: "The text must have length between 4 and 30"
		});
	});

});

