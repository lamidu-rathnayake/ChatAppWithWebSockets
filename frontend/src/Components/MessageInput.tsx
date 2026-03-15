type Message = {
    sender: string;
    msg: string;
}

type MessageInputProps = {
    chatHandler: (message: Message) => void;
    userName: string;
}

const MessageInput = ({ chatHandler, userName }: MessageInputProps) => {
    
    function submitMessage(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const messsage = formData.get("Message") as string;
        
        if (!messsage.trim()) return; // Prevents sending empty messages

        const message: Message = { sender: userName, msg: messsage };
        chatHandler(message);
        event.currentTarget.reset();
    }

    return (
        <form onSubmit={submitMessage} className="bg-white p-3 border-t border-gray-200 flex gap-2 items-center">
            <input 
                required
                name="Message" 
                placeholder="Type a message..." 
                autoComplete="off"
                className="flex-1 bg-gray-100 border-transparent focus:bg-white border rounded-full px-4 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm text-gray-700" 
            />
            <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium active:scale-95 transition-transform duration-200 shadow-sm"
            >
                Send
            </button>
        </form>
    )
}

export default MessageInput;