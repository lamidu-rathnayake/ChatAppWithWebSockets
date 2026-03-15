from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from collections import defaultdict
import os


class SocketManager:
    def __init__(self):
        self.rooms = defaultdict(list)
        self.clientNames = defaultdict(str)

        if not os.path.exists('room_history'):
            os.makedirs('room_history')

    async def connect(self, websocket: WebSocket, roomId: str, userName: str):
        clientNamesInRoom = [self.clientNames.get(ws) for ws in self.rooms[roomId]]
       
        for name in clientNamesInRoom:
            if userName == name:
                print("client form list:",userName)
                await websocket.accept()
                await websocket.close(code=4001, reason="User name is taken already")
                return False
        

        self.rooms[roomId].append(websocket) # apending the new client to the client list of the room id 
        self.clientNames[websocket] = userName # adding the new name record to the dictionary

        return True
    
    async def sendLastFiveMessages(self, websocket: WebSocket, roomId: str):
        lines = []

        if os.path.exists(f'room_history/{roomId}'):
            with open(f'room_history/{roomId}', "r") as file:
                lines = file.readlines()
                print(lines)

                for line in lines:
                    line = line.strip()
                    if "/msg" in line:
                        sender, message = line.split("/msg",1)
                        await self.sendMsg(websocket,message,sender)
    
    async def write_to_history(self, message: str, userName: str, roomId: str):
        lines = []

        if os.path.exists(f'room_history/{roomId}'):
            with open(f'room_history/{roomId}', "r") as file:
                lines = file.readlines()

        lines.append(f'{userName}/msg{message}\n')
        lastFiveMessages = lines[-5:]

        with open(f'room_history/{roomId}', "w") as file:
            file.writelines(lastFiveMessages)

    async def disconnect(self, websocket: WebSocket, roomId: str):
        if websocket in self.rooms[roomId]:
            self.rooms[roomId].remove(websocket)
        
        if websocket in self.clientNames:
            del self.clientNames[websocket]

        if not self.rooms[roomId]:
            del self.rooms[roomId]

    async def roomBroadcast(self, websocket: WebSocket, roomId: str, message: str, userName: str):
        await self.write_to_history(message, userName, roomId)

        for connection in self.rooms[roomId]:
            if connection == websocket:
                pass
            else:
                await self.sendMsg(connection, message, userName)
                
    async def sendMsg(self, websocket: WebSocket, message: str, userName: str):
        jsonMessage = {
            "sender": userName,
            "msg": message 
        }

        await websocket.send_json(jsonMessage)


# server section
# ------------------------------------------------------------------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

socketManager = SocketManager()

@app.websocket("/ws/{roomId}/{name}")
async def websocket_endpoint(websocket: WebSocket, roomId: str, name: str):
    isValidConnection = await socketManager.connect(websocket, roomId, name)
    
    if not isValidConnection:
        return 
    
    await websocket.accept()
    await socketManager.sendLastFiveMessages(websocket, roomId)

    try:
        while True:
            message = await websocket.receive_text()
            await socketManager.roomBroadcast(websocket, roomId, message, name)
            
    except WebSocketDisconnect:
        print(f"Client {websocket.client.port} disconnected.")
        await socketManager.disconnect(websocket,roomId)
        
    except Exception as ex:
        print(f"Exception: {str(ex)}")
        await socketManager.disconnect(websocket, roomId)
        await websocket.close(code=4002)


@app.get("/rooms")
async def get_active_rooms():
    rooms_list = []

    if os.path.exists("room_history/"):
        rooms_list = os.listdir("room_history/")

    active_rooms = list(socketManager.rooms.keys())
    all_rooms = list(set(rooms_list + active_rooms))
    return {"rooms": all_rooms}


if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)