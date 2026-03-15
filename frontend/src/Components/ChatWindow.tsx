import { useEffect, useState, useRef } from "react";
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
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        let ws: WebSocket;

        const connectTimer = setTimeout(() => {
            ws = new WebSocket(`ws://127.0.0.1:8000/ws/${props.room}/${props.userName}`);

            ws.onopen = () => {
                setValidConnection(true)
            }

            ws.onmessage = (event: MessageEvent) => {
                const data: Message = JSON.parse(event.data);
                setMessages(prev => [...prev, data]);
            }

            ws.onclose = (event: CloseEvent) => {
                if (event.code === 4001) {
                    alert("The name is already taken! Try another!");
                    window.location.reload();
                }
                if (event.code === 4002) {
                    alert("Something went wrong!");
                    window.location.reload();
                }
            }

            socketRef.current = ws;

        }, 0);

        return () => {
            clearTimeout(connectTimer);
            if (ws) ws.close();
        };
    }, [props.room, props.userName]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    },[messages]);

    const sendMessege = (message: Message) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(message.msg);
        }
    }

    function chatHandler(message: Message) {
        sendMessege(message);
        setMessages(prev => [...prev, message]);
    }

    return (
        <>
            {!validConnection ? (
                <div className="flex flex-col items-center gap-3 animate-pulse">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Connecting to {props.room}...</p>
                </div>
            ) : (
                <div className="bg-gray-50 w-full max-w-md h-[24rem] sm:h-[32rem] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        
                    <div className="bg-blue-600 p-4 shadow-md z-10 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold text-white leading-tight">{props.room}</h2>
                            <p className="text-blue-100 text-xs">Logged in as {props.userName}</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                        {messages.map((message, index) => {
                            const isMe = message.sender === props.userName;
                            return (
                                <div key={index} className={`flex flex-col max-w-[80%] ${isMe ? "self-end items-end" : "self-start items-start"}`}>
                                    <span className="text-xs text-gray-400 mb-1 px-1">{message.sender}</span>
                                    <div className={`px-4 py-2 text-sm shadow-sm ${
                                        isMe 
                                        ? "bg-blue-500 text-white rounded-2xl rounded-tr-sm" 
                                        : "bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm"
                                    }`}>
                                        {message.msg}
                                    </div>
                                </div>
                            );
                        })}

                        {/* now i can let browser to smoothly scroll down to the bottom to reach this div when we add a new message to the messages useState */}
                        <div ref={messagesEndRef} /> 
                    </div>

                    <MessageInput chatHandler={chatHandler} userName={props.userName} />
                </div>
            )}
        </>
    )
}

export default ChatWindow;