import { Group } from './group';

export class Grouping {
  id: string;
  name: string;
  groups: Group[];

  constructor(id: string, name: string, groups: Group[]) {
    this.id = id;
    this.name = name;
    this.groups = groups;
  }
}