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
import {
  LicenseAction,
  LicenseRequest,
} from "./model/Transactions/LicenseRequest";
import { TeamAction, TeamRequest } from "./model/Transactions/TeamRequest";
import { Application } from "./model/Application";
import { Team } from "./model/Team";
import { Employee, JobLevel } from "./model/Employee";
import { Project } from "./model/Project";
import { LicenceType, License } from "./model/License";
import { Vendor } from "./model/Vendor";
import { RequestStatus } from "./model/Transactions/Request";
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

  if (authData.user) {
    useAuth.setState({ user: authData.user });
    const employees = await Repo.getEmployees();
    if (!employees.find((e) => e.email == authData.user.email)) {
      const newEmployee = new Employee();
      newEmployee.email = authData.user.email!;
      newEmployee.firstName = authData.user.displayName!;
      newEmployee.lastName = authData.user.displayName!;
      newEmployee.phone = authData.user.phoneNumber!;
      newEmployee.username = authData.user.displayName!;
      newEmployee.jobLevel = 0;
      newEmployee.id = nanoid();
      Repo.addEmployee(newEmployee);
    }
  }
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
    status: RequestStatus;
    team?: string;
    application?: string;
    license?: string;
  }
  export interface Employee {
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
        data.type == "License" ? new LicenseRequest() : new TeamRequest();

      constructed.action = data.action;
      constructed.status = data.status;

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
      status: request.status,
      team: request.team.id,
    };
    requests[id] = constructed;
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
      status: request.status,
      application: request.application.id,
    };
    requests[id] = constructed;
    await setDoc(docRef, requests, { merge: true });
  }

  static async addEmployee(employee: Employee) {
    const docRef = doc(firestore, `app/employees`);
    const id = nanoid();
    const employees: Record<string, Database.Employee> = {};
    const constructed: Database.Employee = {
      email: employee.email,
      firstName: employee.firstName,
      jobLevel: employee.jobLevel,
      lastName: employee.lastName,
      phone: employee.phone,
      team: "",
      username: employee.username,
    };
    employees[id] = constructed;
    await setDoc(docRef, employees, { merge: true });
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

  static async getApplications() {
    // Mocked
    const vendor1 = new Vendor();
    vendor1.id = "0";
    vendor1.name = "Nokia";

    const app1 = new Application();
    app1.vendor = vendor1;
    app1.name = "InteliJ";
    app1.id = "0";

    return [app1];
  }
}