import { useEffect, useState, Fragment } from "react";
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
import { TbCheck, TbChevronUp, TbList, TbUser } from "react-icons/tb";
import { Listbox, Transition } from "@headlessui/react";
import { Team } from "../model/Team";
import { TeamAction } from "../model/Transactions/TeamRequest";

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
  // const req = new LicenseRequest();
  // req.initiator = employees[0];
  // req.receiver = employees[0];
  // req.application = applications[0];
  // req.action = LicenseAction.REGISTER;
  // req.status = RequestStatus.PENDING;
  // Repo.addLicenseRequest(req);

  // Exemplu schimbare pagina
  usePage.setState({ currentPage: "license" });
}

const usePage = create<{ currentPage: "feed" | "choose" | "team" | "license" }>(
  () => ({
    currentPage: "license",
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
    <div className="flex-col items-center p-10 w-full bg-gray-100">
      <div className="flex justify-between items-center">
        <div className="pt-10 font-bold text-2xl">Requests</div>
        <button
          type="button"
          onClick={() => {
            usePage.setState({ currentPage: "choose" });
          }}
          className="m-10 mr-0 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm float-right hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Create Request
        </button>
      </div>
      <div className="flex-col w-full mb-2 gap-0.5">
        <div className=" grid grid-cols-4 divide-x w-full box-border border-2 border-slate-100 rounded-md  bg-white shadow-sm">
          <div
            onClick={() => {
              useTab.setState({ currentTab: "all" });
            }}
            className={`py-4 px-4 box-border cursor-pointer flex-grow  ${
              useTab.getState().currentTab === "all" &&
              "border-b-[2px] border-b-indigo-600"
            }`}
          >
            All Requests
          </div>
          <div
            onClick={() => {
              useTab.setState({ currentTab: "pending" });
            }}
            className={`py-4 px-4 box-border cursor-pointer flex-grow  ${
              useTab.getState().currentTab === "pending" &&
              "border-b-[2px] border-b-indigo-600"
            }`}
          >
            Pending Requests
          </div>
          <div
            onClick={() => {
              useTab.setState({ currentTab: "accepted" });
            }}
            className={`py-4 px-4 box-border cursor-pointer flex-grow ${
              useTab.getState().currentTab === "accepted" &&
              "border-b-[2px] border-b-indigo-600"
            }`}
          >
            Accepted Requests
          </div>
          <div
            onClick={() => {
              useTab.setState({ currentTab: "denied" });
            }}
            className={`py-4 px-4 box-border cursor-pointer flex-grow ${
              useTab.getState().currentTab === "denied" &&
              "border-b-[2px] border-b-indigo-600"
            }`}
          >
            Denied Requests
          </div>
        </div>

        <div className="flex-col box-border mt-5 ">
          {filteredRequests?.map((request) => {
            return (
              <div
                className="flex border-2 p-2 justify-between items-center mb-3  bg-white shadow-sm rounded-md"
                key={request.id}
              >
                <div className="flex-col text-base p-2">
                  <h3 className="font-bold">Team Request</h3>
                  <div className="flex text-sm text-stone-500 items-center gap-4">
                    <p className="">by Ruxandra Boghean</p>

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
  return (
    <div className="flex-col items-center p-10 w-full bg-gray-100">
      <div className="flex justify-between items-center">
        <div className="pt-10 font-bold text-2xl">Requests</div>
        <button
          type="button"
          onClick={() => {
            usePage.setState({ currentPage: "feed" });
          }}
          className="m-10 mr-0 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm float-right hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Go Back
        </button>
      </div>

      <div className="w-full flex justify-between gap-4 mt-6">
        <div className="bg-white w-full px-6 rounded-md shadow-sm py-8 relative">
          <div className="absolute p-3 bg-indigo-600 top-0 left-[20px] translate-y-[-50%] rounded-md fill-white text-white">
            <TbUser />
          </div>
          <div className="font-bold text-md text-gray-900">
            Make a team request
          </div>
          <div className="text-gray-500">
            Varius facilisi mauris sed sit. Non sed et duis dui leo, vulputate
            id malesuada non. Cras aliquet purus dui laoreet diam sed lacus,
            fames.
          </div>
          <button
            onClick={() => {
              usePage.setState({ currentPage: "license" });
            }}
            className="mt-8 text-indigo-600 font-semibold hover:text-indigo-400"
          >
            Initiate a team request
          </button>
        </div>
        <div className="bg-white w-full px-6 rounded-md shadow-sm py-8 relative">
          <div className="absolute p-3 bg-indigo-600 top-0 left-[20px] translate-y-[-50%] rounded-md fill-white text-white">
            <TbList />
          </div>
          <div className="font-bold text-md text-gray-900">
            Make a license request
          </div>
          <div className="text-gray-500">
            Varius facilisi mauris sed sit. Non sed et duis dui leo, vulputate
            id malesuada non. Cras aliquet purus dui laoreet diam sed lacus,
            fames.
          </div>
          <button
            onClick={() => {
              usePage.setState({ currentPage: "team" });
            }}
            className="mt-8 text-indigo-600 font-semibold hover:text-indigo-400"
          >
            Initiate a license request
          </button>
        </div>
      </div>
    </div>
  );
}

export function CreateLicenseRequestView() {
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const [teams, setTeams] = useState<Team[] | null>(null);

  const [selected, setSelected] = useState<Employee | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedAction, setSelectedAction] = useState<"JOIN" | "LEAVE">(
    "JOIN"
  );

  useEffect(() => {
    Repo.getEmployees().then((e) => {
      setEmployees(e);
      setSelected(e[0]);
    });
    Repo.getTeams().then((e) => {
      console.log(e);
      setTeams(e);
      setSelectedTeam(e[0]);
    });
  }, []);
  if (!employees) {
    return <>Loading Employees</>;
  }
  if (!teams) {
    return <>Loading Employees</>;
  }
  return (
    <div className="flex-col items-center p-10 w-full bg-gray-100">
      <div className="flex justify-between items-center">
        <div className="pt-10 font-bold text-2xl">Requests</div>
        <button
          type="button"
          onClick={() => {
            usePage.setState({ currentPage: "choose" });
          }}
          className="m-10 mr-0 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm float-right hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Go Back
        </button>
      </div>

      <div className="bg-white w-full px-6 rounded-md shadow-sm py-6 relative">
        <div className="font-semibold text-lg">Team Request</div>
        <div className="text-gray-600 text-md">
          This information will be displayed publicly so be careful what you
          share.{" "}
        </div>
        {/* Table */}
        <div className="flex flex-col mt-6 gap-4">
          <div className="flex justify-between items-center text-gray-600">
            <div className="font-semibold w-48">Initiator</div>
            <Listbox value={selected} onChange={setSelected}>
              <div className="w-64 z-50">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none border-[1px] border-2 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm  z-[9999]">
                  <span className="block truncate">{selected!.firstName}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <TbChevronUp
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute w-64 z-50 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {employees.map((person, personIdx) => (
                      <Listbox.Option
                        key={personIdx}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-amber-100 text-amber-900"
                              : "text-gray-900"
                          }`
                        }
                        value={person}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {person.firstName}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                <TbCheck
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
            <button
              type="button"
              onClick={() => {
                usePage.setState({ currentPage: "choose" });
              }}
              className="mr-0 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm float-right hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600  w-36"
            >
              Add employee
            </button>
          </div>

          <div className="flex justify-between items-center text-gray-600">
            <div className="font-semibold w-48">Team</div>
            <Listbox value={selectedTeam} onChange={setSelectedTeam}>
              <div className="relative w-64">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none border-[1px] border-2 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate">{selectedTeam!.name}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <TbChevronUp
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-64 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {teams.map((person, personIdx) => (
                      <Listbox.Option
                        key={personIdx}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-amber-100 text-amber-900"
                              : "text-gray-900"
                          }`
                        }
                        value={person}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {person.name}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                <TbCheck
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
            <button
              type="button"
              onClick={() => {
                usePage.setState({ currentPage: "choose" });
              }}
              className="mr-0 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm float-right hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-36"
            >
              Add Team
            </button>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <div className="font-semibold w-48">Action</div>
            <Listbox value={selectedAction} onChange={setSelectedAction}>
              <div className="relative w-64">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none border-[1px] border-2 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate">{selectedAction}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <TbChevronUp
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-1 max-h-60 w-64 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {["JOIN", "LEAVE"].map((person, personIdx) => (
                      <Listbox.Option
                        key={personIdx}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-amber-100 text-amber-900"
                              : "text-gray-900"
                          }`
                        }
                        value={person}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {person}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                <TbCheck
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
            <button
              type="button"
              onClick={() => {
                usePage.setState({ currentPage: "choose" });
              }}
              className="invisible mr-0 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm float-right hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-36"
            >
              Add Team
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              usePage.setState({ currentPage: "feed" });
            }}
            className="mr-0 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm float-right hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-36"
          >
            Add Request
          </button>
        </div>
      </div>
    </div>
  );
}

export function CreateTeamRequestView() {
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const [applications, setApplications] = useState<Application[] | null>(null);

  const [selected, setSelected] = useState<Employee | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [selectedAction, setSelectedAction] = useState<
    "REGISTER" | "REVOKE" | "PAUSE"
  >("REGISTER");

  useEffect(() => {
    Repo.getEmployees().then((e) => {
      setEmployees(e);
      setSelected(e[0]);
    });
    Repo.getApplications().then((e) => {
      setApplications(e);
      setSelectedApp(e[0]);
    });
  }, []);
  if (!employees) {
    return <>Loading Employees</>;
  }
  if (!applications) {
    return <>Loading Employees</>;
  }
  return (
    <div className="flex-col items-center p-10 w-full bg-gray-100">
      <div className="flex justify-between items-center">
        <div className="pt-10 font-bold text-2xl">Requests</div>
        <button
          type="button"
          onClick={() => {
            usePage.setState({ currentPage: "choose" });
          }}
          className="m-10 mr-0 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm float-right hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Go Back
        </button>
      </div>

      <div className="bg-white w-full px-6 rounded-md shadow-sm py-6 relative">
        <div className="font-semibold text-lg">License Request</div>
        <div className="text-gray-600 text-md">
          This information will be displayed publicly so be careful what you
          share.{" "}
        </div>
        {/* Table */}
        <div className="flex flex-col mt-6 gap-4">
          <div className="flex justify-between items-center text-gray-600">
            <div className="font-semibold w-48">Initiator</div>
            <Listbox value={selected} onChange={setSelected}>
              <div className="w-64 z-50">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none border-[1px] border-2 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm  z-[9999]">
                  <span className="block truncate">{selected!.firstName}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <TbChevronUp
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute w-64 z-50 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {employees.map((person, personIdx) => (
                      <Listbox.Option
                        key={personIdx}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-amber-100 text-amber-900"
                              : "text-gray-900"
                          }`
                        }
                        value={person}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {person.firstName}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                <TbCheck
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
            <button
              type="button"
              onClick={() => {
                usePage.setState({ currentPage: "choose" });
              }}
              className="mr-0 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm float-right hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600  w-36"
            >
              Add employee
            </button>
          </div>

          <div className="flex justify-between items-center text-gray-600">
            <div className="font-semibold w-48">Application</div>
            <Listbox value={selectedApp} onChange={setSelectedApp}>
              <div className="relative w-64">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none border-[1px] border-2 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate">{selectedApp!.name}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <TbChevronUp
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-64 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {applications.map((person, personIdx) => (
                      <Listbox.Option
                        key={personIdx}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-amber-100 text-amber-900"
                              : "text-gray-900"
                          }`
                        }
                        value={person}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {person.name}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                <TbCheck
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>

            <button
              type="button"
              onClick={() => {
                usePage.setState({ currentPage: "choose" });
              }}
              className="mr-0 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm float-right hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-36"
            >
              Add application
            </button>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <div className="font-semibold w-48">Action</div>
            <Listbox value={selectedAction} onChange={setSelectedAction}>
              <div className="relative w-64">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none border-[1px] border-2 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate">{selectedAction}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <TbChevronUp
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-64 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {["REGISTER", "PAUSE", "REVOKE"].map(
                      (person, personIdx) => (
                        <Listbox.Option
                          key={personIdx}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-amber-100 text-amber-900"
                                : "text-gray-900"
                            }`
                          }
                          value={person}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {person}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                  <TbCheck
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      )
                    )}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
            <button
              type="button"
              onClick={() => {
                usePage.setState({ currentPage: "choose" });
              }}
              className="invisible mr-0 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm float-right hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-36"
            >
              Add Team
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              usePage.setState({ currentPage: "feed" });
            }}
            className="mr-0 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm float-right hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-36"
          >
            Add Request
          </button>
        </div>
      </div>
    </div>
  );
}
