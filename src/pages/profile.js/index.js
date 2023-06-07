import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../App.css";
import "../register/register.css";
import { Avatar } from "../../components";
import axios from "axios";

function Profile() {
	let location = useLocation();
	const [newAvatar, setNewAvatar] = useState("");
	const [displaySettings, setDisplaySettings] = useState(false);
	const [displayDeleteModal, setDisplayDeleteModal] = useState(false);
	const ref = useRef();

	const settingsToggle = () =>
		setDisplaySettings(prevSettings => !prevSettings);

	const deleteUser = () => {
		console.log("User delete");
		// axios.
	};

	// Modal Logic
	const closeModal = e => {
		if (e.target.className !== "btn--yes" && e.target.className !== "btn") {
			dialog.close();
			setDisplayDeleteModal(prevDeleteModal => !prevDeleteModal);
		}
	};

	const dialog = ref.current;
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
				<Avatar selectedAvatar={newAvatar} setSelectedAvatar={setNewAvatar} />
			)}

			<button
				className='btn'
				onClick={() =>
					setDisplayDeleteModal(prevDeleteModal => !prevDeleteModal)
				}
			>
				Delete Account
			</button>

			<dialog ref={ref} className='modal' aria-modal='true' role="alertdialog">
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
