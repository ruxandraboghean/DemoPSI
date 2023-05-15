import { Employee } from "../Employee";

enum DeveloperType {
	FrontEnd,
	BackEnd,
	DevOps,
	FullStack,
}

export class Developer extends Employee {
	private type: DeveloperType;
}
