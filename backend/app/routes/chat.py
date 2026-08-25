from fastapi import APIRouter
from pydantic import BaseModel

from app.services.ai_service import get_ai_response


router = APIRouter(
    prefix="/chat",
    tags=["AI Assistant"],
)


class ChatRequest(BaseModel):
    message: str


@router.post("/")
def chat(request: ChatRequest):
    reply = get_ai_response(request.message)

    return {
        "reply": reply
    }
