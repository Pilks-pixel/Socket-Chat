import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar } from "../../components";
import { contactRoute, deleteMessagesRoute } from "../../utils/apiRoutes";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import io from "socket.io-client";
const socket = io.connect("http://localhost:8080");
// const socket = io.connect("https://socket-chat-node.onrender.com");

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
		if (e.target.id !== "modal_btn") {
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
		<div className='text-white px-2'>
			<h2 className='font-display font-semibold text-4xl uppercase my-[10vh]'>
				Profile
			</h2>
			<div className='bg-stone-50 text-black min-h-[300px] w-[90%] max-w-2xl mx-auto my-5 md:py-3 flex flex-col justify-center items-center rounded-lg'>
				<div className='bg-gray-200 w-[90%] max-w-lg m-3 p-4 md:p-6 flex flex-col items-start gap-1 rounded-lg shadow-md'>
					{location.state.isAvatarImageSet && (
						<img
							src={newAvatar || location.state.avatarImage}
							alt='current avatar'
							className='h-24 w-24 mb-4 self-center rounded-full ring-2 ring-headings-purple'
						/>
					)}
					<p>
						{" "}
						<span className='uppercase'>name</span> : {location.state.username}
					</p>
					<p className='mb-2'>
						<span className='uppercase'>email</span> : {location.state.email}
					</p>
				</div>

				<div className='w-[90%] max-w-lg mb-3 p-4 md:p-6 flex flex-wrap justify-center items-center gap-4'>
					<button
						className=' btn-primary border-solid border-2 hover:border-headings-purple focus:border-headings-purple transition-all'
						onClick={settingsToggle}
					>
						Change Avatar
					</button>
					<button
						id='modal_btn'
						className='btn-primary border-solid border-2 hover:border-headings-purple focus:border-headings-purple transition-all'
						onClick={() => {
							setDisplayDeleteModal(prevDeleteModal => !prevDeleteModal);
						}}
					>
						Delete Account
					</button>
				</div>
			</div>

			{displaySettings && (
				<Avatar
					selectedAvatar={newAvatar}
					setSelectedAvatar={setNewAvatar}
					currentUser={token}
					setCurrentUser={setToken}
					setShowAvatars={setDisplaySettings}
				/>
			)}

			<dialog ref={ref} className=' text-lg p-3 shadow-xl border-solid border-4 border-headings-purple rounded-md ' aria-modal='true' role='alertdialog'>
				<h3 className='mb-3' >Are you sure you wish to delete your account ?</h3>
				<button className='btn-primary mx-3 rounded-md border-solid border-2 hover:border-green-500 focus:border-green-500'>no</button>
				<button className='btn-primary mx-3 rounded-md border-solid border-2 hover:border-red-500 focus:border-red-500' onClick={deleteUser}>
					Yes
				</button>
			</dialog>

			<button className='btn-secondary'>
				<Link to='/'>Go to Chat</Link>
			</button>

			<ToastContainer />
		</div>
	);
}

export default Profile;
