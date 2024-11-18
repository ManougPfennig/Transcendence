import React, {useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom"
import CustomGameForm from "../../components/CustomGameForm/CustomGameForm.jsx"
import logo from "../../assets/logo_lobby.png"
import styles from "./Lobby.module.css"


function Lobby(){
	const navigate = useNavigate();
	const [openCustom, setOpenCustom] = useState(false);

	const handleQuick = () => {
		navigate("/join");
	}

	const handleStats = () => {

	}

	const handleReturn = () => {
		navigate("/home");
	}
	return (
		<div>

			<div className={styles.logo_container}>
				<img src={logo}/>
			</div>

			<div className={styles.main_container}>
				<div className={styles.centered_container}>
					<button onClick={() => handleQuick()}>QUICK JOIN</button>
					<button onClick={() => setOpenCustom(openCustom ? false : true)}>CUSTOM GAME</button>
					<button onClick={() => handleStats()}>STATS</button>
					<button onClick={() => handleReturn()}>RETURN</button>
					<br/>
				</div>

				{openCustom && <CustomGameForm/>}
			</div>

		</div>
	);
}

export default Lobby