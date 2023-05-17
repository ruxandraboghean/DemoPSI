import { Employee } from "./Employee";
import { Manager } from "./Employee/Manager";
import { Entity } from "./Entity";
import { Project } from "./Project";

export class Team extends Entity {
  public name: string;
  public manager: Manager;
  public project: Project;
  public employees: Array<Employee>;
}
