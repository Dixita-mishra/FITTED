from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import db_manager
from backend.routers import auth, ootd, wardrobe, recommendations, payments

app = FastAPI(
    title="Fitted Fashion Intelligence API",
    description="Backend API powering Fitted personalized style scoring, digital wardrobe, Qwen AI multimodal feedback, and Razorpay payments.",
    version="1.0.0"
)

# CORS Middleware setup for Vite Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits local Vite dev server (http://localhost:5173)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db():
    await db_manager.connect()

@app.on_event("shutdown")
async def shutdown_db():
    await db_manager.disconnect()

# Register Routers
app.include_router(auth.router, prefix="/api")
app.include_router(ootd.router, prefix="/api")
app.include_router(wardrobe.router, prefix="/api")
app.include_router(recommendations.router, prefix="/api")
app.include_router(payments.router, prefix="/api")

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Fitted FastAPI Backend",
        "mongodb_connected": db_manager.is_connected
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
