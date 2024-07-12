import { useState, useEffect, createContext } from 'react';

import './styles/main.scss';
import SiteHeader from './components/SiteHeader';
import SignIn from './components/SignIn';
import ChatRoom from './components/ChatRoom';

export const AuthContext = createContext();

function App() {
  const [userId, setUserId] = useState(undefined)
  const [userName, setUserName] = useState(undefined)
  const [currentRoomId, setCurrentRoomId] = useState(undefined)

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
    setUserName(localStorage.getItem('userName'));
    setCurrentRoomId(localStorage.getItem('currentRoomId'));
  }, [])

  return (
    <AuthContext.Provider value={{ userId, userName, currentRoomId }}>
      <div className="App">
        <SiteHeader />
        {
          currentRoomId
            ?
            <ChatRoom />
            :
            <SignIn />
        }
      </div>
    </AuthContext.Provider>
  );
}

export default App;
