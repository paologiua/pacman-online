import { createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/home/home.page';
import NicknamePage from './pages/nickname/nickname.page';
import GameSelectionPage from './pages/game-selection/game-selection.page';
import PlayersListPage from './pages/players-list/players-list.page';
import GamePage from './pages/game/game.page';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <HomePage />,
	},
	{
		path: '/nickname',
		element: <NicknamePage />,
	},
	{
		path: '/game-selection',
		element: <GameSelectionPage />,
	},
	{
		path: '/players-list',
		element: <PlayersListPage />,
	},
	{
		path: '/game',
		element: <GamePage />,
	}
]);