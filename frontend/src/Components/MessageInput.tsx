type Message = {
    sender: string;
    msg: string;
}

type MessageInputProps = {
    chatHandler: (message: Message) => void;
    userName: string;
}

const MessageInput = ({ chatHandler, userName }: MessageInputProps) => {
    function submitMessage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const query = formData.get("Message") as string;
        const message: Message = { sender: userName, msg: query};
        chatHandler(message);
        e.currentTarget.reset();
    }

    return <form onSubmit={submitMessage} className="flex flex-nowrap gap-2 w-96 mt-4 m-auto">
        <input name="Message" className="border border- basis-3/4" />
        <button type="submit" className="basis-1/4 scale-100 transition delay-150 duration-300 ease-in-out active:scale-80 bg-gray-500">Send</button>
    </form>
}

export default MessageInput; 