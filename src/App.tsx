import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { Logo } from "./logo";
import { Home } from "./pages/Home";
import { Requests } from "./pages/Requests";
import {
	TbCalendar,
	TbChartBar,
	TbCircle,
	TbFolder,
	TbHome,
	TbInbox,
	TbLogout,
	TbUser,
	TbUsers,
} from "react-icons/tb";
import { IconType } from "react-icons";
import { Employees } from "./pages/Employees";
import { Teams } from "./pages/Teams";
import { Projects } from "./pages/Projects";
import { Applications } from "./pages/Applications";
import { Vendors } from "./pages/Vendors";
import { Repo, signIn, signOut, useAuth } from "./firebase";
import { TeamAction, TeamRequest } from "./model/Transactions/TeamRequest";
import { Entity } from "./model/Entity";
import { Employee } from "./model/Employee";
import { Team } from "./model/Team";
import {
	LicenseAction,
	LicenseRequest,
} from "./model/Transactions/LicenseRequest";

// const req = new LicenseRequest();
// const initiator = new Employee();
// initiator.id = "0";
// const receiver = new Employee();
// receiver.id = "0";

// req.initiator = initiator;
// req.receiver = receiver;
// req.action = LicenseAction.REGISTER;
// Repo.addLicenseRequest(req);

// Repo.getRequests().then((e) => {
// 	console.log(e);
// });

function MenuButton({
	title,
	active,
	icon,
}: {
	title: string;
	active: boolean;
	icon: JSX.Element;
}) {
	const navigate = useNavigate();
	return (
		<div
			onClick={() => {
				navigate(title.toLowerCase());
			}}
			className="flex items-center gap-2 text-base text-white fill-white w-full hover:bg-gray-900 cursor-pointer px-4 py-2 rounded-md transition-all"
		>
			{icon}
			{title}
		</div>
	);
}

function Layout() {
	const auth = useAuth();

	if (auth.user == "loading") {
		return <>Loading...</>;
	}
	if (!auth.user) {
		return <button onClick={() => signIn()}>sign in</button>;
	}

	return (
		<div className="flex h-full">
			{/* Side bar */}
			<div className="w-64 bg-gray-800 h-full flex flex-col items-center py-10 gap-8 px-2 shadow-md">
				{/* Logo */}
				<div className="flex flex-col items-center gap-4">
					<Logo />
					<div className="text-white font-bold">License Manager</div>
				</div>
				{/* Buttons */}
				<div className="flex flex-col gap-2 w-full">
					<MenuButton title="Dashboard" active icon={<TbHome />} />
					<MenuButton title="Employees" active icon={<TbUser />} />
					<MenuButton title="Teams" active icon={<TbUsers />} />
					<MenuButton title="Projects" active icon={<TbFolder />} />
					<MenuButton title="Vendors" active icon={<TbInbox />} />
					<MenuButton
						title="Applications"
						active
						icon={<TbCalendar />}
					/>
					<MenuButton title="Requests" active icon={<TbChartBar />} />
				</div>

				<div className="flex flex-col w-full gap-2">
					<div className="text-sm text-white text-center">
						Logged in as {auth.user.displayName}
					</div>
					<div
						onClick={() => {
							signOut();
						}}
						className="flex items-center gap-2 text-base text-white fill-white w-full hover:bg-gray-900 cursor-pointer px-4 py-2 rounded-md transition-all"
					>
						<TbLogout />
						Sign Out
					</div>
				</div>
			</div>
			{/* Children */}
			<Outlet />
		</div>
	);
}

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Home />} />
				<Route path="dashboard" element={<Home />} />
				<Route path="employees" element={<Employees />} />
				<Route path="teams" element={<Teams />} />
				<Route path="projects" element={<Projects />} />
				<Route path="applications" element={<Applications />} />
				<Route path="vendors" element={<Vendors />} />
				<Route path="requests" element={<Requests />} />
			</Route>
		</Routes>
	);
}

export default App;
