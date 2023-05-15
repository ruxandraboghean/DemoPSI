import { License } from "../License";
import { Team } from "../Team";
import { Request } from "./Request";

export enum TeamAction {
	JOIN,
	LEAVE,
}

export class TeamRequest extends Request {
	team: Team;
	action: TeamAction;
}
