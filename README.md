About localize-ui
=================

This library is inspired by [formatJS](https://formatjs.io/) - a very common internationalization library.
 
So why another library when we already have a widely adopted project out there? Basically because
I found formatJS to be not flexible enough for my needs.

## Whats special about localize-ui?

It is very flexible - basically everything is done by defining
formatter functions that can modify values before they get inserted into your texts.

localize-ui supports basic placeholder injection:

````javascript

	const phrases = {
    	'helloWorld': 'Hey, my name is {{username}}!'
	};

	defineLocalization({phrases});
	
	console.log(
	    __('helloWorld', {
	    	username: 'Peter'
		})
	);
	
	// >> Hey, my name is Peter!

````

So this is straightforward - but it gets interesting if you make use
of the formatter feature, which can be used to transform values before
they end up in your text:

````javascript

	const phrases = {
    	'aboutMe': 'I like {{fruits, naturalList}}!'
	};

	defineLocalization({phrases});
	
	console.log(
	    __('aboutMe', {
	    	fruits: ['apples', 'peas', 'bananas']
		})
	);
	
	// >> I like apples, peas and bananas!

````

Is this magic? Not at all - this template makes use of the built-in
formatter function `naturalList`:

````javascript
	function naturalList(value, settings){
    	if (value.length === 1) {
			return value[0];
		}
		const lastValue = value.pop();

		return value.join(settings.separator) + settings.finalSeparator + lastValue;
	}
````

With formatter functions, everything is possible - from money and date
 formatting down to the precisest character placement to plural forms,
 listing of words and much more.