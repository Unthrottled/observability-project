import { MinifiedActivity } from "./GroomActivities.ts";
import { streamFile, streamFileWithResult } from "./ReadFile.ts";

const activities: MinifiedActivity[] = await streamFileWithResult(
  "./minifiedJson/history.json",
  (line: string) => {
    const activity: MinifiedActivity = JSON.parse(line);
    return activity;
  }
);

console.log(
  "Is Sorted",
  activities.reduce((accum, next, idx, arr) => {
    if (idx === 0) {
      return true;
    } else {
      return accum && next.t >= arr[idx - 1].t;
    }
  }, true)
);
