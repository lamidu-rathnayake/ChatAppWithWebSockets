from fastapi import FastAPI

webapp = FastAPI()

@webapp.get('/')
async def home():
    return {'message': 'Hello im lamidu rathnayake'}

