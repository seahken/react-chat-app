import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../App";
import { getDocs, query, collection, where } from 'firebase/firestore'

import { db } from '../base/firebase';

const ChatRoom = () => {
    const { userId, currentRoomId } = useContext(AuthContext)
    const [chats, setChats] = useState([])
    const [chatMessage, setChatMessage] = useState('')

    useEffect(() => {
        getChatMessages()
    }, [])

    const getChatMessages = async () => {
        console.log(currentRoomId)
        const q = query(collection(db, "rooms"), where("roomId", "==", currentRoomId));
        const querySnapshot = await getDocs(q);

        const roomId = querySnapshot.docs[0].id
        console.log(querySnapshot.docs[0].id)

        const qChats = query(collection(db, `/rooms/${roomId}/chats`));
        const qChatSnapshots = await getDocs(qChats)

        qChatSnapshots.forEach((doc) => {
            console.log(doc.data())
            setChats([
                ...chats,
                doc.data()
            ])
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(chatMessage)
    }

    return (
        <>
            <h1>ChatRoom</h1>
            {
                chats.map((chat, index) => {
                    return <p key={index}>{chat.text}</p>
                })
            }
            <form onSubmit={handleSubmit}>
                <input type="text" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)}/>
                <button type="submit">Send</button>
            </form>
        </>


    )
}

export default ChatRoom;