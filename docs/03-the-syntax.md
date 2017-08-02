The placeholder syntax
======================

The localize-ui package uses a specific syntax to look for placeholders, 
any usage of formatters and formatter options inside your strings.

You may just use simple placeholders that get replaced 1:1 by any values
you pass to the library:

````
	Hey {{username}}, I am a very simple template!
````
	
To get this placeholder replaced, the developer needs to send an object
with the property `username` defined to the resolver function. So far,
this is like most localization or templating systems work.

##Using formatters on placeholders
Simply append a comma and the name of a pre-defined placeholder function
and you are good to go:

````
	I currently have {{credit, moneyFormat}} on my bank account.
````
	
What does this do? It makes localize-ui take the `credit` value and pass
it to the `moneyFormat()` function before the result is placed into the template
text. The function may turn a numeric value into something like `12.000,00 €` - depending
on the settings you have applied.

###Passing options directly to formatters
Sometimes its not enough to just call a formatter with its default settings
and be done. In some cases you need to modify the behaviour of the formatter
directly from your template:

````
	Today is {{time, date, 'l'}}.
````
	
Just add another comma after the formatter name and you may pass any valid JSON-formatted
settings to the formatter function.

By the way, the template above would result something like: `Today is friday.`.
The date formatter I assumed here is inspired by the [PHP date formatter syntax](http://de2.php.net/manual/en/function.date.php) which I always found very handy.