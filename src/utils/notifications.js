import { Zoom } from "react-toastify";

// Toast notification settings
const toastWarning = {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Zoom,
};

const toastSucess = {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Zoom,
};

const swearWords = ["shit", "fuck", "prick", "nob", "cunt"];

function randomInt(max) {
    return Math.floor(Math.random() * max);
}

export { toastWarning, toastSucess, swearWords, randomInt }