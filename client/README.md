# Client

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## JEST

https://jnpiyush.medium.com/how-to-set-up-jest-in-angular-app-961ddcbab8af

npm install jest jest-preset-angular @types/jest @angular-builders/jest --save-dev

npm i -D @testing-library/angular @testing-library/user-event @testing-library/jest-dom
npm i -D msw whatwg-fetch

## ESLINT

https://blog.bitsrc.io/how-ive-set-up-eslint-and-prettier-in-angular-16-and-why-i-did-that-4bfc304284a6

https://www.amadousall.com/how-to-set-up-angular-unit-testing-with-jest/

npm i -D @testing-library/angular @testing-library/user-event @testing-library/jest-dom
npm i -D jest @types/jest jest-preset-angular
npm i -D msw whatwg-fetch

## Add ngrx:

ng add @ngrx/store
ng add @ngrx/schematics@latest
ng add @ngrx/store-devtools - inspect store
In chrome web browser add extension: Redux DevTools
ng generate store auth/Auth --module auth.module.ts
ng add @ngrx/effects
ng add @ngrx/router-store
ng add @ngrx/entity
