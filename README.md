# purest #

purest is a javascript template rendering library.

It is unobstrusive and inspired by [pure](http://http://beebole.com/pure/) and [transparency](http://leonidas.github.com/transparency/).

It is pure javascript, works without string parsing and aims at type-safety in template directives when used in a [typescript](http://www.typescriptlang.org/) context.

## Very simple example ##

>     <script type="text/javascript" src="purest.js"></script>
>     <script type="text/javascript">
>     var words = [ "Hello", "this", "is", "a", "test."];
>     		
>     var directive = function(elements) {
>     	return {
>     		'li' : {
>     			items : elements,
>     			each : function(element) {
>     				return {
>     					"a" : element,
>     					"a@href+" : element
>     				}
>     			}
>     		}
>     	}
>     };
>     </script>
>     
>     <ul class="template">
>     	<li><a href="http://www.google.de?q="></a></li> 
>     </ul>
>     
>     <a href="#"
>     	onclick="PUREST.render('.template', directive(words));">Render!</a>


This code snippet renders to:

[Hello](http://www.google.de?q=Hello)<br/>
[this](http://www.google.de?q=this)<br/>
[is](http://www.google.de?q=is)<br/>
[a](http://www.google.de?q=a)<br/>
[test.](http://www.google.de?q=test.)<br/>

## Basics ##

### Separation of data, template and binding ###

#### Data ####
In *purest* your data is a pure javascript data structure, i.e. a string, a number or an object.

#### Template ####
In *purest* your template is pure html, strictly speaking a part of your DOM (domain object model).

In *purest* your binding between data and template is a so called *directive* which is also  a pure javascript object, which is composed of strings, functions and other objects to tell purest what is the relation between the data and the template.

#### Directives ####
In contrast to the data and the template which can have arbitrary structures, the directives have a clear structure:

>     var directive = {
>                         "selector1" : rule1,
>                         "selector2" : rule2,
>                         ...
>                         "selectorN" : ruleN
>                     };

A directive can also be written as function, which is preferrable to introduce data for your directive to work on:

>     var directive = function (data) {
>            return {
>                    "selector1" : rule1,
>                    "selector2" : rule2,
>                    ...
>                    "selectorN" : ruleN
>                   }
>     };

##### Selectors #####
The selector is a [css selector](http://www.w3.org/TR/selectors/) which internally uses the Document.querySelector function. 

Additionally there is some syntactic sugar which makes it possible to select attributes.

Examples:

Select an "a"-elements "href" attribute:
>     "a@href"

Additionally you can select a placeholder *{blubb}* in the template inside the value of the href attribute like so (`<a href="www.{blubb}.de"></a>`):
>     "a@href{blubb}"


##### Rules #####
Once you have selected the part of the DOM you want to work on, you can apply a *rule* to this part of the DOM. 

###### Primitive-Type-Rule 
This rule is the easist one. It is simply a string or a number and means that the selected part of the DOM gets the value of this string or number. If the selected part of the DOM is an HTMLElement, the value gets inserted as innerHTML. If the selected part is an attribute, that attribute gets the value.

###### Loop-Rule 
This rule enables loops over data and template duplication. This rule is an object with two mandatory properties "items" and "each".

>     var directive = function (data) {
>         return {
>             "li" : {
>                 items : data.elements,
>                 each : function (element) {
>                     return {
>                         "a" : element.text
>                     }
>                 }
>         }
>     };

The "items"-property holds the array to iterate over. The "each" property holds the function, which gets called for everty element in the "items"-array.
This function must also return a directive. The selector of this directive uses the previously found DOM element, where the loop-rule was applied, as the baseElement of the querySelector-function.

###### Include-Rule

The *include*-rule can be used to include another part of the DOM in the current template.

The include rule has a "include"-property, which is a selector for the include snippet, that uses the document as the baseElement. And a "directive"-property which can be used to apply data, to the included template.

Example directive:
>     var directive = {
>     		"div" : {
>     			include : ".include",
>     			directive : {
>     				"div" : "test"
>     			}
>     		}
>     };

Example template and include:
>     	<div class="template">
>     		<div></div>
>     	</div>
>     
>     	<div class="include">
>     		<div>Include-Template</div>
>     	</div>

Render function:
>     PUREST.render('.template', directive);


/

/

/