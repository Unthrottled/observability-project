import { stream_file } from "./ReadFile.ts";
import { GUID } from "./Constants.ts";

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
  removed?: boolean;
  guid: string;
}

export interface MinTacticalActivity {
  i: string; // id
  n: string; // name
  c: string; // 1st background 2nd line color separated by 和 (missing #)
  ct: string; // activitiy's categories separated by 和 (minified see categories.json)
}
export interface MinTacticalActivityMapping extends MinTacticalActivity{
  mapping: number;
}

const activities: MinTacticalActivity[] = [];

await stream_file("./jsonDump/tacticalActivity.json", (line) => {
  const activity: TacticalActivity = JSON.parse(line);
  if (activity.guid == GUID && !(activity.hidden || activity.removed)) {
    activities.push({
      i: activity.id,
      n: activity.name,
      c: `${activity.iconCustomization.background.hex.substr(1)
      }和${activity.iconCustomization.background.hex.substr(1)}`,
      ct: activity.categories.join("和"),
    });
  }
});

const minifiedCategories: { [key: string]: number } = Object.keys(
  activities
    .flatMap((activity) => activity.ct.split("和"))
    .reduce(
      (accum, cat) => ({
        ...accum,
        [cat]: cat,
      }),
      {}
    )
)
  .map((cat, index) => [cat, index])
  .reduce(
    (accum, [cat, index]) => ({
      ...accum,
      [cat]: index,
    }),
    {}
  );

const minifiedActivities = activities.map((tacticalActivity, index) => ({
  ...tacticalActivity,
  i: index,
  ct: tacticalActivity.ct
    .split("和")
    .map((ct) => minifiedCategories[ct])
    .join("和"),
}));

Deno.writeTextFileSync('./minifiedJson/categories.json', JSON.stringify(minifiedCategories));
Deno.writeTextFileSync('./minifiedJson/activities.json', JSON.stringify(minifiedActivities));
Deno.writeTextFileSync('./minifiedJson/activitiesMappings.json', JSON.stringify(activities
  .map((act, idx) => ({
    ...act,
    mapping: idx 
  }))));