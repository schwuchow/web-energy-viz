# How To

This project is built in Typescript and Vue 3 (Composition API) with vite.

Locally install all the packages via `npm i`

To build the project, type in `npm run build`.
To run the project, type in `npm run dev`.

At the moment, it only contains a basic grid layout and a simple eye tracking logic which (very shortly) displays a popup on focus. Right now the positions are not correct for the focus (a problem with the svg not the logic). Try to look at the armchair.

## Calibration

`WebGazer.js` uses `localForage` to store training data in the browser which was added to this project via `npm`. The calibration is based on the `Webgazer.js` calibration file (see `https://github.com/brownhci/WebGazer/blob/master/www/calibration.html`). If you try this example on their website (see `https://webgazer.cs.brown.edu/calibration.html?`), you will see that they used localForage to store the data. Go into the JS console, click on `Application` -> `IndexedB`, `localforage` and then `keyvaluepairs` and you will the `key` `webGazerGlobalData` with 50 values.

To also have this `webGazerGlobalData` item, we will have two modes: the training mode and the application mode. To toggle the training mode, you can go into `store.ts` and set the ref `calibration` to true. When you refresh the page, you will have the same scenario where you have to click the buttons and look on the yellow points for 5 seconds (click on the button first). You will also see the accuracy in the end in the JS console. After that, you can just switch the ref `calibration` to false, reload and you will have the improved eye tracking (you should see it in `webGazerGlobalData`).

## Eye tracking - Webgazer

This project uses `WebGazer.js`. Please note that it is not included as a node module but added to `index.html` as a script tag.

The library does not do the tracking as well as the Tobii Eye tracker so we definitely need to improve it somehow or switch to the hardware later on in the process.

## Speech Input

The Speech input is a Vue Component written in JavaScript. Credits go to TylerPottsDev who's code was used as base for the speech recognition web api.


## Mouse Input

The mouse input consists currently of two select inputs to select the device and time frame and a checkbox.

To toggle between the speech and mouse input, set the ref `multimodal` in `App.vue` to `true` for speech and `false` for mouse.

## Data Visualization

This project uses the `d3.js` library to visualize the data. Three visualizations are currently available:

1. A hierarchical bar chart which displays the data in a descending order (the highest is displayed first).

2. A radial stacked bar chart which currently shows data for 31 days in a circular pattern.

3. A scatter plot which shows the data as a line.