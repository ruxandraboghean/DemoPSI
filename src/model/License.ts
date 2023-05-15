import { Application } from "./Application";
import { Employee } from "./Employee";

export enum LicenceType {
	DEMO,
	FULL,
}
export class License {
	public id: string;
	public key: string;
	public type: LicenceType;
	public application: Application;
	public employee: Employee;
}
