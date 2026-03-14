import { useEffect, useState } from 'react'
import './App.css'
import ChatWindow from './Components/ChatWindow'
import Header from './Components/Header'
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
		<div className='relative m-auto'>
			{firstLoad ? (
				<Login onJoin={onJoin} />
			) : (
				<>
					<Header />
					<ChatWindow room={userRoom} userName={userName} />
				</>
			)}
		</div>
	);
}

export default App
