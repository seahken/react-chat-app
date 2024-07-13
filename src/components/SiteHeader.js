import { useContext } from "react";
import { useContext } from "react";
import { AuthContext } from "../App";

const SiteHeader = () => {
    const { currentRoomId, setCurrentRoomId } = useContext(AuthContext)

    const leaveRoom = () => {
        localStorage.removeItem('currentRoomId')
        setCurrentRoomId(null)
    }

    return (
        <>
            {currentRoomId
                ?
                <header className="site-header">
                    <button onClick={() => leaveRoom()}>Leave Room</button>
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