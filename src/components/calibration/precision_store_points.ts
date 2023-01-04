/*
* Sets store_points to true, so all the occuring prediction
* points are stored
*/
export function store_points_variable(){
  // @ts-ignore
  webgazer.params.storingPoints = true;
}

/*
* Sets store_points to false, so prediction points aren't
* stored any more
*/
export function stop_storing_points_variable(){
  // @ts-ignore
  webgazer.params.storingPoints = false;
}