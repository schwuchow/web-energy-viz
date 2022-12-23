# How To

This project is built in Typescript and Vue 3 (Composition API) with vite.

Locally install all the packages via `npm i`

To build the project, type in `npm run build`.
To run the project, type in `npm run dev`.

At the moment, it only contains a basic grid layout and a simple eye tracking logic which (very shortly) displays a popup on focus. Right now the positions are not correct for the focus (a problem with the svg not the logic). Try to look at the armchair.

## Eye tracking - Webgazer

This project uses `WebGazer.js`. Please note that it is not included as a node module but added to `index.html` as a script tag.

The library does not do the tracking as well as the Tobii Eye tracker so we definitely need to improve it somehow or switch to the hardware later on in the process.

## Speech Input

The Speech input is a Vue Component written in JavaScript. Credits go to TylerPottsDev who's code was used as base for the speech recognition web api.


