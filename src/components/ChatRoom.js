import { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../App";
import { getDocs, query, collection, where, addDoc, serverTimestamp, onSnapshot, orderBy } from 'firebase/firestore'

import { db } from '../base/firebase';
import ChatBox from "./ChatBox";

const ChatRoom = () => {
    const { userId, currentRoomId, userName } = useContext(AuthContext)
    const [chats, setChats] = useState([])
    const [chatMessage, setChatMessage] = useState('')
    const [roomId, setRoomId] = useState('')
    const scroll = useRef();

    useEffect(() => {

        const getChats = async () => {
            console.log(currentRoomId)
            const q = query(collection(db, "rooms"), where("roomId", "==", currentRoomId));
            const querySnapshot = await getDocs(q);

            const roomId = querySnapshot.docs[0].id
            setRoomId(roomId)

            const qChats = query(
                collection(db, `/rooms/${roomId}/chats`),
                orderBy("createdAt", "asc")
            );

            const unsubscribe = onSnapshot(qChats, (QuerySnapshot) => {
                const chatArray = []
                QuerySnapshot.forEach((doc) => {
                    chatArray.push({ ...doc.data(), id: doc.id })
                })

                const renderedChats = namesModifier(renderedMessages(chatArray))
                setTimeout(() => {

                    setChats(renderedChats)
                },500)

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
        scroll.current.scrollIntoView({ behavior: "smooth" });
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
            } else if (messages[i].userId === messages[i - 1].userId) {
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
        <div className="chat-room">
            <div>
                <ul className="chat-room__chats">
                    {
                        chats.map((chat, index) => {
                            return <ChatBox key={chat.id} displayName={chat.name} messages={chat.messages} chatUserId={chat.userId} />
                        })
                    }
                </ul>
            </div>


            <form onSubmit={handleSubmit}>
                <span ref={scroll}></span>
                <div className="chat-room__input-group">
                    <input type="text" className="chat-room__input" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} />
                    <button type="submit" className="chat-room__button">Send</button>
                </div>
            </form>
        </div>


    )
}

export default ChatRoom;