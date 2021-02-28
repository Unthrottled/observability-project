import { GUID } from "./Constants.ts";
import { stream_file } from "./ReadFile.ts";

export enum ActivityType {
  ACTIVE = 'ACTIVE',
  PASSIVE = 'PASSIVE',
  NA = 'NA',
}

export enum ActivityStrategy {
  GENERIC = 'GENERIC',
}

export enum ActivityTimedType {
  NA = 'NA',
  NONE = 'NONE',
  TIMER = 'TIMER',
  STOP_WATCH = 'STOP_WATCH',
}

export interface ActivityContent {
  uuid: string;
  name: string;
  timedType: ActivityTimedType;
  type: ActivityType;
  paused?: boolean;
  autoStart?: boolean;
  veryFirstActivity?: boolean;
  activityID?: string;
  duration?: number;
  workStartedWomboCombo?: number;
}

export interface Activity {
  antecedenceTime: number;
  guid: string;
  content: ActivityContent;
}

export interface MinifiedActivity {
  t: number; // Antecedence Time
  i: number; // id
}

const activities: MinifiedActivity[] = [];

const tacticalActivityMapping = {};

var row = 0;
await stream_file("./jsonDump/history.json", (line: any) => {
  const activity: Activity = JSON.parse(line);
  if (activity.guid == GUID && activity?.content?.type === ActivityType.ACTIVE) {
    activities.push({
      i: row++,
      t: activity.antecedenceTime,
    });
  }
});

console.log(activities.length);
