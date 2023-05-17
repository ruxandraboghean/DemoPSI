import { useEffect, useState } from "react";
import { create } from "zustand";
import { Repo } from "../firebase";
import { Application } from "../model/Application";
import { Employee } from "../model/Employee";
import {
	LicenseAction,
	LicenseRequest,
} from "../model/Transactions/LicenseRequest";
import { Request } from "../model/Transactions/Request";

function example() {
	// Exemplu returnare requesturi
	const [requests, setRequests] = useState<Request[] | null>(null);
	useEffect(() => {
		Repo.getRequests().then((e) => {
			setRequests(e);
		});
	}, []);
	if (!requests) {
		return <>Loading Requests</>;
	}

	const [employees, setEmployees] = useState<Employee[] | null>(null);
	useEffect(() => {
		Repo.getEmployees().then((e) => {
			setEmployees(e);
		});
	}, []);
	if (!employees) {
		return <>Loading Employees</>;
	}

	const [applications, setApplications] = useState<Application[] | null>(null);
	useEffect(() => {
		Repo.getApplications().then((e) => {
			setApplications(e);
		});
	}, []);
	if (!applications) {
		return <>Loading Employees</>;
	}

	// Exemplu creare request
	const req = new LicenseRequest();
	req.initiator = employees[0];
	req.receiver = employees[0];
	req.application = applications[0]
	req.action = LicenseAction.REGISTER;
	Repo.addLicenseRequest(req);

	// Exemplu schimbare pagina
	usePage.setState({ currentPage: "license" });
}

const usePage = create<{ currentPage: "feed" | "choose" | "team" | "license" }>(
	() => ({
		currentPage: "feed",
	})
);

// Individual
export function Requests() {
	const { currentPage } = usePage();

	// Routing
	switch (currentPage) {
		case "feed":
			return <RequestsFeedView />;
		case "choose":
			return <ChooseRequestTypeView />;
		case "team":
			return <CreateTeamRequestView />;
		case "license":
			return <CreateLicenseRequestView />;
	}
}

export function RequestsFeedView() {
	return (
		<button
			onClick={() => {
				usePage.setState({ currentPage: "choose" });
			}}
		>
			Ruxandra
		</button>
	);
}

export function ChooseRequestTypeView() {
  return (
    <div className="flex-col items-center p-10 w-full">
      <div className="flex justify-between items-center">
        <div className="pt-10 font-bold text-2xl">Requests</div>
        <button
          onClick={() => {
            usePage.setState({ currentPage: "feed" });
          }}
          className=" w-28 h-10 m-10 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm float-right hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
        >
          Go back
        </button>
      </div>

      <div className="font-bold text-2xl">
        <div className=" flex z-10 mt-5 flex w-screen max-w-max px-4">
          <div className="pl-36 flex h-100 grid grid-cols-2 gap-20 ">
            <div className=" border border-gray-100 shadow-lg rounded-lg p-2 w-96 h-56 ">
              <div className=" flex-col text-base p-2">
                <h3 className=" font-bold pt-10 pl-2">Make a license request</h3>
                <p className="font-normal text-sm pl-2">In order to make a license request, please press the button below.</p>
                <button
                  onClick={() => {
                    usePage.setState({ currentPage: "license" });
                  }}
                  className="text-sky-700	text-sm hover:text-sky-500 pt-16 pl-2"
                >
                  Initiate a license request
                </button>
              </div>
            </div>
            <div className=" border border-gray-100 shadow-lg rounded-lg p-2 w-96 h-56">
              <div className="flex-col text-base p-2">
                <h3 className=" font-bold pt-10 pl-2">Make a team request</h3>
                <p className="font-normal text-sm pl-2">In order to make a team request, please press the button below.</p>
                <button
                  onClick={() => {
                    usePage.setState({ currentPage: "team" });
                  }}
                  className=" text-sky-700 text-sm hover:text-sky-500 pt-16 pl-2"
                >
                  Initiate a team request
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export function CreateLicenseRequestView() {
	return <div>Cristi</div>;
}

export function CreateTeamRequestView() {
	return <div>Cristi</div>;
}