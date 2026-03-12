import socketio
import uvicorn
from main import webapp

# creating the socketio server
sioserver = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*'
) 

# wraping the server with ASGI to get incoming trafic to the fastapi server
# this sioapp act as the the traffic router between http and websocket
sioapp = socketio.ASGIApp(socketio_server=sioserver, other_asgi_app=webapp) 

# creating te event for connecting and disconceting
@sioserver.event
async def connect(sid, environ, auth):
    print('connect', sid)


@sioserver.event
async def disconnect(sid, reason):
    print('disconnect', sid)
    print('disconnect reason:', reason)

# my custom event for receiving messgaes
@sioserver.on('send_message')
async def handle_message(sid, data):
    print(f"Message from {sid}: {data}")
    await sioserver.emit('receive_message', data)

# uvicorn will start the socketio server
if __name__ == '__main__':
    uvicorn.run('WebSocketsServer:sioapp', reload=True)






