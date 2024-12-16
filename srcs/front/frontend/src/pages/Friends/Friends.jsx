import { useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import styles from './Friends.module.css';
import logo from "../../assets/images/logo_friends.png"

const Friends = () => {
	const { authTokens, logoutUser } = useContext(AuthContext);
	const [searchUsername, setSearchUsername] = useState('');
	const [friends, setFriends] = useState([]);
	const [friendRequests, setFriendRequests] = useState([]);
	const [error, setError] = useState(null);
	const [addFriendError, setAddFriendError] = useState('');

	useEffect(() => {
		const fetchFriendsAndRequests = async () => {
			try {
				let friendsResponse = await fetch(`${import.meta.env.VITE_API_URL}/users/friends/`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + String(authTokens.access)
					}
				});

				let requestsResponse = await fetch(`${import.meta.env.VITE_API_URL}/users/friends/requests/`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + String(authTokens.access)
					}
				});

				if (!friendsResponse.ok || !requestsResponse.ok) {
					logoutUser();
					throw new Error('Failed to fetch friends or requests');
				}

				const friendsData = await friendsResponse.json();
				const requestsData = await requestsResponse.json();

				setFriends(friendsData);
				setFriendRequests(requestsData);
			} catch (error) {
				console.error('Error fetching friends and requests:', error);
				setError(error.message);
			}
		};

		fetchFriendsAndRequests();
	}, [authTokens]);

	const sendFriendRequest = async () => {
		setAddFriendError('');
		try {
			let response = await fetch(`${import.meta.env.VITE_API_URL}/users/friends/send-request/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + String(authTokens.access)
				},
				body: JSON.stringify({ username: searchUsername })
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.detail || 'Failed to send friend request');
			}
			setSearchUsername('');
		} catch (error) {
			console.error('Error sending friend request:', error);
			setAddFriendError(error.message);
		}
	};

	const acceptFriendRequest = async (requestId) => {
		try {
			let response = await fetch(`${import.meta.env.VITE_API_URL}/users/friends/accept-request/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + String(authTokens.access)
				},
				body: JSON.stringify({ request_id: requestId })
			});

			if (!response.ok) {
				throw new Error('Failed to accept friend request');
			}

			setFriendRequests(prevRequests =>
				prevRequests.filter(req => req.id !== requestId)
			);

			let friendsResponse = await fetch(`${import.meta.env.VITE_API_URL}/users/friends/`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + String(authTokens.access)
				}
			});

			if (friendsResponse.ok) {
				const friendsData = await friendsResponse.json();
				setFriends(friendsData);
			}
		} catch (error) {
			console.error('Error accepting friend request:', error);
		}
	};

	const removeFriend = async (friendId) => {
		try {
			let response = await fetch(`${import.meta.env.VITE_API_URL}/users/friends/remove/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + String(authTokens.access)
				},
				body: JSON.stringify({ friend_id: friendId })
			});

			if (!response.ok) {
				throw new Error('Failed to remove friend');
			}

			setFriends(prevFriends =>
				prevFriends.filter(friend => friend.friend_id !== friendId)
			);
		} catch (error) {
			console.error('Error removing friend:', error);
		}
	};

	return (
		<div className={styles.centered_container}>
			<img
				src={logo}
				alt="Logo"
				className={styles.logo}
			/>

			{error && (
				<div className={styles.error_message}>{error}</div>
			)}

			<div className={styles.userinfo_container}>
				<h2 style={{color: 'whitesmoke', marginBottom: '20px'}}>Friend Requests</h2>
				{friendRequests.length === 0 ? (
					<p style={{color: 'whitesmoke'}}>No pending friend requests</p>
				) : (
					friendRequests.map(request => (
						<div key={request.id} className={styles.friend_item}>
							<span>{request.sender_username}</span>
							<button
								className={styles.accept_button}
								onClick={() => acceptFriendRequest(request.id)}
							>
								Accept
							</button>
						</div>
					))
				)}
			</div>

			<div className={styles.userinfo_container}>
				<h2 style={{color: 'whitesmoke', marginBottom: '20px'}}>Add Friend</h2>
				<div className={styles.add_friend_input}>
					<input
						type="text"
						placeholder="Enter username"
						value={searchUsername}
						onChange={(e) => setSearchUsername(e.target.value)}
					/>
					<button
						className={styles.send_request_button}
						onClick={sendFriendRequest}
					>
						Send Request
					</button>
				</div>
				{addFriendError && (
					<p style={{color: 'red', marginTop: '10px'}}>{addFriendError}</p>
				)}
			</div>

			<div className={styles.userinfo_container}>
				<h2 style={{color: 'whitesmoke', marginBottom: '20px'}}>My Friends</h2>
				{friends.length === 0 ? (
					<p style={{color: 'whitesmoke'}}>You have no friends yet</p>
				) : (
					friends.map(friend => (
						<div key={friend.friend_id} className={styles.friend_item}>
							<span>{friend.friend_username}</span>
							<button
								className={styles.remove_button}
								onClick={() => removeFriend(friend.friend_id)}
							>
								Remove
							</button>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default Friends;