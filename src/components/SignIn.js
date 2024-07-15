import { useState, useContext, useEffect } from "react";
import { addDoc, collection, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { AuthContext } from "../App";
import { v4 } from "uuid";

import { db } from '../base/firebase';

const SignIn = () => {
    const { userId, setCurrentRoomId, setUserId, setUserName } = useContext(AuthContext)
    const [ isLoading, setIsLoading ] = useState(false)
    const [formData, setFormData] = useState({
        userName: '',
        roomId: ''
    })

    useEffect(() => {
        setFormData({
            ...formData,
            userName: localStorage.getItem('userName')
        });
    }, [])

    const actionType = () => {
        return formData.roomId === '' ? 'Create' : 'Enter'
    }

    const buttonDisplayText = () => {
        if (isLoading) return formData.roomId === '' ? 'Creating Room...' : 'Entering Room...'
        return formData.roomId === '' ? 'Create Room' : 'Enter Room'
    }

    const getRoomId = () => {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        const idLength = 4;

        let roomId = ''

        for (let i = 0; i < idLength; i++) {
            roomId += alphabet[Math.floor(Math.random() * alphabet.length)];
        }

        return roomId
    }

    const wait = (ms) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, ms)
        })
    }

    const createRoom = async () => {
        let newRoomId = getRoomId()

        await addDoc(collection(db, "rooms"), {
            roomId: newRoomId,
            createdAt: serverTimestamp()
        })

        const newUserId = userId || v4()

        setLocalStorage({
            userId: newUserId,
            userName: formData.userName,
            roomId: newRoomId
        })

        setUserId(newUserId)
        setUserName(formData.userName)

        setCurrentRoomId(newRoomId)
    }

    const enterRoom = async () => {
        const roomId = formData.roomId.toLocaleUpperCase()
        const q = query(collection(db, "rooms"), where("roomId", "==", roomId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs.length > 0) {
            console.log(`enter room ${roomId}`)
        } else {
            alert('no such room exists!')
            return
        }

        const newUserId = userId || v4()

        setLocalStorage({
            userId: newUserId,
            userName: formData.userName,
            roomId: roomId
        })

        setUserId(newUserId)
        setUserName(formData.userName)

        setCurrentRoomId(roomId)
    }

    const setLocalStorage = ({ userId, userName, roomId }) => {
        localStorage.setItem('currentRoomId', roomId)
        localStorage.setItem('userName', userName)
        localStorage.setItem('userId', userId)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        await wait(500)
        if (formData.userName === '') {
            alert('Username cannot be empty')
            return
        }

        if (actionType() === 'Create') {
            await createRoom()
        } else {
            await enterRoom()
        }
        
        setIsLoading(false)
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log('formData', formData)
        console.log(e.target.userName)
        if (name === 'userName' & value !== formData.name) {
            console.log(e.target.userName)
            setUserId('')
        }
        setFormData((prevState) => ({ ...prevState, [name]: value }))

    }

    return (
        <div className="sign-in">
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <div className="sign-in__form">
                    <div className="sign-in__form-group">
                        <input id="userName" name="userName" type="text" placeholder="ENTER NAME" value={formData.userName} onChange={handleChange} />
                    </div>

                    <div className="sign-in__form-group">
                        <input id="roomId" name="roomId" type="text" placeholder="Room ID" value={formData.roomId} onChange={handleChange} />
                    </div>
                    <button type="submit">{buttonDisplayText()}</button>
                </div>
                
            </form>
        </div>
    )
}

export default SignIn;