import { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext.jsx";
import styles from "./Profile.module.css";
import logo from "../../assets/images/logo_profil.png"

const Profile = () => {
	let [profile, setProfile] = useState(null);
	let [isEditing, setIsEditing] = useState(false);
	let [editedProfile, setEditedProfile] = useState({});
	let { authTokens, logoutUser } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleReturn = () => {
		navigate("/home");
	}

	useEffect(() => {
		getPlayerProfile()
	}, [])

	let getPlayerProfile = async () => {
		try {
			let response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile/`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + String(authTokens.access)
				}
			})

			let data = await response.json()

			if (response.status === 200) {
				setProfile(data)
			} else if (response.status === 401) {
				logoutUser()
			}
		} catch (error) {
			console.error('Failed to fetch profile', error)
			logoutUser()
		}
	}

	const handleEditProfile = () => {
		setEditedProfile({
			first_name: profile.first_name,
			last_name: profile.last_name,
			email: profile.email,
			profile_picture: profile.profile_picture || ''
		});
		setIsEditing(true);
	}

	const handleSaveProfile = async () => {
		const updatedFields = Object.fromEntries(
			Object.entries(editedProfile).filter(([key, value]) =>
				value !== profile[key]
			)
		);

		if (Object.keys(updatedFields).length > 0) {
			try {
				let response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile/update/`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + String(authTokens.access)
					},
					body: JSON.stringify(updatedFields)
				})

				let data = await response.json()

				if (response.status === 200) {
					setProfile(data)
					setIsEditing(false)
				} else {
					console.error('Failed to update profile', data)
				}
			} catch (error) {
				console.error('Failed to update profile', error)
			}
		} else {
			setIsEditing(false)
		}
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setEditedProfile(prev => ({
			...prev,
			[name]: value
		}));
	}

	if (!profile) {
		return <div>Loading...</div>
	}

	return (
		<div className={styles.centered_container}>
			<img
				src={logo}
				alt="Logo"
				className="logo"
			/>
			{!isEditing ? (
				<>
					<div className={styles.userinfo_container}>
						{profile.profile_picture ? (
							<img
								className={styles.logo}
								src={profile.profile_picture}
								alt="Profile"
							/>
						) : (
							<img
								className={styles.logo}
								src="https://i.ytimg.com/vi/UqE2vaBsIDo/maxresdefault.jpg"
								alt="Default Profile"
							/>
						)}
						<p><strong>Username:</strong> {profile.username}</p>
						<p><strong>First Name:</strong> {profile.first_name}</p>
						<p><strong>Last Name:</strong> {profile.last_name}</p>
						<p><strong>Email:</strong> {profile.email}</p>
						<button onClick={handleEditProfile}>Edit profile</button>
					</div>
					<button onClick={handleReturn}>RETURN</button>
				</>
			) : (
				<div className={styles.edit_profile_modal}>
					<div className={styles.edit_profile_content}>
						<button className={styles.edit_profile_content_b} onClick={() => setIsEditing(false)}>
							&times;
						</button>
						<h2>Edit Profile</h2>
						<div className={styles.form_group}>
							<label>First Name</label>
							<input type="text" name="first_name" value={editedProfile.first_name || ''} onChange={handleInputChange} placeholder="Optional"/>
						</div>
						<div className={styles.form_group}>
							<label>Last Name</label>
							<input type="text" name="last_name" value={editedProfile.last_name || ''} onChange={handleInputChange} placeholder="Optional"/>
						</div>
						<div className={styles.form_group}>
							<label>Email</label>
							<input type="email" name="email" value={editedProfile.email || ''} onChange={handleInputChange} placeholder="Optional"/>
						</div>
						<div className={styles.form_group}>
							<label>Profile Picture URL</label>
							<input type="text" name="profile_picture" value={editedProfile.profile_picture || ''} onChange={handleInputChange} placeholder="Optional"/>
						</div>
						<button className={styles.edit_profile_content} onClick={handleSaveProfile}>Save</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default Profile;