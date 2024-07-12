import { createContext, useContext } from "react";
import { AuthContext } from "../App";

const SiteHeader = () => {
    const { userId, userName, currentRoomId } = useContext(AuthContext)

    return (
        <>
            {currentRoomId
                ?
                <header className="site-header">
                    <button>Leave Room</button>
                    <p>Room Id: {currentRoomId}</p>
                </header>
                :
                <header>
                    <button>Create Room</button>
                </header>
            }
        </>


    )
}

export default SiteHeader;