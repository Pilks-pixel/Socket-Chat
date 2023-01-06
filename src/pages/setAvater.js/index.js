import React from 'react'
import {useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
import '../../App.css';
import '../register/register.css';
import { setAvatarRoute } from '../../utils/apiRoutes';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function SetAvatar() {
    const avatarUrl = "https://avatars.dicebear.com/api/pixel-art/";
    const [newAvatar, setNewAvatar] = useState(false);
    const [avatars, setAvatars] = useState([]);
    const [selectedAvatar, setSelectedAvatar] = useState('');
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("jwtToken")));
    const [isLoading, setIsLoading] = useState(false);


    function randomInt() {
       return Math.floor(Math.random() * 20) + 1;
    }

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
        }

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
        }    


    // Click Event functions

    const handleClick = e => {   
        setSelectedAvatar(e.target.src);
        // console.log(selectedAvatar, e.target)
    }

    const handleNewAvatars = () => {
        setNewAvatar(prevAvatars => !prevAvatars)
        setSelectedAvatar('')
    }

    const handleSetNewAvatar = async () => {
        class noAvatarErr extends Error {}
        try {
            if (selectedAvatar === '') throw new noAvatarErr('no avatar selected') 
            const {user, accessToken} = currentUser;
            // console.log(user._id, currentUser)
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            const res = await axios.put(`${setAvatarRoute}/${user._id}`, {
                avatar : selectedAvatar
                });
            
            if(res.data.status === true) {
                // console.log(res.data)
                const {msg, status, user} = res.data;
                toast.success('Avatar Updated', toastSucess);
                setCurrentUser({...currentUser, msg : msg , status: status, user: user});
                localStorage.setItem(
                    'jwtToken',
                     JSON.stringify({accessToken: accessToken, msg : msg , status: status, user: user})
                     )

            }
        } catch (err) {
            if (err instanceof noAvatarErr) {
                toast.warning('Please select an avatar', toastWarning);
                console.log(err.message);

            } else {
                toast.warning(err.message, toastWarning);
                console.log(err.message);
            }
        } 
    };

    // Avatar generation

    useEffect(() => {
        setIsLoading(true);
        const avatarOptions = [];
        for(let i = 0; i < 4; i++) {

            let createAvatar = () => { 
                let seed = `${avatarUrl}:${randomInt()}.svg`
                if (!avatarOptions.includes(seed) ) {
                    return avatarOptions.push(seed);
                } else {
                    createAvatar();
                }

            }
            createAvatar();
        }

        // console.log(avatarOptions)
        setAvatars(avatarOptions);
        setIsLoading(false);

    },[newAvatar]);

    const showAvatars = avatars.map((a, i) => {
        return <img 
        key={i} 
        className={selectedAvatar === a? "selected-avatar" : "avatar" } 
        src={a} alt="user avatar option" 
        onClick={handleClick}
        />
    })

  return (
    <div className='container'>
        <h3>Avatars</h3>
        <p>Choose an avatar</p>
        <button onClick={handleNewAvatars}>More Avatars</button>

        {isLoading? <p>Loading</p>:
        <div className="container-avatars">
            {showAvatars}
        </div> 
        }
        
        <button onClick={handleSetNewAvatar}>Set Avatar</button>

        <div>
        <span>Go to </span>
        <Link to='/'>Chat</Link>
        </div>

        <ToastContainer />
    </div>


  )
}

export default SetAvatar