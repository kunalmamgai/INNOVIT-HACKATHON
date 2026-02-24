import os
import traceback
from dotenv import load_dotenv, find_dotenv
from google import genai
import time
from google.genai.errors import ServerError


# Load env
dotenv_path = find_dotenv()
if dotenv_path:
    load_dotenv(dotenv_path)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY not set")

# Initialize client
client = genai.Client(api_key=GEMINI_API_KEY)

MODEL_NAME = "gemini-flash-lite-latest"


def get_ai_response(user_message: str, conversation_history: list = None) -> str:
    system_prompt = """
You are an expert AI guide about India's heritage, culture, history, and tourism.
Keep responses engaging, concise (2-3 sentences), and unique.
"""

    full_prompt = system_prompt + "\nUser: " + user_message

    try:
        response = client.models.generate_content(
            model="gemini-flash-lite-latest",   # use stable model
            contents=full_prompt,
        )

        return response.text

    except Exception as e:
        import traceback
        print("🔥🔥🔥 FULL GEMINI ERROR 🔥🔥🔥")
        traceback.print_exc()
        return f"DEBUG ERROR: {str(e)}"


