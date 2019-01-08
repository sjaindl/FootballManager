# FootballManager
Football manager let you create and play with your favorite players of Austrian amateur football clubs against your friends.

## Getting Started

This project is built following the [Angular-CLI Wiki guide](https://github.com/angular/angular-cli/wiki/stories-universal-rendering)

Packages from the [Angular Universal @nguniversal](https://github.com/angular/universal) repo are utilized, such as [ng-module-map-ngfactory-loader](https://github.com/angular/universal/modules/module-map-ngfactory-loader) to enable Lazy Loading.

---

### Installation
* `npm install` or `yarn`

### Build Time Prerendering Vs. Server Side Rendering(ssr)
2 different forms of Server Side Rendering are supported.

**Prerender** 
* Happens at build time
* Renders the application and replaces the dist index.html with a version rendered at the route `/`.

**Server-Side Rendering(ssr)**
* Happens at runtime
* Uses `ngExpressEngine` to render the application on the fly at the requested url.

### Development (Client-side only rendering)
* run `npm run start` which will start `ng serve`

### Production (also for testing SSR/Pre-rendering locally)
**`npm run build:ssr && npm run serve:ssr`** - Compiles the application and spins up a Node Express to serve the Universal application on `http://localhost:4000`.

**`npm run build:prerender && npm run serve:prerender`** - Compiles the application and prerenders the applications files, spinning up a demo http-server so that it can be viewed on `http://localhost:8080`
**Note**: To deploy a static site to a static hosting platform the `dist/browser` folder should be deployed, rather than the usual `dist`

## Universal "Gotchas"
Fors some Angular Universal Gotchas see [/angular/universal/blob/master/docs/gotchas.md](https://github.com/angular/universal/blob/master/docs/gotchas.md)

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Generating components with Angular CLI

ng generate component componentName --module=app.module

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# License
TODO
