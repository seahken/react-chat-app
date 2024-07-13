import { useState, useContext, useEffect } from "react";
import { addDoc, collection, getDocs, doc, getDoc, query, where, serverTimestamp } from "firebase/firestore";
import { AuthContext } from "../App";
import { v4 } from "uuid";

import { db } from '../base/firebase';

const SignIn = () => {
    const { userId, setCurrentRoomId } = useContext(AuthContext)
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

    const isRoomExists = async (roomId) => {
        const q = query(collection(db, "rooms"), where("roomId", "==", roomId));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.length > 0
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

    const createRoom = async () => {
        let newRoomId = getRoomId()

        await addDoc(collection(db, "rooms"), {
            roomId: newRoomId,
            createdAt: serverTimestamp()
        })

        setLocalStorage({
            userId: userId || v4(),
            userName: formData.userName,
            roomId: newRoomId
        })

        setCurrentRoomId(newRoomId)
    }

    const enterRoom = async () => {
        const roomId = formData.roomId.toLocaleUpperCase()
        const q = query(collection(db, "rooms"), where("roomId", "==", roomId));
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot)

        if (querySnapshot.docs.length > 0) {
            console.log(`enter room ${roomId}`)
        } else {
            alert('no such room exists!')
        }

        setLocalStorage({
            userId: userId || v4(),
            userName: formData.userName,
            roomId: roomId
        })

        setCurrentRoomId(roomId)
    }

    const setLocalStorage = ({ userId, userName, roomId }) => {
        localStorage.setItem('currentRoomId', roomId)
        localStorage.setItem('userName', userName)
        localStorage.setItem('userId', userId)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (formData.userName === '') {
            alert('Username cannot be empty')
            return
        }

        if (actionType() === 'Create') {
            await createRoom()
        } else {
            await enterRoom()
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }))
    }

    return (
        <article>
            <h1>Sigin</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="userName">Name</label>
                <input id="userName" name="userName" type="text" placeholder="Enter Name" value={formData.userName} onChange={handleChange} />

                <label htmlFor="roomId">Room ID</label>
                <input id="roomId" name="roomId" type="text" value={formData.roomId} onChange={handleChange} />

                <button type="submit">{actionType()} Room</button>

            </form>
        </article>
    )
}

export default SignIn;