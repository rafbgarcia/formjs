var form, f,
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

test('fields', function() {

	f = form.fields();

	ok( Object.keys(f).length === 3);
	ok( f.hasOwnProperty('name') && f.hasOwnProperty('email') && f.hasOwnProperty('age') );
	ok( form.fields('email').hasOwnProperty('validators') );
});

test('validate', function() {
	form.validate('email', 'asddf', function(err) {
		ok( err );
	});
	form.validate('email', 'test@gmail.com', function(err) {
		equal( err, undefined );
	});
});

test('bind', function() {
	form.bind({
		name : 'person name',
		email: 'test@gmail.com'
	});

	equal( form.hasErrors(), false, 'No errors' );
	equal( form.fields('email').value, 'test@gmail.com');
	equal( form.fields('name').value, 'person name');
	equal( form.fields('age').value, undefined);
});

test('hasErrors', function() {
	form.bind({
		email: 'wrong email',
		name : 'a'
	});

	equal( form.fields('email').hasError, true);
	equal( form.fields('name').hasError, true);
	equal( form.fields('age').hasError, undefined);
	equal( form.fields('email').value, 'wrong email');
	equal( form.fields('name').value, 'a');
	equal( form.fields('age').value, undefined);

	equal( form.hasErrors(), true);
	deepEqual( form.errors(), {
	  	"email": "Email is invalid",
	  	"name": "The text must have length between 4 and 30"
	} );
});

