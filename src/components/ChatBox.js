const ChatBox = ({ displayName, messages }) => {
    return (
        <article>
            <header>
                <p>{displayName}</p>
            </header>
            {messages.map((message, index) => <p key={index}>{message}</p>)}
        </article>
    )
}

export default ChatBox