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
    const [newAvatar, setNewAvatar] = useState(false)
    const [avatars, setAvatars] = useState([]);
    const [selectedAvatar, setSelectedAvatar] = useState('');
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("jwtToken")))


    function randomInt() {
       return Math.floor(Math.random() * 20) + 1;
    }

    const handleClick = e => {   
        setSelectedAvatar(e.target.src);
        console.log(selectedAvatar, e.target)
    }

    const handleNewAvatars = e => {
        setNewAvatar(prevAvatars => !prevAvatars)
        setSelectedAvatar('')
    }

    const handleSetNewAvatar = async () => {
        try {
            const {user} = currentUser
            console.log(user._id, currentUser)
            const res = await axios.put(setAvatarRoute, {
                avatar : selectedAvatar,
                id : user._id
                
                })
            
            if(res.data.status === true) {
                console.log(res.data)
            }
        } catch (error) {
            console.log(error)
        } 
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


    },[newAvatar]);

    const showAvatars = avatars.map((a, i) => {
        return <img key={i} className={selectedAvatar === a? "selected-avatar" : "avatar" } src={a} alt="user avatar option" onClick={handleClick}/>
    })

  return (
    <div className='container'>
        <h3>Avatars</h3>
        <p>Choose an avatar</p>
        <button onClick={handleNewAvatars}>More Avatars</button>
        <div className="container-avatars">
            {showAvatars}
        </div>
        <button onClick={handleSetNewAvatar}>Set Avatar</button>
    </div>
  )
}

export default SetAvatar