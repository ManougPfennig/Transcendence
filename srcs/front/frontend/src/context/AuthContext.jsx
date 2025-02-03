// AuthContext.jsx
import { createContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({ children }) => {
	let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
	let [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwtDecode(JSON.parse(localStorage.getItem('authTokens')).access) : null)
	let [loading, setLoading] = useState(true)
	let [languageContext, setLanguageContext] = useState(null)

	const navigate = useNavigate();

	let logoutUser = () => {
		setAuthTokens(null)
		setUser(null)
		setLoading(false)
		localStorage.removeItem('authTokens')
		navigate('/login')
	}

	
	let getPlayerLanguage = async () => {
		try {
			let response = await fetch(`${import.meta.env.VITE_API_URL}/users/settings/`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + String(authTokens.access)
				}
			})

			let data = await response.json()

			if (response.status === 200) {
				const languageContext = data.language;
                setLanguageContext({ languageContext });
			} else if (response.status === 401) {
				logoutUser()
			}
		} catch (error) {
			console.error('Failed to fetch language', error)
			logoutUser()
		}
	}

	let updateToken = async () => {
		if (!authTokens) return;
		
		try {
			let response = await fetch(`${import.meta.env.VITE_API_URL}/users/token/refresh/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({'refresh':authTokens.refresh})
			})
			let data = await response.json();
			
			if (response.status === 200) {
				setAuthTokens(data);
				setUser(jwtDecode(data.access))
				localStorage.setItem('authTokens', JSON.stringify(data))
			} else {
				logoutUser()
			}
		} catch (error) {
			console.error("Token refresh failed", error);
			logoutUser();
		}
	}
	
	let loginWith42 = async (code) => {
		try {
			let response = await fetch(`${import.meta.env.VITE_API_URL}/users/auth/42-login/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ code })
			});
			
			let data = await response.json();
			
			if (response.status === 200) {
				setAuthTokens(data);
				setUser(jwtDecode(data.access));
				localStorage.setItem('authTokens', JSON.stringify(data));
				navigate('/');
			} else {
				console.error("Failed to log in with 42:", data.error);
				navigate('/login');
			}
		} catch (error) {
			console.error("Error during 42 login:", error);
			navigate('/login');
		}
	};
	
	useEffect(() => {
		if (authTokens) {
			updateToken();
		}
		setLoading(false);
	}, [])
	
	useEffect(() => {
		let counter = 1000 * 60 * 4
		let interval = setInterval(() => {
			if (authTokens) {
				updateToken()
			}
		}, counter)
		return () => clearInterval(interval)
	}, [authTokens])
	
	let contextData = {
		user: user,
		authTokens: authTokens,
		setAuthTokens: setAuthTokens,
		setUser: setUser,
		logoutUser: logoutUser,
		loginWith42: loginWith42,
		languageContext: languageContext
	}

	useEffect(() => {
		if (authTokens && user) {
			const ws = new WebSocket(`wss://${window.location.host}/ws/online/${user.username}/`);
			getPlayerLanguage();
			console.log({user})
			return () => {
				ws.close();
			};
		}
	}, [authTokens, user]);
	
	return(
		<AuthContext.Provider value={contextData}>
			{loading ? null : children}
		</AuthContext.Provider>
	);
}