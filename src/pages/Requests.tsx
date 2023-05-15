import { useEffect, useState } from "react";
import { create } from "zustand";
import { Repo } from "../firebase";
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

	// Exemplu creare request
	const req = new LicenseRequest();
	const initiator = new Employee();
	initiator.id = "0";
	const receiver = new Employee();
	receiver.id = "0";

	req.initiator = initiator;
	req.receiver = receiver;
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
	return <div>Andreea</div>;
}

export function CreateLicenseRequestView() {
	return <div>Cristi</div>;
}

export function CreateTeamRequestView() {
	return <div>Cristi</div>;
}
