import { add, differenceInSeconds, startOfDay, startOfMinute } from 'date-fns';

export enum TimeGranularity {
  millisecond,
  second,
  minute,
  hour,
  day,
  month,
  year
}

interface Duration {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

function addToDate(input: Date, amounts: Duration): Date {
  return add(input, amounts);
}

function getNow(): Date {
  return new Date();
}

function startOf(input: Date, granularity: TimeGranularity): Date {
  switch (granularity) {
    case TimeGranularity.minute:
      return startOfMinute(input);
    case TimeGranularity.day:
      return startOfDay(input);
    default:
      throw new Error(`startOf ${granularity} is not supported yet.`);
  }
}

function diffIn(date1: Date, date2: Date, granularity: TimeGranularity): number {
  switch (granularity) {
    case TimeGranularity.second:
      return differenceInSeconds(date1, date2);
    default:
      throw new Error(`diffIn ${granularity} is not supported yet.`);
  }
}

export const appDate = {
  add: addToDate,
  getNow,
  startOf,
  diffIn
};
