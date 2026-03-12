from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

webapp = FastAPI()


origins = [
    "http://localhost",
]

webapp.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@webapp.get('/')
async def home():
    return {'message': 'Hello im lamidu rathnayake'}

