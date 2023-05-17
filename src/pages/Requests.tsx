import { useEffect, useState } from "react";
import { create } from "zustand";
import { Repo } from "../firebase";
import { Application } from "../model/Application";
import { Employee } from "../model/Employee";
import { Pagination } from "../components/Pagination";
import {
  LicenseAction,
  LicenseRequest,
} from "../model/Transactions/LicenseRequest";
import { Request, RequestStatus } from "../model/Transactions/Request";
import { AiOutlineInfoCircle } from "react-icons/ai";

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
  req.application = applications[0];
  req.action = LicenseAction.REGISTER;
  req.status = RequestStatus.PENDING;
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

const useTab = create<{
  currentTab: "all" | "pending" | "accepted" | "denied";
}>(() => ({
  currentTab: "all",
}));

export function RequestsFeedView() {
  const [requests, setRequests] = useState<Request[] | null>(null);
  const { currentTab } = useTab();

  useEffect(() => {
    Repo.getRequests().then((e) => {
      setRequests(e);
    });
  }, []);

  const filteredRequests = requests?.filter((request) => {
    switch (currentTab) {
      case "pending":
        return request.status.toString() === "PENDING";
      case "denied":
        return request.status.toString() === "DENIED";
      case "accepted":
        return request.status.toString() === "ACCEPTED";
      default:
        return true;
    }
  });

  return (
    <div className="flex-col items-center p-10 w-full">
      <button
        type="button"
        onClick={() => {
          usePage.setState({ currentPage: "choose" });
        }}
        className="m-10 mr-0 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm float-right hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        create request
      </button>
      <div className="flex-col w-full mb-2 gap-0.5">
        <div className=" grid grid-cols-4 divide-x w-full box-border border-2 border-slate-100 rounded-md ">
          <div
            onClick={() => {
              useTab.setState({ currentTab: "all" });
            }}
            className={`py-4 px-4 box-border cursor-pointer flex-grow  ${
              useTab.getState().currentTab === "all" && "bg-gray-200"
            }`}
          >
            All Requests
          </div>
          <div
            onClick={() => {
              useTab.setState({ currentTab: "pending" });
            }}
            className={`py-4 px-4 box-border cursor-pointer flex-grow  ${
              useTab.getState().currentTab === "pending" && "bg-gray-200"
            }`}
          >
            Pending Requests
          </div>
          <div
            onClick={() => {
              useTab.setState({ currentTab: "accepted" });
            }}
            className={`py-4 px-4 box-border cursor-pointer flex-grow ${
              useTab.getState().currentTab === "accepted" && "bg-gray-200"
            }`}
          >
            Accepted Requests
          </div>
          <div
            onClick={() => {
              useTab.setState({ currentTab: "denied" });
            }}
            className={`py-4 px-4 box-border cursor-pointer flex-grow ${
              useTab.getState().currentTab === "denied" && "bg-gray-200"
            }`}
          >
            Denied Requests
          </div>
        </div>

        <div className="flex-col box-border mt-5">
          {filteredRequests?.map((request) => {
            return (
              <div
                className="flex border-2 border-slate-100 rounded-md p-2 justify-between items-center mb-3"
                key={request.id}
              >
                <div className="flex-col text-base p-2">
                  <h3 className="font-bold">Team Request</h3>
                  <div className="flex text-sm text-stone-500 items-center gap-4">
                    <p className="">
                       by Ruxandra Boghean
                    </p>

                    <div className="flex items-center gap-0.5">
                      <AiOutlineInfoCircle className="" />
                      <p>Transfer to Helis Team</p>
                    </div>
                    <p className="">{request.status} </p>
                  </div>
                </div>
                <button className="text-sky-700	text-sm hover:text-sky-500 mr-5">
                  View
                </button>
              </div>
            );
          })}
        </div>
      </div>
      {filteredRequests?.length! > 5 && <Pagination />}
    </div>
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
