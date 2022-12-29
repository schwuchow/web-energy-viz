export interface Visualization {
  deviceIds: string[],
  timePeriod: number,
  ranking: boolean,
}

export interface Device {
  position: DOMRect,
  name: string,
}