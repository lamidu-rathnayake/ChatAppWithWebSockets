type LoginProps = {
    onJoin: (room: string, userName: string) => void;
}

const Login = ({onJoin}: LoginProps) => {

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const room = formData.get("room") as string;
        const userName = formData.get("name") as string;

        onJoin(room, userName);

        e.currentTarget.reset();
    }

    return <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 w-80 m-auto mt-20"
    >
        <input
            name="name"
            placeholder="Enter your name"
            className="border p-2"
        />

        <input
            name="room"
            placeholder="Enter room name"
            className="border p-2"
        />

        <button
            type="submit"
            className="bg-gray-600 text-white p-2 active:scale-90 transition"
        >
            Join Chat
        </button>
    </form>
}

export default Login; 