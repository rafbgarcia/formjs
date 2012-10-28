var validators = Eim.validators,
    t;

module('Validators');

test('required', function() {
    t = validators.required();

    ok( t.isValid('a') );
    ok( ! t.isValid('') );
    ok( ! t.isValid('   ') );

    equal( validators.required('Required').errMessage, 'Required' );
    equal( t.errMessage, 'Field is required' );
});

test('email', function() {
    t = validators.email();

    ok( t.isValid('test@gmail.com') );
    ok( t.isValid('test.foo_@yahoo.com') );
    ok( t.isValid('1test@yahoo.com') );

    ok( ! t.isValid('.testbla@yahoo.com') );
    ok( ! t.isValid('') );
    ok( ! t.isValid('  ') );
    ok( ! t.isValid('wow') );
});

test('match', function() {
    expect(8);

    // Insert a test field
    $('#qunit').after('<input id="password" name="password" value="test value" style="display:none">');

    var _validate = function(field) {
        t = validators.match(field);

        ok( t.isValid('test value') );
        ok( ! t.isValid('anything else') );
        ok( ! t.isValid('must fail') );
        equal( t.errMessage, 'Field does not match with field password' );
    }

    _validate('password');
    _validate($('#password'));
});




module('Numeric Validators');

test('numeric', function() {
    t = validators.numeric();

    ok( t.isValid(-13) );
    ok( t.isValid(12) );
    ok( t.isValid('46') );
    ok( t.isValid('-253') );

    ok( ! t.isValid('not numeric') );
    ok( ! t.isValid('11c') );
});

test('min', function() {
    t = validators.min(12);

    ok( t.isValid(12) );
    ok( t.isValid(13) );
    ok( t.isValid(1000) );
    ok( t.isValid('12') );
    ok( t.isValid('13') );
    ok( t.isValid('1000') );

    ok( ! t.isValid(11) );
    ok( ! t.isValid(0) );
    ok( ! t.isValid(-12) );
    ok( ! t.isValid('11') );
    ok( ! t.isValid('0') );
    ok( ! t.isValid('-12') );
});

test('max', function() {
    t = validators.max(18);

    ok( t.isValid(18) );
    ok( t.isValid(11) );
    ok( t.isValid(0) );
    ok( t.isValid(-18) );
    ok( t.isValid('18') );
    ok( t.isValid('11') );
    ok( t.isValid('0') );
    ok( t.isValid('-18') );

    ok( ! t.isValid(19) );
    ok( ! t.isValid(1000) );
    ok( ! t.isValid('19') );
    ok( ! t.isValid('1000') );
});

test('between', function() {
    t = validators.between(1, 10);
    ok( t.isValid(1) );
    ok( t.isValid(10) );
    ok( t.isValid(9) );
    ok( t.isValid('1') );
    ok( t.isValid('10') );
    ok( t.isValid('9') );

    ok( ! t.isValid(11) );
    ok( ! t.isValid(0) );
    ok( ! t.isValid('11') );
    ok( ! t.isValid('0') );
});




module('Text Validators');

test('minLength', function() {
    t = validators.minLength(4);

    ok( t.isValid('Joel') );
    ok( t.isValid('Andrew') );
    ok( t.isValid('Jack') );
    ok( t.isValid('a  b') );

    ok( ! t.isValid('Yes') );
    ok( ! t.isValid('No') );
    ok( ! t.isValid('      ') );
    ok( ! t.isValid('   a   ') );
});

test('maxLength', function() {
    t = validators.maxLength(4);

    ok( t.isValid('       ') );
    ok( t.isValid('No') );

    ok( ! t.isValid('Iabadabadu') );
    ok( ! t.isValid('a    b') );
});

test('betweenLength', function() {
    t = validators.betweenLength(1, 10);

    ok( t.isValid('Between') );
    ok( t.isValid('Hey!') );
    ok( t.isValid(123) );

    ok( ! t.isValid('Should not pass') );
    ok( ! t.isValid('Has more than 10 characters') );
});
