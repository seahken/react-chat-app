import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../App";
import { getDocs, query, collection, where, addDoc, serverTimestamp, onSnapshot, QuerySnapshot } from 'firebase/firestore'

import { db } from '../base/firebase';
import ChatBox from "./ChatBox";

const ChatRoom = () => {
    const { userId, currentRoomId, userName } = useContext(AuthContext)
    const [chats, setChats] = useState([])
    const [chatMessage, setChatMessage] = useState('')
    const [roomId, setRoomId] = useState('')

    useEffect(() => {

        const getChats = async () => {
            console.log(currentRoomId)
            const q = query(collection(db, "rooms"), where("roomId", "==", currentRoomId));
            const querySnapshot = await getDocs(q);

            const roomId = querySnapshot.docs[0].id
            setRoomId(roomId)

            const qChats = query(collection(db, `/rooms/${roomId}/chats`));

            const unsubscribe = onSnapshot(qChats, (QuerySnapshot) => {
                const chatArray = []
                QuerySnapshot.forEach((doc) => {
                    chatArray.push({ ...doc.data(), id: doc.id })
                })

                const sortedMessages = chatArray.sort((a, b) => a.createdAt - b.createdAt)
                setChats(namesModifier(renderedMessages(sortedMessages)))
            })
            return () => unsubscribe
        }

        getChats()

    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(chatMessage)
        if (chatMessage.trim() === '') {
            alert('Message cannot be empty')
            return
        }

        await addDoc(collection(db, `/rooms/${roomId}/chats`), {
            text: chatMessage,
            name: userName,
            userId: userId,
            createdAt: serverTimestamp(),
        })

        setChatMessage('')
    }

    const renderedMessages = (messages) => {
        // function to merge messages
        const messageArray = []
        for (let i = 0; i < messages.length; i++) {
            if (i === 0) {
                messageArray.push({
                    ...messages[i],
                    messages: [messages[i].text]
                })
            } else if (messages[i].userId === messages[i-1].userId) {
                messageArray[messageArray.length - 1].messages.push(messages[i].text)
            } else {
                messageArray.push({
                    ...messages[i],
                    messages: [messages[i].text]
                })
            }
        }
        return messageArray
    }

    const namesModifier = (messages) => {
        const existingNames = []
        return messages.map((message) => {
            existingNames.push(message.name)
            if (existingNames.indexOf(message.name) === -1) {
                return {
                    ...message,
                    name: `${message.name} (1)`
                }
            }
            const occurrence = existingNames.filter((v) => (v === message.name)).length
            return {
                ...message,
                name: `${message.name} (${occurrence})`
            }
        })        
    }

    return (
        <>
            <h1>ChatRoom</h1>
            {
                chats.map((chat, index) => {
                    return <ChatBox key={chat.id} displayName={chat.name} messages={chat.messages} />
                })
            }
            <form onSubmit={handleSubmit}>
                <input type="text" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} />
                <button type="submit">Send</button>
            </form>
        </>


    )
}

export default ChatRoom;