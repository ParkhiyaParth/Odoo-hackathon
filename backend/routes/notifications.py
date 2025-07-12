from fastapi import WebSocket, APIRouter

notify_router=APIRouter()
clients=[]

@notify_router.websocket("/ws/notifications")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)

    try:
        while True:
            await websocket.receive_text()

    except:
        clients.remove(websocket)        

async def notify_all_users(message: str):
    for client in clients:
        await client.send_text(message)