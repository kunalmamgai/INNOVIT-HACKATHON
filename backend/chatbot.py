import asyncio
import os
import re
import time
import traceback

from dotenv import load_dotenv, find_dotenv
from google import genai


# Load env
dotenv_path = find_dotenv()
if dotenv_path:
    load_dotenv(dotenv_path)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("my_api_key")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY not set")

client = genai.Client(api_key=GEMINI_API_KEY)

MODEL_NAME = "gemini-2.5-flash-lite"

SYSTEM_PROMPT = """
You are an expert AI guide about India's heritage, culture, history, and tourism.
Keep responses engaging, concise (2-3 sentences), and unique.
"""

# ---------------------------------------------------------------------------
# In-memory TTL cache
#
# Common single-turn questions about major monuments (Taj Mahal, Qutub Minar,
# etc.) are answered from cache to cut Gemini latency and avoid rate-limit
# exhaustion during live demos. Only successful responses are cached.
# ---------------------------------------------------------------------------

_CACHE_TTL_SECONDS = 10 * 60  # 10 minutes
_cache = {}  # key -> (expires_at: float, response: str)
_inflight = {}  # key -> asyncio.Future, de-duplicates concurrent identical requests


def _normalize(message: str) -> str:
    return re.sub(r"\s+", " ", (message or "").strip().lower())


def _cache_key(message: str, history: list) -> str:
    # Multi-turn conversations are context dependent; only cache single-turn asks.
    if history:
        return ""
    return f"single::{_normalize(message)}"


def _get_cached(key: str):
    if not key:
        return None
    now = time.monotonic()
    entry = _cache.get(key)
    if entry is None:
        return None
    expires_at, response = entry
    if now > expires_at:
        _cache.pop(key, None)
        return None
    return response


def _set_cached(key: str, response: str):
    if key:
        _cache[key] = (time.monotonic() + _CACHE_TTL_SECONDS, response)


def _build_prompt(user_message: str, conversation_history: list) -> str:
    lines = [SYSTEM_PROMPT]
    if conversation_history:
        for turn in conversation_history[-4:]:
            role = (turn.get("role") or "user").capitalize()
            content = turn.get("content") or ""
            if content:
                lines.append(f"{role}: {content}")
    lines.append(f"User: {user_message}")
    return "\n".join(lines)


async def get_ai_response(user_message: str, conversation_history: list = None) -> str:
    history = conversation_history or []
    key = _cache_key(user_message, history)

    # 1) Fast path: serve from cache
    cached = _get_cached(key)
    if cached is not None:
        return cached

    # 2) De-duplicate concurrent identical requests (presentation-day stampede)
    fut = _inflight.get(key)
    if fut is not None:
        try:
            return await asyncio.shield(fut)
        except Exception:
            pass  # fall through and retry locally

    fut = asyncio.get_event_loop().create_future()
    _inflight[key] = fut

    try:
        response = await client.aio.models.generate_content(
            model=MODEL_NAME,
            contents=_build_prompt(user_message, history),
        )
        text = (response.text or "").strip()
        result = text or "Sorry, I couldn't generate a response."
        if text:
            _set_cached(key, text)
    except Exception:
        print("🔥🔥🔥 FULL GEMINI ERROR 🔥🔥🔥")
        traceback.print_exc()
        result = "I'm sorry, I couldn't reach the AI service right now. Please try again in a moment."
    finally:
        # Resolve any concurrent waiters with the same result, then drop the
        # inflight marker so the next request can fetch again.
        if not fut.done():
            fut.set_result(result)
        _inflight.pop(key, None)

    return result
