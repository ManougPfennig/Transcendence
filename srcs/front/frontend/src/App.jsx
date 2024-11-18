import React, {useMemo} from 'react';
import { BrowserRouter, Routes, Route} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home/Home"
import Profil from "./pages/Profil/Profil"
import Lobby from "./pages/Lobby/Lobby"
import Pong from "./pages/Pong/Pong"
import NotFound from "./pages/NotFound/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import RedirectHome from './pages/RedirectHome';



function App() {
	// var ws = useMemo(() => {return new WebSocket("ws://localhost:8000/ws/global")}, [ws]);

	const appStyle = {
		body: {
			backgroundImage: "url(./assets/background_pong.png);",
		},
	};

	return (
	<BrowserRouter>
	<Routes>
		<Route path="/" element={<ProtectedRoute> <RedirectHome/> </ProtectedRoute>}/>
		<Route path="/home" element={<ProtectedRoute> <Home/> </ProtectedRoute>}/>
		<Route path="/login" element={<Login/>}></Route>
		<Route path="/profil" element={<ProtectedRoute> <Profil/> </ProtectedRoute>}/>
		<Route path="/register" element={<Register/>}></Route>
		<Route path="*" element={<NotFound/>}></Route>
		<Route path="/local" element={<ProtectedRoute> <Pong/> </ProtectedRoute>}/>
		<Route path="/lobby" element={<ProtectedRoute> <Lobby/> </ProtectedRoute>}/>
		<Route path="/play/:roomId" element={<ProtectedRoute> <Lobby/> </ProtectedRoute>}/>
	</Routes>
	</BrowserRouter>
	)
}

export default App
