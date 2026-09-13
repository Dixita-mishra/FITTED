import os
from typing import Optional

# MongoDB Motor async driver ready configuration
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017/fitted_db")

class DatabaseManager:
    def __init__(self):
        self.db = None
        self.client = None
        self.is_connected = False

    async def connect(self):
        try:
            import motor.motor_asyncio
            self.client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=2000)
            self.db = self.client.get_database("fitted_db")
            # Ping to verify connection
            await self.client.admin.command('ping')
            self.is_connected = True
            print(f"[Fitted Backend] Connected to MongoDB at {MONGODB_URL}")
        except Exception as e:
            self.is_connected = False
            print(f"[Fitted Backend] MongoDB connection offline ({e}). Operating with fast async memory store.")

    async def disconnect(self):
        if self.client:
            self.client.close()

db_manager = DatabaseManager()
