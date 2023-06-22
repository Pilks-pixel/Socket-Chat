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
			<button className=" absolute top-0 right-0 btn-primary" onClick={handleSignOut}>Sign Out</button>
		
	);
};
