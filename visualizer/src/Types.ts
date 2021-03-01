export type CategoryMappings = {
  [name: string]: number;
}

export interface MinTacticalActivity {
  i: string; // id
  n: string; // name
  c: string; // 1st background 2nd line color separated by 和 (missing #)
  ct: string; // activitiy's categories separated by 和 (minified see categories.json)
}

export type TacticalActivites = MinTacticalActivity[];

export enum RecoveryTypes {
  REGULAR = 1,
  PAUSED = 2,
}

export interface MinifiedActivity {
  t: number; // Antecedence Time
  a?: number; // mapped activity id see minified activities.json
  r?: RecoveryTypes;
}

export type History = MinifiedActivity[];