import React from "react";

function Welcome(props) {

	const { username } = props.currentUser.user;
	const [morning, afternoon, evening] = [
		"Good Morning",
		"Good afternoon",
		"Good evening",
	];
	const time = new Date().getHours();
	let greeting = time > 16 ? evening : time > 11 ? afternoon : morning;

	return (
		<div className="container-welcome">
			<h2 className='heading-big'>{`${greeting} ${username}`}</h2>
			<p>Choose someone to chat with..</p>
		</div>
	);
}

export default Welcome;
