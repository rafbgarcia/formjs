
# In development

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



