import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from "./Register.module.css"

const Register = () => {

	const navigate = useNavigate()
	const [displayError, setDisplayError] = useState("");

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        passwordVerif: '',
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.password !== formData.passwordVerif) {
            setDisplayError("Passwords do not match!")
            return
        }

        const submitData = {
            username: formData.username,
            password: formData.password,
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submitData)
            })

            const data = await response.json()

            if (response.ok) {
                navigate('/login')
            } else {
                alert(JSON.stringify(data))
            }
        } catch (error) {
            console.error('Registration error:', error)
            setDisplayError("Username is already taken")
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className={styles.form_container}>
                <input
                    type="text"
                    name="username"
                    placeholder="Enter Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="passwordVerif"
                    placeholder="Confirm Password"
                    value={formData.passwordVerif}
                    onChange={handleChange}
                    required
                />
				{displayError === "" ? <></> : (<p>{displayError}</p>)}
                <input type="submit" value="Register"/>
            </form>
        </div>
    )
}

export default Register