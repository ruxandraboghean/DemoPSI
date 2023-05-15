import { Application } from "../Application";
import { Request } from "./Request";

export enum LicenseAction {
	REGISTER,
	REVOKE,
	PAUSE,
}
export class LicenseRequest extends Request {
	application: Application;
	action: LicenseAction;
}
