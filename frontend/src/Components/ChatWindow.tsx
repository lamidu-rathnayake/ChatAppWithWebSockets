import { useEffect, useState, useRef} from "react";
import MessageInput from "./MessageInput";

type ChatWindowProps = {
    room: string,
    userName: string;
};

type Message = {
    sender: string;
    msg: string;
}

const ChatWindow = (props: ChatWindowProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [validConnection, setValidConnection] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        let ws: WebSocket;

        const connectTimer = setTimeout(() => {
            ws = new WebSocket(`ws://127.0.0.1:8000/ws/${props.room}/${props.userName}`);

            ws.onopen = (event: Event) => {
                setValidConnection(true)
            }

            ws.onmessage = (event: MessageEvent) => {
                const data: Message = JSON.parse(event.data);
                setMessages(prev => [...prev, data]);
            }
            
            ws.onclose = (event: CloseEvent) => {
                if (event.code === 4001) {
                    alert("The name is already taken! try another!");
                    window.location.reload();
                }
                if (event.code === 4002) {
                    alert("Something wrong!");
                    window.location.reload();
                }
            }

            socketRef.current = ws;

        },0);
        
        return () => {
            clearTimeout(connectTimer);
            if (ws) {
                ws.close(); 
            }
        };
    },[props.room, props.userName]);

    const sendMessege = (message: Message) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(message.msg); // because Message object (msg) holds both sender and msg
        }
    }

    function chatHandler(message : Message) {
        sendMessege(message)
        setMessages(prev => [...prev, message]);
    }

    return <>
        {validConnection ? (<div>
            <h2 className="text-2xl font-bold text-center">Chat Box</h2>
            <div className="w-96 h-96 border flex flex-col m-auto">
                {messages.map((message, index) => (
                    <p key={index}>{message.sender}: {message.msg}</p>
                ))}
            </div>
            <MessageInput chatHandler={chatHandler} userName={props.userName}/>
        </div>):(<div></div>)}
    </> 
        
}

export default ChatWindow;
