import { Application } from "./Application";
import { Employee } from "./Employee";

enum LicenceType {
	DEMO,
	FULL,
}
export class License {
	private id: string;
	private key: string;
	private type: LicenceType;
	public application: Application;
	public employee: Employee;
}
