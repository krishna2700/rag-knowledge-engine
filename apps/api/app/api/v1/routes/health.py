from fastapi import APIRouter
from app.core.config import get_settings
from app.shared.response_models import APIResponse

router = APIRouter()


@router.get("/health", response_model=APIResponse[dict])
async def health_check() -> APIResponse[dict]:
    settings = get_settings()
    return APIResponse(
        success=True,
        data={
            "status": "healthy",
            "version": settings.app_version,
            "environment": settings.environment,
        },
    )
