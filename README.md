# How To

This project is built in Typescript and Vue 3 (Composition API) with vite. It contains three modes: i) a calibration mode for eye tracking, ii) a multimodal applicationmode for eye tracking and speech recognition and iii) a conventional application mode for mouse input. The calibration and application mode can be toggled in `store.ts` through the ref `calibration`, the multimodal and conventional modes are toggled through the ref `multimodal`.

Locally install all the packages via `npm i`

To build the project, type in `npm run build`.
To run the project, type in `npm run dev`.

## Eye tracking through Webgazer.js - Calibration

`WebGazer.js` uses `localForage` to store training data in the browser which was added to this project via `npm`. The calibration is based on the `Webgazer.js` calibration file (see `https://github.com/brownhci/WebGazer/blob/master/www/calibration.html`) which uses `IndexedDB` to store 50 training points after doing the calibration.

In the calibration mode, nine red circles have to be clicked five times until they turn yellow. Then, the last circle needs to be looked at for five seconds until an accuracy score is displayed and the training data is saved under the key `webGazerGlobalData` under `localForage` in the `application` tab. After that, the ref `calibration` just needs to be switched to `false` and the page needs to be reloaded.


It can be seen when `calibration` in `store.ts` is set to `true`.
## Eye tracking through Webgazer.js - Interactions

This project uses `WebGazer.js`. Please note that it is not included as a node module but added to `index.html` as a script tag, so a build step is needed.
A small video feed window is shown in the bottom left corner to help find the best head position. In the application, eye tracking can be used to select devices in the 2D apartment by looking at them for half a second or looking on a room to select devices per room for three seconds. To deselect devices, a user has to look on a device tag for half a second. Eye focus is also used to start the speech recognition through glancing on the speech button.

## Speech Input through WebSpeech API

The speech recognition uses the WebSpeech API of the web browser. Credits go to TylerPottsDev who's code was used as base for the speech recognition web api. The intent matching starts when the words `show me` or `energy consumption` are spoken. It then will catch a list of device names but also all devices and devices per room (bathroom, kitchen). It also listens to certain timeframes which are `today`, `yesterday`, `last week` and `last month`. Lastly, the energy consumption per device for a given timeframe can be shown in a descending order by adding the word `order` or `ranked`.

Some example commands:
`Show me the energy consumption from last week` (selected devices per eye focus)
`Show me small dryer and big dryer today` (selected devices per speech)
`Show me the ranked energy consumption from my bathroom devices` (ranked consumption of devices per room)

It can be seen when `multimodal` in `store.ts` is set to `true` and `calibration` is set to `false`.

## Mouse Input

The mouse input consists of one multiselect input to select and deselect one or more devices, one select to select the timeframe and one checkbox to toggle the ranking of the energy consumption per device.

It can be seen when `multimodal` in `store.ts` is set to `false` and `calibration` is set to `false`.

## Data Visualization

This project uses the `d3.js` library to visualize the data. Four visualizations are available:

1. Listing: Each device's name and energy consumption are listed in an unordered way. (timeframe: `today`, `yesterday`)

2. Scatter plot: Each device's energy consumption is shown as a line for each day. (timeframe: `last week`)

2. Radial bar chart: The energy consumption of a device is shown in a circular pattern for 31 days. (timeframe: `last month`)

3. Hierarchical bar chart: The devices' energy consumption are shown in a descending order for a given timeframe. (timeframe: all, ranked: `true`)