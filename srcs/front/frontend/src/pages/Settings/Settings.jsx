import styles from "./Settings.module.css"
import React, { useState, useEffect, useContext } from 'react';
import {useNavigate} from "react-router-dom";
import logo from "../../assets/images/logo_shadowed.png";
import sublogo from "../../assets/images/logo_under.png";
import AuthContext from "../../context/AuthContext.jsx";
// import Select from 'react-select';

function Settings() {
	const navigate = useNavigate();
	const [userLanguage, setLanguage] = useState({
		language: ''
	});
	let {authTokens, logoutUser} = useContext(AuthContext);

	useEffect(() => {
		getPlayerLanguage()
	}, [])

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
				setLanguage(data)
			} else if (response.status === 401) {
				logoutUser()
			}
		} catch (error) {
			console.error('Failed to fetch language', error)
			logoutUser()
		}
	}

	function handleLanguageChange(event){
		setLanguage(event.target.value);
	}

	const handleReturn = () => {
		navigate("/home");
	}

	return (
		<>
			<div className={styles.centered_container}>
				<img className={styles.up_logo} src={logo} alt="TRANSCENDENCE"/>
				<br/>
				<img className={styles.sub_logo} src={sublogo}/>
			</div>
			<div className={styles.userinfo_container}>
				<p>Change language : {userLanguage.language}</p>
				<div className={styles.centered_container}>
					<select value={userLanguage} onChange={handleLanguageChange}>
						<option value="English">English</option>
						<option value="Français">Français</option>
						<option value="Español">Español</option>
					</select>
				</div>
			</div>
			
			<div className={styles.centered_container}>
				<button onClick={handleReturn}>RETURN</button>
			</div>
		</>
	);
}

export default Settings;