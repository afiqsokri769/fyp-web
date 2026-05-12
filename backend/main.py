from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routers import auth, bookings, services, inquiries, users, admin, faqs

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*", "Authorization", "Content-Type"],
)

# Routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(bookings.router, prefix="/bookings", tags=["Bookings"])
app.include_router(services.router, prefix="/services", tags=["Services"])
app.include_router(inquiries.router, prefix="/inquiries", tags=["Inquiries"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(faqs.router, prefix="/faqs", tags=["FAQs"])


@app.get("/", tags=["Health"])
async def root():
    return {"message": f"{settings.app_name} v{settings.app_version}", "status": "running"}


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy"}
