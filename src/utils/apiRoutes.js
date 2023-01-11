const host = 'http://localhost:5000';
// const host = 'https://socket-chat-node.onrender.com';

// Auth Routes
const registerRoute = `${host}/api/auth/register`;
const loginRoute = `${host}/api/auth/login`;
const setAvatarRoute = `${host}/api/auth/avatar`;
const contactsRoute = `${host}/api/auth/contacts`;
const userRoute = `${host}/api/auth`;

// Message Routes
const messageRoute = `${host}/api/messages/addmsg`;
const allMessagesRoute = `${host}/api/messages/getmsg`;

export {registerRoute, loginRoute, setAvatarRoute, contactsRoute, userRoute, messageRoute, allMessagesRoute}