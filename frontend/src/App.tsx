import { useState } from 'react'
import './App.css'
import ChatWindow from './Components/ChatWindow'
import Login from './Components/Login'

function App() {
    const [userRoom, setUserRoom] = useState("");
    const [userName, setUserName] = useState("");
    const [firstLoad, setFirstLoad] = useState(true);

    function onJoin(room: string, name: string) {
        setUserRoom(room);
        setUserName(name);
        setFirstLoad(false);
    }

    return (
        // The outer div now takes the full screen height and centers everything
        <div className='min-h-screen bg-gray-100 text-gray-800 flex items-center justify-center p-4 font-sans'>
            {firstLoad ? (
                <Login onJoin={onJoin} />
            ) : (
                <ChatWindow room={userRoom} userName={userName} />
            )}
        </div>
    );
}

export default App;