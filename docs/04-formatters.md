Formatters
==========

Formatters are like the soul of localize-ui. They provide all the features
besides simple placeholder replacement and are easily extendable by you.
 
Formatters are defined together with your localization(s) so you might
 specify completely unique formatters by language or just tweak the settings
 of existing formatters.
 
Basically, a formatter works like this: You define default settings for
the formatter (if necessary) and a formatter function that consumes a value to
transform. The function returns a string that is inserted at
the placeholder position into the template.

