import { useState, useRef, useEffect } from 'react'
import styles from './NameForm.module.css'

function NameForm({ wsRef, nameError }){

	const [name, setName] = useState("");
	const inputRef = useRef(null);

	const handleNameChange = (e) => {
		let newName = e.target.value;
		if (newName.length > 11)
			return ;
		setName(() => newName.trim());
		return ;
	}

	const sendName = () => {
		if (name.length < 1)
			return ;
		if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN)
			wsRef.current.send(JSON.stringify({ set_name: name }));
		return ;
	}

	useEffect(() => {
		if (inputRef.current)
			inputRef.current.select(); // Auto-select the text inside the input
	}, []);

	return (
		<div className={styles.box}>
			<p>{wsRef.current && wsRef.current.readyState === WebSocket.OPEN ? "Enter Your Arena Name :" : "Connecting..."}</p>
			<input	type="text"
					placeholder='...'
					ref={inputRef}
					value={name}
					onChange={(e) => handleNameChange(e)}
					onKeyDown={(e) => e.key == "Enter" && sendName()}
			/>
			{nameError != false &&
				<div className={styles.info_message}>
					<p className="m-0">{nameError}</p>
				</div>
			}
			{name == "" ?
				<button style={{color:'#a0a0a0', cursor:'default'}}>CONFIRM</button>
			:
				<button onClick={() => sendName()}>CONFIRM</button>
			}
		</div>
	)
}

export default NameForm