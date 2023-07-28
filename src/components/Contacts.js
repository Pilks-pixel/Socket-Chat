import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { contactsRoute } from "../utils/apiRoutes";
import '../index.css'


function Contacts(props) {

	const [contactData, setContactData] = useState([]);
	const { username, avatarImage, isAvatarImageSet } = props.currentUser;

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		const { user, accessToken } = props.token;

		const getContacts = async () => {
			axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
			const res = await axios.get(`${contactsRoute}/${user._id}`);
			setContactData(res.data);
		};

		getContacts();
	}, [props.currentUser]);
	/* eslint-enable react-hooks/exhaustive-deps */


	let showAllContacts = contactData.map((contact, index) => {
		return (
			<button
				className={`contact-card ${props.contact._id === contact._id && "contact-card-selected"}`}
				key={index}
				onClick={() => props.showContact(contact)}
				id={contact._id}
			>
				{contact.isAvatarImageSet && (
					<img className='w-12 h-12 bg-inherit' src={contact.avatarImage} alt='avatar' />
				)}
				<span>{contact.username}</span>
			</button>
		);
	});

	return (
		<aside className='font-medium text-sm capitalize grow basis m-2 order-2'>
			<section className='bg-gray-200 p-4 mb-5 max-h-[500px] flex justify-center items-center gap-2 rounded-lg overflow-auto'>
				{isAvatarImageSet && (
					<img className=' w-16 h-16 bg-inherit' src={avatarImage} alt={`${username} avatar`} />
				)}
				<h2>{username}</h2>
			</section>
			<section className="bg-gray-200 rounded-xl p-2 flex flex-col gap-y-2.5 place-content-center">
			<h3 className="font-display text-lg m-3">Contacts</h3>
			{showAllContacts}
			</section>
		</aside>
	);
}

export default Contacts;
