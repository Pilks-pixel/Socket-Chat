import axios from 'axios'
import React from 'react'
import {useEffect, useState} from 'react'
import { contactsRoute } from '../utils/apiRoutes'

function Contacts() {

    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('jwtToken')))

    useEffect(() => {
        const getContacts = async () => {

            const {user, accessToken} = currentUser
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
            const res = await axios.get(`${contactsRoute}/${user._id}`)
            console.log(res)
            console.log(res.data)
        }
        getContacts();
    },[])


  return (

    <div>
        <h3>Contacts</h3>



    </div>
  )

}

export default Contacts
