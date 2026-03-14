import { useEffect, useState } from "react";
import MessageInput from "./MessageInput";

type ChatWindowProps = {
    room: string,
    userName: string;
};

type Message = {
    text: string;
    sender: string;
}

const ChatWindow = (props: ChatWindowProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [socket, setSocket] = useState<any>(null);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080/");
        setSocket(ws);
        
        ws.onmessage = (event) => {
            console.log("Message form server", event.data);
        }
    },[]);

    const sendMessege = () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send("Hello Server");
        }
    }




    function chatHandler(message : Message) {
        setMessages(prev => [...prev, message])
        console.log("Sending message was added");
    }

    return <>
        <div className="w-96 h-96 border flex flex-col m-auto">
            {messages.map((message, index) => (
                <p key={index}>{message.sender}: {message.text}</p>
            ))}
        </div>
        <MessageInput chatHandler={chatHandler} userName={props.userName}/>
        <button onClick={sendMessege}>click</button>
    </> 
        
}

export default ChatWindow;
