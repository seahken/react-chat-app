import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../App";

const ChatBox = ({ displayName, messages, chatUserId }) => {
    const { userId } = useContext(AuthContext)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setIsVisible(true)
        }, 300)
    }, [])

    return (
        <li className={
            `chat-box 
            ${userId === chatUserId ? 'chat-box--self' : ''}
            ${isVisible ? 'chat-box--visible' : ''}
            `}>
            <p className="chat-box__name">{displayName}</p>
            <div className="chat-box__messages">
                {messages.map((message, index) => <p key={index}>{message}</p>)}
            </div>
        </li>
    )
}

export default ChatBox