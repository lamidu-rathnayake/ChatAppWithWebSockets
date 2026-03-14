import asyncio
import websockets

async def test():
    async with websockets.connect("ws://localhost:8001") as ws:
        await ws.send("hello")
        print("sent")

asyncio.run(test())