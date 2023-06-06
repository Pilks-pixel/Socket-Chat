import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../App.css";
import "../register/register.css";
import { Avatar } from "../../components";

function Profile() {
	let location = useLocation();
	const [newAvatar, setNewAvatar] = useState("");
	const [displaySettings, setDisplaySettings] = useState(false);

	const settingsToggle = () =>
		setDisplaySettings(prevSettings => !prevSettings);

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

			<div>
				<span>Go to </span>
				<Link to='/'>Chat</Link>
			</div>
		</div>
	);
}

export default Profile;
