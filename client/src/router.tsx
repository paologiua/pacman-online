import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/home/home.page";
import NicknamePage from "./pages/nickname/nickname.page";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <HomePage />,
	},
	{
		path: "/nickname",
		element: <NicknamePage />,
	},
]);