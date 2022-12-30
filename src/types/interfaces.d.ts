import { TimePeriod } from './types/enums';

export interface Visualization {
  deviceIds: string[],
  timePeriod: TimePeriod,
  ranking: boolean,
}

export interface Device {
  position: DOMRect,
  name: string,
}