import axios from 'axios'
import React from 'react'
import {useEffect, useState} from 'react'
import { contactsRoute } from '../utils/apiRoutes'

function Contacts(props) {

    const [contactData, setContactData] = useState([]);
    const {username, avatarImage, isAvatarImageSet} = props.currentUser.user;

    useEffect(() => {
        const getContacts = async () => {

            const {user, accessToken} = props.currentUser
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
            const res = await axios.get(`${contactsRoute}/${user._id}`)
            // console.log(res.data)
            setContactData(res.data)

        }
        getContacts();
    },[props.currentUser])

    
    let showAllContacts = contactData.map((contact, index) => {
    return <div 
    className={props.contact._id === contact._id? 'container-contact-item-selected' : 'container-contact-item'} 
    key={index} 
    onClick={() => props.showContact(contact)} 
    id={contact._id}
    >
            {contact.isAvatarImageSet && <img className='avatar' src={contact.avatarImage} alt='avatar'/>}
            <span>{contact.username}</span>
        </div>

})

  return (

    <div className='container-contacts'>
        <div className='container-contact-current-user'>
            {isAvatarImageSet && <img className='avatar' src={avatarImage} alt='avatar'/>}
            <h4>{username}</h4>
        </div>
        <h3>Contacts</h3>
        {showAllContacts}


    </div>
  )

}

export default Contacts
