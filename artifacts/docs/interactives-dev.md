# Interactives (EL-I) Development

## Technology Stack

The EcoLearnia Interactive (EL-I) uses the following technologies:

- Language: Nodejs, JavaScript ES6 (Originally developed with ES5 but moving 
towards ES6 using bable as the transpiler)
- Transpiler: [Babel](https://babeljs.io)
- Frameworks 
    - View: [React](https://facebook.github.io/react/) - For EL-I components
    - Model, View and Route: [AmpersandJS](http://ampersandjs.com/) - For EL-I 
    components and service proxies (REST)
- Libraries
    - JSON Validator: [themis](https://github.com/playlyfe/themis) 
- Unit Test
    - Mocha
    - Chai
    - sinon

## Building the library

The EL-I project uses commonjs to manage module dependencies.
Basically it uses brwoserify to package the modules which are structured in the 
same way as in nodejs, i.e. using `require()` to include modules.

*It will eventually be migrated to follow the ES6 module syntax.*

To build the library run the npm interactive build script: 

`npm run build-inter`


## Unit Tests
Of course, Unit test!

## Developing an EL-I component
An EL-I component is either a React component or a Ampersand (Backbone) view.
In both cases, in order to be a first-class EL-I, the class should adhere to
certain conventions.

What's the convention that needs to adhere?
Simple: for React-based, either extend from EliReacComponent or add the elireactmixin.
For Backbone-based, extend from EliViewComponent.

*Why is there two mechanism of implementing EL-I components?*
The general rule is to use React-based component. 
Currently the only Backbone-based component is the TemplateContainerComponent
which I could not find a way to implement the dynamic component rendering
using React.


## References (Pointers to learning materials)

### Developing with React and Ampersand
- First of all, read the [React project site](https://facebook.github.io/react/).
- [Todo MVC with React and Backbone](https://github.com/tastejs/todomvc/tree/gh-pages/examples/react-backbone)
  is a good examle of mixing Backone (which Ampersand is based on) and React.
- When looking for third party open source components, try
    - [React components](http://react-components.com/) (React component search)
    - [React parts](https://react.parts/native-ios) (React component search)

### Understanding related concepts
- If you are not familiar with browseriy, read few of 
  [these](http://browserify.org/articles.html).


### EcmaScript 6
- Bablejs site provides a [page on ES6 ](https://babeljs.io/docs/learn-es6/)
  which should be suficient for most use cases.

http://localhost:9090/debug?port=5858
http://localhost:9099/contentitems/test-item.01
http://localhost:8080/cohevium/content/content-edit.html/#item/test-item.01
http://localhost:8080/cohevium/public/test-interactives.html