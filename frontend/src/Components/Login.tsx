import { useEffect, useState } from "react";

type LoginProps = {
    onJoin: (room: string, userName: string) => void;
}

type RoomRespond = {
    rooms: string[]
}

const Login = ({ onJoin }: LoginProps) => {
    // State for dropdown and text input
    const [selectedOption, setSelectedOption] = useState("");
    const [rooms, setRooms] = useState<string[]>([]);

    useEffect(()=>{
        const getRooms = async () => {
            const respond = await fetch("http://127.0.0.1:8000/rooms")
            const roomData: RoomRespond = await respond.json();
            setRooms(roomData.rooms);
            console.log(roomData.rooms);

            if (roomData.rooms.length > 0) {
                setSelectedOption(roomData.rooms[0]);
            }
        }
        getRooms();
    },[]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const userName = formData.get("name") as string;
        let typedRoom = formData.get("room") as string;
        const room = typedRoom !== "" ? typedRoom : selectedOption;

        if (!room) {
            alert("please select a room!")
            return;
        }
        
        onJoin(room, userName);
    }

    const handleDropdownChange = (e: any) => {
        setSelectedOption(e.target.value);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm flex flex-col gap-5 animate-in fade-in zoom-in duration-300"
        >
            <div className="text-center mb-2">
                <h1 className="text-2xl font-bold text-gray-800">Join a Room</h1>
                <p className="text-gray-500 text-sm">Enter your details to start chatting</p>
            </div>

            <input
                required
                name="name"
                placeholder="Enter your name"
                autoComplete="off"
                className="border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />

            <input
                name="room"
                placeholder="Enter room name"
                autoComplete="off"
                className="border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />

            <div className="flex flex-col gap-2">
                <label className="text-sm text-black/60">
                    Or choose an existing group or room:
                </label>
                <select
                    value={selectedOption}
                    onChange={handleDropdownChange}
                    className="border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                >
                    {
                        rooms.map((room)=>(
                            <option value={room} key={room}>{room}</option>
                        ))
                    }
                </select>
            </div>


            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg active:scale-[0.98] transition-transform shadow-sm"
            >
                Enter Chat
            </button>
        </form>
    );
}

export default Login;