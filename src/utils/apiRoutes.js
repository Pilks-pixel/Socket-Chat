const host = "http://localhost:8080";
// const host = 'https://socket-chat-node.onrender.com';

// Auth Routes
const registerRoute = `${host}/api/auth/register`;
const loginRoute = `${host}/api/auth/login`;
const contactRoute = `${host}/api/auth/contact`;
const contactsRoute = `${host}/api/auth/contacts`;
const setAvatarRoute = `${host}/api/auth/avatar`;
const userRoute = `${host}/api/auth`;

// Message Routes
const messageRoute = `${host}/api/message/create`;
const allMessagesRoute = `${host}/api/messages`;
const deleteMessagesRoute = `${host}/api/message`;

export {
	registerRoute,
	loginRoute,
	setAvatarRoute,
	contactsRoute,
	userRoute,
	messageRoute,
	allMessagesRoute,
	contactRoute,
    deleteMessagesRoute
};
