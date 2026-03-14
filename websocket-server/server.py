from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import uvicorn
from collections import defaultdict


class SocketManager:
    def __init__(self):
        self.rooms = defaultdict(list)
        self.clientNames = defaultdict(str)

    async def connect(self, websocket: WebSocket, roomId: str, clientName: str):
        self.rooms[roomId].append(websocket) # apending the new client to the client list of the room id 
        self.clientNames[websocket] = clientName # adding the new name record to the dictionary
    
    async def disconnect(self, websocket: WebSocket, roomId: str):
        if websocket in self.rooms[roomId]:
            self.rooms[roomId].remove(websocket)
        
        if websocket in self.clientNames:
            del self.clientNames[websocket]

        if not self.rooms[roomId]:
            del self.rooms[roomId]

    async def roomBroadcast(self, websocket: WebSocket, roomId: str, message: str):
        jsonMessage = {
            "sender": self.clientNames.get(websocket),
            "msg": message 
        }

        for connection in self.rooms[roomId]:
            if connection == WebSocket:
                pass
            else:
                await connection.send_json(jsonMessage)




app = FastAPI()
socketManager = SocketManager()

@app.websocket("/ws/{roomId}/{name}")
async def websocket_endpoint(websocket: WebSocket, roomId: str, name: str):
    await websocket.accept()
    await socketManager.connect(websocket, roomId, name)
    
    try:
        while True:
            data = await websocket.receive_text()
            await socketManager.roomBroadcast(websocket, roomId, data)
            
    except WebSocketDisconnect:
        print(f"Client {websocket.client.port} disconnected.")
        await socketManager.disconnect(websocket,roomId)
        
    except Exception as ex:
        print(f"Exception: {str(ex)}")
        await socketManager.disconnect(websocket, roomId)
        await websocket.close()


if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)