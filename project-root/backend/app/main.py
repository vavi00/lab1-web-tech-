from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles
from .database import engine
from . import models
from .routers import items
#import os

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

#app.include_router(items.router, prefix="/api")
app.include_router(items.router)


# Підключаємо папку public
app.mount("/", StaticFiles(directory="../public", html=True), name="public")