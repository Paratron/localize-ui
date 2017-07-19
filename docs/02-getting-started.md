Getting started
===============

You can install localize-ui through npm by running this in your console:

	npm install localize-ui
	
The library has no dependencies and is very small. You can use it serverside
in a nodeJS context, or as well in your browser.


##Defining a localization (or many)
To make use of localization(s), you need to tell localize-ui about them, first.

To register localization information with localize-ui, simply import and call
`defineLocalization()` from anywhere in your code:

````javascript
	import {defineLocalization} from 'localize-ui';

	defineLocalization({
		phrases: {},
		formatters: {},
		formatterSettings: {},
		locale: 'default'
	});
````

You simply pass an object to `defineLocalization()` where everything
is optional, instead of the `phrases` key. You may define specific
formatter functions for you localization, or you may just define some new
default settings.

If you want to utilize more than one language and perform live switches
during runtime, you need to specify the `locale` property as well.
Use a unique identifier for your localizations like `"en"` or `"es"` to
switch between them afterwards.

Your `phrases` property may or may not be a nested object like this:

````javascript
	const phrases = {
		welcomeScreen: {
		    headline: 'Welcome folks!'
		},
		infoPopUp: {
		    footerArea: {
		        closeButton: 'Close'
		    }
		}
	};
````

You can use this to strucure your language definition just as you wish.
Just note that localize-ui will take your object and flatten it down to
a simple key/value store. Keys will be concatenated with dots:

````javascript
	// Resulting internal object:
	const phrases = {
		'welcomeScreen.headline': 'Welcome folks!',
		'infoPopUp.footerArea.closeButton': 'Close'
	};
````

This is done for performance reasons, as well as due to the fact that
you will access your defined phrases by string identifiers anyways.

