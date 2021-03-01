import { GUID } from "./Constants.ts";
import { MinTacticalActivityMapping } from "./GroomTacticalActivities.ts";
import { streamFile, writeFile } from "./ReadFile.ts";

export enum ActivityType {
  ACTIVE = "ACTIVE",
  PASSIVE = "PASSIVE",
  NA = "NA",
}

export enum ActivityStrategy {
  GENERIC = "GENERIC",
}

export enum ActivityTimedType {
  NA = "NA",
  NONE = "NONE",
  TIMER = "TIMER",
  STOP_WATCH = "STOP_WATCH",
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
  a?: number; // mapped activity id see minified activities.json
  r?: RecoveryTypes;
}

const activities: MinifiedActivity[] = [];

const tacticalActivityMappings: MinTacticalActivityMapping[] = JSON.parse(
  Deno.readTextFileSync("./minifiedJson/activitiesMappings.json")
);

const minTactMap: { [key: string]: number } = tacticalActivityMappings.reduce(
  (accum, a) => ({
    ...accum,
    [a.i]: a.mapping,
  }),
  {}
);

enum RecoveryTypes {
  REGULAR = 1,
  PAUSED = 2,
}

const getExtraData = (
  activity: Activity
): {
  a?: number;
  r?: RecoveryTypes;
} => {
  const isRecovery = activity.content.name === "RECOVERY";
  if (isRecovery) {
    return {
      r: activity.content.paused ? RecoveryTypes.PAUSED : RecoveryTypes.REGULAR,
    };
  }

  const activityId = activity.content.activityID;

  if (activityId) {
    const mapping = minTactMap[activityId];
    return {
      a: mapping === undefined ? -1 : mapping,
    };
  }

  return {};
};

var row = 0;
await streamFile("./jsonDump/history.json", (line: any) => {
  const activity: Activity = JSON.parse(line);
  if (
    activity.guid == GUID &&
    activity?.content?.type === ActivityType.ACTIVE
  ) {
    const extraData = getExtraData(activity);
    activities.push({
      t: activity.antecedenceTime,
      ...extraData,
    });
  }
});

writeFile('./minifiedJson/history.json', activities)
