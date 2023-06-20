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
		<div className="flex flex-col justify-center flex-auto p-5 m-2 overflow-auto bg-gray-200 rounded-xl">
			<h2 className='font-display text-clamp font-semibold text-headings-purple m-4'>{`${greeting} ${username}`}</h2>
			<p className="text-base font-normal">Choose someone to chat with..</p>
		</div>
	);
}

export default Welcome;
