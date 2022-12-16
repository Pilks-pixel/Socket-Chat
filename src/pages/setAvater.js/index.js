import React from 'react'
import {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import '../register/register.css';
import { setAvatarRoute } from '../../utils/apiRoutes';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function SetAvatar() {
    const avatarUrlFemale = "https://avatars.dicebear.com/api/pixel-art/female/";
    const avatarUrlMale = "https://avatars.dicebear.com/api/pixel-art/male/:1.svg";
    const [avatars, setAvatars] = useState([]);
    const [selectedAvatar, setSelectedAvatar] = useState('');


    function randomInt() {
       return Math.floor(Math.random() * 20) + 1;
    }

    const handleClick = e => {   
        setSelectedAvatar(e.target);
        console.log(selectedAvatar.src, e.target)
    }

    useEffect(() => {
        const avatarOptions = [];
        for(let i = 0; i < 4; i++) {

            let createAvatar = () => { 
            let seed = `${avatarUrlFemale}:${randomInt()}.svg`
                if (!avatarOptions.includes(seed) ) {
                    return avatarOptions.push(seed)
                } else {
                    createAvatar();
                }

            }
            createAvatar();
        }

        console.log(avatarOptions)
         setAvatars(avatarOptions)


    },[]);

    const showAvatars = avatars.map((a, i) => {
        return <img key={i} className={selectedAvatar.src === a? "selected-avatar" : "avatar" } src={a} alt="user avatar option" onClick={handleClick}/>
    })

  return (
    <div className='container'>
        <h3>Avatars</h3>
        <p>Choose an avatar</p>
        <div className="container-avatars">
            {showAvatars}
        </div>
        <button>Set Avatar</button>
    </div>
  )
}

export default SetAvatar