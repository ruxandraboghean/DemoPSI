import { Employee } from "../Employee";

enum TesterType {
	ManualTester,
	AutomationTester,
	SecurityTester,
}

export class Tester extends Employee {
	private type: TesterType;
}
