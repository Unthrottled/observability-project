import { stream_file } from "./ReadFile.ts";
import {GUID} from "./Constants.ts";

export interface ColorType {
  hex: string;
  opacity: number;
}


export interface TacticalActivity {
  id: string;
  name: string;
  rank: number;
  antecedenceTime?: number;
  iconCustomization: {
    background: ColorType;
    line: ColorType;
  };
  categories: string[];
  hidden?: boolean;
  guid: string;
}


const activities: TacticalActivity[] = [];

await stream_file("./jsonDump/tacticalActivity.json", line => {
  const activity: TacticalActivity = JSON.parse(line);
  if(activity.guid == GUID) {
    activities.push(activity);
  }
});

console.log(activities.length);

