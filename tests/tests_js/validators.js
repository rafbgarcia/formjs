var validators = Validators(),
    current;

module('Validators');

test('required', function() {
    current = validators.required();

    ok( current.isValid('a') );
    ok( ! current.isValid('') );
    ok( ! current.isValid('   ') );

    equal( validators.required('Required').errMessage, 'Required' );
    equal( current.errMessage, 'Field is required' );
});

test('email', function() {
    current = validators.email();

    ok( current.isValid('test@gmail.com') );
    ok( current.isValid('test.foo_@yahoo.com') );
    ok( current.isValid('1test@yahoo.com') );

    ok( ! current.isValid('.testbla@yahoo.com') );
    ok( ! current.isValid('') );
    ok( ! current.isValid('  ') );
    ok( ! current.isValid('wow') );
});

test('match', function() {
    expect(8);

    // Insert a test field
    $('#qunit').after('<input id="password" name="password" value="test value" style="display:none">');

    validate('password');
    validate($('#password'));

    function validate(field) {
        current = validators.match(field);

        ok( current.isValid('test value') );
        ok( ! current.isValid('anything else') );
        ok( ! current.isValid('must fail') );
        equal( current.errMessage, 'Field does not match with field password' );
    }
});




module('Numeric Validators');

test('numeric', function() {
    current = validators.numeric();

    ok( current.isValid(-13) );
    ok( current.isValid(12) );
    ok( current.isValid('46') );
    ok( current.isValid('-253') );

    ok( ! current.isValid('not numeric') );
    ok( ! current.isValid('11c') );
});

test('min', function() {
    current = validators.min(12);

    ok( current.isValid(12) );
    ok( current.isValid(13) );
    ok( current.isValid(1000) );
    ok( current.isValid('12') );
    ok( current.isValid('13') );
    ok( current.isValid('1000') );

    ok( ! current.isValid(11) );
    ok( ! current.isValid(0) );
    ok( ! current.isValid(-12) );
    ok( ! current.isValid('11') );
    ok( ! current.isValid('0') );
    ok( ! current.isValid('-12') );
});

test('max', function() {
    current = validators.max(18);

    ok( current.isValid(18) );
    ok( current.isValid(11) );
    ok( current.isValid(0) );
    ok( current.isValid(-18) );
    ok( current.isValid('18') );
    ok( current.isValid('11') );
    ok( current.isValid('0') );
    ok( current.isValid('-18') );

    ok( ! current.isValid(19) );
    ok( ! current.isValid(1000) );
    ok( ! current.isValid('19') );
    ok( ! current.isValid('1000') );
});

test('between', function() {
    current = validators.between(1, 10);
    ok( current.isValid(1) );
    ok( current.isValid(10) );
    ok( current.isValid(9) );
    ok( current.isValid('1') );
    ok( current.isValid('10') );
    ok( current.isValid('9') );

    ok( ! current.isValid(11) );
    ok( ! current.isValid(-1) );
    ok( ! current.isValid(0) );
    ok( ! current.isValid('11') );
    ok( ! current.isValid('0') );
});




module('Text Validators');

test('minLength', function() {
    current = validators.minLength(4);

    ok( current.isValid('Joel') );
    ok( current.isValid('Andrew') );
    ok( current.isValid('Jack') );
    ok( current.isValid('a  b') );

    ok( ! current.isValid('Foo') );
    ok( ! current.isValid('Bar') );
    ok( ! current.isValid('      ') );
    ok( ! current.isValid('   a   ') );
});

test('maxLength', function() {
    current = validators.maxLength(4);

    ok( current.isValid('       ') );
    ok( current.isValid('No') );

    ok( ! current.isValid('Iabadabadu') );
    ok( ! current.isValid('a    b') );
});

test('betweenLength', function() {
    current = validators.betweenLength(1, 10);

    ok( current.isValid('Between') );
    ok( current.isValid('Hey!') );
    ok( current.isValid(123) );

    ok( ! current.isValid('Should not pass') );
    ok( ! current.isValid('   ') );
    ok( ! current.isValid('Has more than 10 characters') );
});
