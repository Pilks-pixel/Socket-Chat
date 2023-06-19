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
			<div
				className={
					`${props.contact._id === contact._id
						? "contact-card-selected"
						: "contact-card"
					}
					`
				}
				key={index}
				onClick={() => props.showContact(contact)}
				id={contact._id}
			>
				{contact.isAvatarImageSet && (
					<img className='avatar' src={contact.avatarImage} alt='avatar' />
				)}
				<span>{contact.username}</span>
			</div>
		);
	});

	return (
		<div className='flex-auto font-medium text-sm capitalize m-2'>
			<div className='bg-gray-200 rounded-lg mb-5'>
				{isAvatarImageSet && (
					<img className='avatar' src={avatarImage} alt='avatar' />
				)}
				<h4>{username}</h4>
			</div>
			<div className="flex flex-col gap-y-2.5 place-content-center bg-gray-200 rounded-xl p-2">
			<h3 className="font-display text-lg m-3">Contacts</h3>
			{showAllContacts}
			</div>
		</div>
	);
}

export default Contacts;
