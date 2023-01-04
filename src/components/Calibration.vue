<template>
   <!-- <nav id="webgazerNavbar" class="navbar navbar-default navbar-fixed-top">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
          <span class="icon-bar">Menu</span>
        </button>
      </div>
      <div class="collapse navbar-collapse" id="myNavbar">
        <ul class="nav navbar-nav">
          <li id="Accuracy"><a>Not yet Calibrated</a></li>
          <li><a onclick="Restart" href="#">Recalibrate</a></li>
          <li><a onclick="webgazer.applyKalmanFilter(!webgazer.params.applyKalmanFilter)" href="#">Toggle Kalman Filter</a></li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
          <li>
            <button class="helpBtn" data-toggle="modal" data-target="#helpModal">
              <a data-toggle="modal">
                <span class="glyphicon glyphicon-cog">
                </span> Help</a>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav> -->
  <canvas id="plotting_canvas" width="500" height="500" style="cursor:crosshair;"></canvas>
  <div>
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
    </div>

    <div id="helpModal" class="modal fade" role="dialog">
      <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-body">
          </div>
          <div class="modal-footer">
            <!-- <button id="closeBtn" type="button" class="btn btn-default" data-dismiss="modal">Close & load saved model </button> -->
            <button type="button" id='start_calibration' class="btn btn-primary" @click="startCalibration">Calibrate</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue';
import { useDevicesStore } from '../store';
import { storeToRefs } from 'pinia';

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

    /**
     * Restart the calibration process by clearing the local storage and reseting the calibration point
     */
    function Restart(){
        document.getElementById("Accuracy")!.innerHTML = "<a>Not yet Calibrated</a>";
        // @ts-ignore
        webgazer.clearData();
      }

    /*
    * Sets store_points to true, so all the occuring prediction
    * points are stored
    */
    function store_points_variable(){
      // @ts-ignore
      webgazer.params.storingPoints = true;
    }

    /*
    * Sets store_points to false, so prediction points aren't
    * stored any more
    */
    function stop_storing_points_variable(){
      // @ts-ignore
      webgazer.params.storingPoints = false;
    }

    /*
    * This function calculates a measurement for how precise 
    * the eye tracker currently is which is displayed to the user
    */
    function calculatePrecision(past50Array: any) {
      var windowHeight = window.innerHeight;;
      var windowWidth = window.innerWidth;;

      // Retrieve the last 50 gaze prediction points
      var x50 = past50Array[0];
      var y50 = past50Array[1];

      // Calculate the position of the point the user is staring at
      var staringPointX = windowWidth / 2;
      var staringPointY = windowHeight / 2;

      var precisionPercentages = new Array(50);
      calculatePrecisionPercentages(precisionPercentages, windowHeight, x50, y50, staringPointX, staringPointY);
      var precision = calculateAverage(precisionPercentages);

      // Return the precision measurement as a rounded percentage
      return Math.round(precision);
    };

    /*
    * Calculate percentage accuracy for each prediction based on distance of
    * the prediction point from the centre point (uses the window height as
    * lower threshold 0%)
    */
    function calculatePrecisionPercentages(precisionPercentages: any, windowHeight: any, x50: any, y50: any, staringPointX: any, staringPointY: any) {
      for (var x = 0; x < 50; x++) {
        // Calculate distance between each prediction and staring point
        var xDiff = staringPointX - x50[x];
        var yDiff = staringPointY - y50[x];
        var distance = Math.sqrt((xDiff * xDiff) + (yDiff * yDiff));

        // Calculate precision percentage
        var halfWindowHeight = windowHeight / 2;
        var precision = 0;
        if (distance <= halfWindowHeight && distance > -1) {
          precision = 100 - (distance / halfWindowHeight * 100);
        } else if (distance > halfWindowHeight) {
          precision = 0;
        } else if (distance > -1) {
          precision = 100;
        }

        // Store the precision
        precisionPercentages[x] = precision;
      }
    }

    /*
    * Calculates the average of all precision percentages calculated
    */
    function calculateAverage(precisionPercentages: any) {
      var precision = 0;
      for (var x = 0; x < 50; x++) {
        precision += precisionPercentages[x];
      }
      precision = precision / 50;
      return precision;
    }

    return { startCalibration, showMiddlePoint, Restart, calibration };
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