import { Entity } from "./Entity";
import { License } from "./License";
import { Team } from "./Team";

export enum JobLevel {
	L1,
	L2,
	L3,
	SDE,
	MSDE,
	SSDE,
	DSDE,
}

export class Employee extends Entity {
	public firstName: string;
	public lastName: string;
	public phone: string;
	public email: string;

	public username: string;
	public jobLevel: JobLevel;

	public team: Team;
	public licences: Array<License>;
}
