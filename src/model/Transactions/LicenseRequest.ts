import { License } from "../License";
import { Request } from "./Request";

enum LicenseAction {
	REGISTER,
	REVOKE,
	PAUSE,
}
export class LicenseRequest extends Request {
	license: License;
	action: LicenseAction;
}
