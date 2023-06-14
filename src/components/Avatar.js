import React from "react";
import { useEffect, useState } from "react";
import "../App.css";
import { setAvatarRoute } from "../utils/apiRoutes";
import { toastWarning, toastSucess, randomInt } from "../utils/notifications";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function Avatar({
	selectedAvatar,
	setSelectedAvatar,
	currentUser,
	setCurrentUser,
}) {
	const avatarUrl = "https://avatars.dicebear.com/api/pixel-art/";
	const [newAvatarArray, setNewAvatarArray] = useState(false);
	const [avatars, setAvatars] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	// Avatar Select & Set Logic
	const handleClick = e => {
		setSelectedAvatar(e.target.src);
	};

	const genNewAvatars = () => {
		setNewAvatarArray(prevAvatars => !prevAvatars);
		setSelectedAvatar("");
	};

	const handleSetNewAvatar = async () => {
		class noAvatarErr extends Error {}

		try {
			if (selectedAvatar === "") throw new noAvatarErr("no avatar selected");

			const { user, accessToken } = currentUser;

			axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
			const res = await axios.put(`${setAvatarRoute}/${user._id}`, {
				avatar: selectedAvatar,
			});

			if (res.data.status === true) {
				const { msg, status, user } = res.data;
				toast.success("Avatar Updated", toastSucess);
				setCurrentUser({
					...currentUser,
					msg: msg,
					status: status,
					user: user,
				});
				localStorage.setItem(
					"jwtToken",
					JSON.stringify({
						accessToken: accessToken,
						msg: msg,
						status: status,
						user: user,
					})
				);
			}
		} catch (err) {
			if (err instanceof noAvatarErr) {
				toast.warning("Please select an avatar", toastWarning);
				console.log(err.message);
			} else {
				toast.warning(err.message, toastWarning);
				console.log(err.message);
			}
		}
	};

	// Avatar generation

	useEffect(() => {
		setIsLoading(true);
		const avatarOptions = [];
		for (let i = 0; i < 4; i++) {
			let createAvatar = () => {
				let id = crypto.randomUUID();
				let seed = { keyId: id, url: `${avatarUrl}:${randomInt(20)}.svg` };
				if (!avatarOptions.includes(seed)) {
					return avatarOptions.push(seed);
				} else {
					createAvatar();
				}
			};
			createAvatar();
		}
		console.log(avatarOptions);
		setAvatars(avatarOptions);
		setIsLoading(false);
	}, [newAvatarArray]);

	const showAvatars = avatars.map(a => {
		return (
			<img
				key={a.keyId}
				className={selectedAvatar === a.url ? "selected-avatar" : "avatar"}
				src={a.url}
				alt='user avatar option'
				onClick={handleClick}
			/>
		);
	});

	return (
		<>
			<div className='settings'>
				<p>Choose an avatar</p>
				<button onClick={genNewAvatars}>More Avatars</button>

				{isLoading ? (
					<p>Loading</p>
				) : (
					<div className='container-avatars'>{showAvatars}</div>
				)}

				<button onClick={handleSetNewAvatar}>Set Avatar</button>
			</div>

			<ToastContainer />
		</>
	);
}

export default Avatar;
