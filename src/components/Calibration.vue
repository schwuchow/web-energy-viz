<template>
<canvas id="plotting_canvas" width="500" height="500" style="cursor:crosshair;"></canvas>
<div class="calibration-dots">
  <input type="button" class="Calibration" id="Pt1" />
  <input type="button" class="Calibration" id="Pt2"/>
  <input type="button" class="Calibration" id="Pt3" />
  <input type="button" class="Calibration" id="Pt4" />
  <input type="button" class="Calibration" id="Pt5" v-show="showMiddlePoint"/>
  <input type="button" class="Calibration" id="Pt6" />
  <input type="button" class="Calibration" id="Pt7" />
  <input type="button" class="Calibration" id="Pt8" />
  <input type="button" class="Calibration" id="Pt9" />
  <div id="Accuracy"><a>Not yet Calibrated</a></div>
  <button type="button" id='start_calibration' class="btn btn-primary" @click="startCalibration">Calibrate</button>
</div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue';
import { useDevicesStore } from '../store';
import { storeToRefs } from 'pinia';
import { store_points_variable, stop_storing_points_variable } from './calibration/precision_store_points';
import { calculatePrecision } from './calibration/precision_calculation';

export default {
  setup() {
    const store = useDevicesStore();
		const { calibration } = storeToRefs(store);
    var PointCalibrate = 0;
    var CalibrationPoints: any = {Pt1: 0, Pt2: 0, Pt3: 0, Pt4: 0, Pt5: 0, Pt6: 0, Pt7: 0, Pt8: 0, Pt9: 0};
    let showMiddlePoint = ref(false);

    // saveDataAcrossSessions
    // storingPoints

    onMounted(() => {
      console.log("MOUNTED");

      // Set to true if you want to save the data even if you reload the page.
      // window?.saveDataAcrossSessions = true;

      addWebGazeListener();
    })

    const addWebGazeListener = async (): Promise<any> => {
      //start the webgazer tracker
      //  @ts-ignore
      await webgazer.setRegression('weightedRidge') /* currently must set regression and tracker */
          //.setTracker('clmtrackr')
          .setGazeListener(function(data: any, clock: any) {
            //   console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
            //   console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */
          })
          .saveDataAcrossSessions(true)
          .begin();

          // @ts-ignore
          webgazer.showVideoPreview(true) /* shows all video previews */
              .showPredictionPoints(true) /* shows a square every 100 milliseconds where current prediction is */
              .applyKalmanFilter(true); /* Kalman Filter defaults to on. Can be toggled by user. */

      //Set up the webgazer video feedback.
      var setup = function() {

          //Set up the main canvas. The main canvas is used to calibrate the webgazer.
          var canvas: any = document.getElementById("plotting_canvas");
          canvas!.width = window.innerWidth;
          canvas!.height = window.innerHeight;
          canvas!.style.position = 'fixed';
      };
      setup();
    };

    const startCalibration = () => {
      document.querySelectorAll(".Calibration").forEach(el => {
        el.addEventListener("click", saveClick);
      });
    };

    const saveClick = (ev: any) => {
      const id: any = ev.target?.id;
      const el: any = document.querySelector(`#${id}`);
      CalibrationPoints[id] += 1;

      if (CalibrationPoints[id] == 5){ //only turn to yellow after 5 clicks
        el.style.backgroundColor = 'yellow';
        el.setAttribute("disabled", "");

        PointCalibrate +=  1;
      } else if (CalibrationPoints[id] < 5){
        //Gradually increase the opacity of calibration points when click to give some indication to user.
        var opacity = 0.2 * CalibrationPoints[id] + 0.2;
        el.style.opacity = opacity;
      }

      //Show the middle calibration point after all other points have been clicked.
      if (PointCalibrate === 8){
        showMiddlePoint.value = true;
      }

      let sleep = (ms: number) => {  
        return new Promise(resolve => setTimeout(resolve, ms));  
      };

      if (PointCalibrate >= 9) {
        store_points_variable(); // start storing the prediction points

        sleep(5000).then(() => {
          stop_storing_points_variable(); // stop storing the prediction points
          // @ts-ignore
          var past50 = webgazer.getStoredPoints(); // retrieve the stored points
          var precision_measurement = calculatePrecision(past50);
          var accuracyLabel = "<a>Accuracy | "+precision_measurement+"%</a>";
          document.getElementById("Accuracy")!.innerHTML = accuracyLabel;
          console.log(past50);
          console.log("Accuracy: ", precision_measurement);

          calibration.value = true;
        });
      }
    };

    return { startCalibration, showMiddlePoint, calibration };
  }
}
</script>

<style lang="scss" scoped>

#plotting_canvas {
  position: absolute;
  left: 0;
  top: 0;
}
.calibration-dots {
  position: relative;
  width: 100vw;
  height: 100vh;
}
.Calibration {
  border: 2px solid black;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  background-color: red;
  opacity: 0.1;
  cursor: pointer;
}

#start_calibration {
  position: absolute;
  top: 320px;
  left: 130px;
}

#Accuracy {
  position: absolute;
  bottom: 45%;
  right: 45%;
}

#Pt1 {
  position: absolute;
  top: 0;
  left: 50%;
}

#Pt2 {
  position: absolute;
  top: 0;
  right: 40px;
}

#Pt3 {
  position: absolute;
  top: 50%;
  right: 40px;
}

#Pt4 {
  position: absolute;
  bottom: 40px;
  right: 40px;
}

#Pt5 {
  position: absolute;
  bottom: 50%;
  right: 50%;
}

#Pt6 {
  position: absolute;
  bottom: 40px;
  right: 50%;
}

#Pt7 {
  position: absolute;
  bottom: 40px;
  left: 0;
}

#Pt8 {
  position: absolute;
  top: 240px;
  left: 0;
}

#Pt9 {
  position: absolute;
  top: 0;
  left: 320px;
}
</style>