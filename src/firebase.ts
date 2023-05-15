// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import {
	getAuth,
	User,
	GoogleAuthProvider,
	signInWithPopup,
} from "firebase/auth";
import { create } from "zustand";
import { nanoid } from "nanoid";
import { LicenseRequest } from "./model/Transactions/LicenseRequest";
import { TeamRequest } from "./model/Transactions/TeamRequest";
import { Application } from "./model/Application";
import { Team } from "./model/Team";
import { Employee, JobLevel } from "./model/Employee";
import { Project } from "./model/Project";
import { LicenceType, License } from "./model/License";
const firebaseConfig = {
	apiKey: "AIzaSyAhsit-Ti2TbQ0Yy4NGBhXJ0aDTOhwkR9Y",
	authDomain: "psidemo-55e06.firebaseapp.com",
	projectId: "psidemo-55e06",
	storageBucket: "psidemo-55e06.appspot.com",
	messagingSenderId: "83090741300",
	appId: "1:83090741300:web:e23b3cf9b1e8f7c6a7d261",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

auth.onAuthStateChanged((state) => {
	useAuth.setState({ user: state });
});

interface AuthState {
	user: User | null | "loading";
}

export async function signIn() {
	const provider = new GoogleAuthProvider();
	const authData = await signInWithPopup(auth, provider);

	if (authData.user) useAuth.setState({ user: authData.user });
}

export function signOut() {
	auth.signOut();
}

export const useAuth = create<AuthState>(() => ({
	user: "loading",
}));

namespace Database {
	export interface Request {
		type: "License" | "Team";
		initiator: string;
		receiver: string;
		action: number;
		status: number;
		team?: string;
		license?: string;
	}
	export interface Employee {
		type: "Employee" | "Team";
		firstName: string;
		lastName: string;
		phone: string;
		email: string;
		username: string;
		jobLevel: JobLevel;
		team: string;
	}
	export interface Team {
		name: string;
		manager: string;
		project: string;
	}
	export interface License {
		id: string;
		key: string;
		type: LicenceType;
		application: string;
		employee: string;
	}
}

export class Repo {
	static async getRequests(): Promise<(TeamRequest | LicenseRequest)[]> {
		const docRef = doc(firestore, `app/requests`);
		const docData = await getDoc(docRef);

		const employees = await this.getEmployees();
		const teams = await this.getTeams();

		const requests = Object.entries(
			docData.data() as Record<string, Database.Request>
		).map((req) => {
			const data = req[1];
			const id = req[0];
			let constructed: TeamRequest | LicenseRequest =
				data.type == "License"
					? new LicenseRequest()
					: new TeamRequest();

			constructed.action = data.action;
			constructed.initiator = employees.find(
				(employee) => employee.id == data.initiator
			)!;
			constructed.receiver = employees.find(
				(employee) => employee.id == data.receiver
			)!;

			if (constructed instanceof TeamRequest) {
				constructed.team = teams.find((team) => team.id == data.team)!;
			}

			constructed.id = id;
			return constructed;
		});
		return requests;
	}
	static async addTeamRequest(request: TeamRequest) {
		const docRef = doc(firestore, `app/requests`);
		const id = nanoid();
		const requests: Record<string, Database.Request> = {};
		const constructed: Database.Request = {
			type: "Team",
			action: request.action,
			initiator: request.initiator.id,
			receiver: request.receiver.id,
			status: request.action,
			team: request.team.id,
		};
		requests["test"] = constructed;
		await setDoc(docRef, requests, { merge: true });
	}
	static async addLicenseRequest(request: LicenseRequest) {
		const docRef = doc(firestore, `app/requests`);
		const id = nanoid();
		const requests: Record<string, Database.Request> = {};
		const constructed: Database.Request = {
			type: "License",
			action: request.action,
			initiator: request.initiator.id,
			receiver: request.receiver.id,
			status: request.action,
		};
		requests["test"] = constructed;
		await setDoc(docRef, requests, { merge: true });
	}
	static async getTeams(): Promise<Team[]> {
		const docRef = doc(firestore, `app/teams`);
		const docData = await getDoc(docRef);
		const employees = await this.getEmployees();

		const teams = Object.entries(
			docData.data() as Record<string, Database.Team>
		).map((req) => {
			const data = req[1];
			const id = req[0];

			const constructed = new Team();
			constructed.id = id;
			constructed.manager = employees.find(
				(employee) => employee.id == data.manager
			)!;
			constructed.project = new Project();
			return constructed;
		});
		return teams;
	}
	static async getEmployees(): Promise<Employee[]> {
		const docRef = doc(firestore, `app/employees`);
		const docData = await getDoc(docRef);
		const employees = Object.entries(
			docData.data() as Record<string, Database.Employee>
		).map((req) => {
			const data = req[1];
			const id = req[0];

			const constructed = new Employee();
			constructed.id = id;
			constructed.email = data.email;
			constructed.firstName = data.firstName;
			constructed.lastName = data.lastName;
			constructed.jobLevel = data.jobLevel;
			constructed.phone = data.phone;
			constructed.username = data.username;
			return constructed;
		});
		return employees;
	}
}
