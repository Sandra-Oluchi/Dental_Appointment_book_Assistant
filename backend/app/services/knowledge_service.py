from pathlib import Path

from app.database.supabase import KNOWLEDGE_TABLE, get_database


PROJECT_DIR = Path(__file__).resolve().parents[3]
KNOWLEDGE_BASE_PATH = PROJECT_DIR / "Knowledge_base" / "Knowledgebase.md"


def get_local_knowledge_base() -> str:
    try:
        return KNOWLEDGE_BASE_PATH.read_text(encoding="utf-8")
    except OSError:
        return ""


def get_relevant_knowledge(message: str) -> str:
    supabase = get_database()

    if not supabase:
        return get_local_knowledge_base()

    try:
        result = supabase.table(KNOWLEDGE_TABLE).select("*").eq(
            "active",
            True,
        ).execute()
    except Exception:
        return get_local_knowledge_base()

    message_text = message.lower()
    matched_content = []

    for row in result.data or []:
        topic = str(row.get("topic", "")).lower()
        category = str(row.get("category", "")).lower()
        content = str(row.get("content", "")).strip()

        if content and (topic in message_text or category in message_text):
            matched_content.append(content)

    if matched_content:
        return "\n\n".join(matched_content)

    return get_local_knowledge_base()
