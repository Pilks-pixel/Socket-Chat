import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar } from "../../components";
import { contactRoute, deleteMessagesRoute } from "../../utils/apiRoutes";
import "../../App.css";
import "../register/register.css";
import axios from "axios";
import io from "socket.io-client";
// const socket = io.connect("http://localhost:8080");
const socket = io.connect("https://socket-chat-node.onrender.com");

function Profile() {
	let location = useLocation();
	const [newAvatar, setNewAvatar] = useState("");
	const [displaySettings, setDisplaySettings] = useState(false);
	const [displayDeleteModal, setDisplayDeleteModal] = useState(false);
	const ref = useRef();
	const goTo = useNavigate();
	const [token, setToken] = useState(
		JSON.parse(localStorage.getItem("jwtToken"))
	);

	const settingsToggle = () =>
		setDisplaySettings(prevSettings => !prevSettings);

	// Delete Current User & Messages
	const deleteUser = async () => {
		try {
			const [messagesRes, userRes] = await Promise.all([
				axios.delete(`${deleteMessagesRoute}/${token.user._id}/delete`),
				axios.delete(`${contactRoute}/${token.user._id}/delete`),
			]);
			console.log(userRes.data);
			console.log(messagesRes.data);

			if (messagesRes && userRes) {
				localStorage.removeItem("jwtToken");
				socket.emit("remove_user", token.user._id);
				goTo("/login");
			}
		} catch (err) {
			console.error("Error deleting user or messages:", err);
		}
	};

	// Modal Logic
	const closeModal = e => {
		if (e.target.className !== "btn--yes" && e.target.className !== "btn") {
			dialog.close();
			setDisplayDeleteModal(prevDeleteModal => !prevDeleteModal);
		}
	};

	const dialog = ref.current;
	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		if (displayDeleteModal) {
			dialog.showModal();
			window.addEventListener("click", closeModal);

			return () => {
				dialog.close();
				window.removeEventListener("click", closeModal);
			};
		}
	}, [displayDeleteModal]);
	/* eslint-enable react-hooks/exhaustive-deps */

	return (
		<div className='container'>
			<h2>Profile</h2>
			<div className='bio'>
				<p>{location.state.username}</p>
				<p>{location.state.email}</p>
				{location.state.isAvatarImageSet && (
					<img
						src={newAvatar || location.state.avatarImage}
						alt='current avatar'
					/>
				)}

				<button onClick={settingsToggle}>Change Avatar</button>
			</div>

			{displaySettings && (
				<Avatar
					selectedAvatar={newAvatar}
					setSelectedAvatar={setNewAvatar}
					currentUser={token}
					setCurrentUser={setToken}
				/>
			)}

			<button
				className='btn'
				onClick={() =>
					setDisplayDeleteModal(prevDeleteModal => !prevDeleteModal)
				}
			>
				Delete Account
			</button>

			<dialog ref={ref} className='modal' aria-modal='true' role='alertdialog'>
				<h3>Are you sure you wish to delete your account?</h3>
				<button className='btn--no'>no</button>
				<button onClick={deleteUser} className='btn--yes'>
					Yes
				</button>
			</dialog>

			<div>
				<span>Go to </span>
				<Link to='/'>Chat</Link>
			</div>
		</div>
	);
}

export default Profile;
