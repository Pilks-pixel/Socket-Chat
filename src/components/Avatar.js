import React from "react";
import { useEffect, useState } from "react";
import { setAvatarRoute } from "../utils/apiRoutes";
import { toastWarning, toastSucess, randomInt } from "../utils/notifications";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function Avatar({
	selectedAvatar,
	setSelectedAvatar,
	currentUser,
	setCurrentUser,
	setShowAvatars,
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
				setShowAvatars(prevShowAvatar => !prevShowAvatar);
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
				let seed = `${avatarUrl}:${randomInt(20)}.svg`;
				if (!avatarOptions.includes(seed)) {
					return avatarOptions.push(seed);
				} else {
					createAvatar();
				}
			};
			createAvatar();
		}
		setAvatars(avatarOptions);
		setIsLoading(false);
	}, [newAvatarArray]);

	const showAvatars = avatars.map((a, i) => {
		return (
			<button
				key={i}
				className={`${
					selectedAvatar === a ? " bg-teal-200 border-solid border-2 border-headings-purple rounded" : "avatar"
				} w-4/12 h-4/12 max-w-[100px] max-h-[100px]`}
				aria-label='avatar option'
			>
				<img src={a} alt='user avatar option' onClick={handleClick} />
			</button>
		);
	});

	return (
		<>
			<div className='relative w-[90%] mx-auto mb-10'>
				{isLoading ? (
					<p>Loading</p>
				) : (
					<div className='bg-slate-50 text-black absolute inset-x-0 h-max max-w-2xl p-2 mx-auto mb-6 rounded-md shadow-lg'>
						<div className=' flex flex-wrap gap-2 place-content-center z-1 mb-4 '>
							{showAvatars}
						</div>
						<div className='flex flex-wrap gap-2 justify-center items-center mb-4'>
							<button
								className='btn-primary py-2 border-solid border-2 place-self-center hover:border-headings-purple focus:border-headings-purple transition-all'
								onClick={genNewAvatars}
							>
								More Avatars
							</button>
							<button
								className='btn-primary py-2 border-solid border-2 place-self-center hover:border-headings-purple focus:border-headings-purple transition-all'
								onClick={handleSetNewAvatar}
							>
								Set Avatar
							</button>
						</div>
					</div>
				)}
			</div>
		</>
	);
}

export default Avatar;
