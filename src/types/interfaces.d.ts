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

export interface Room {
  position: DOMRect,
}

export interface TimeFrame {
  startDate: number,
  endDate: number,
}

export interface CustomDate {
  day: number,
  month: number,
  year: number,
}