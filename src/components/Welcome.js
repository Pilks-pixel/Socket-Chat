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
		<div className="chat-feed order-2 bg-gray-200">
			<h2 className='font-display text-clamp font-semibold text-headings-purple m-4'>{`${greeting} ${username}`}</h2>
			<p className="text-base font-normal mb-4">Choose someone to chat with..</p>
		</div>
	);
}

export default Welcome;
