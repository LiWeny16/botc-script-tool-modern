// 角色类型定义
export type Team = 'townsfolk' | 'outsider' | 'minion' | 'demon' | 'traveler';

export interface Character {
  id: string;
  name: string;
  ability: string;
  team: Team;
  image: string;
  firstNight: number;
  otherNight: number;
  firstNightReminder?: string;
  otherNightReminder?: string;
  reminders?: string[];
  setup?: boolean;
}

export interface NightAction {
  image: string;
  index: number;
}

export interface ScriptMeta {
  name: string;
  author: string;
}

export interface Script {
  title: string;
  author: string;
  characters: {
    townsfolk: Character[];
    outsider: Character[];
    minion: Character[];
    demon: Character[];
  };
  firstnight: NightAction[];
  othernight: NightAction[];
  jinx: Record<string, Record<string, string>>;
  all: Character[];
}
