import React from "react";
import { useNavigate } from "react-router-dom";

export const SignOut = props => {
	const goTo = useNavigate();

	function handleSignOut() {
		localStorage.removeItem("jwtToken");
		props.socket.emit("remove_user", props.currentUser.user._id);
		goTo("/login");
	}

	return (
		<div>
			<button className="py-2 px-4 rounded-full shadow bg-gray-50 hover:bg-gray-200 transition-colors" onClick={handleSignOut}>Sign Out</button>
		</div>
	);
};
