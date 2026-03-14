import asyncio
import websockets

# Function to handle each client connection
async def handle_client(websocket, path):
    # Add the new client to the set of connected clients
    
    try:
        # Listen for messages from the client
        message = await websocket.recv()
        print(message)
        
    except websockets.exceptions.ConnectionClosed:
        pass

    finally:
        pass

# Main function to start the WebSocket server
async def main():
    server = await websockets.serve(handle_client, 'localhost', 8080)
    await server.wait_closed()

# Run the server
if __name__ == "__main__":
    asyncio.run(main())