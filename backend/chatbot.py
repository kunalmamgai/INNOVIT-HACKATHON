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
    try:
        system_prompt = """
You are an expert AI guide about Delhi's heritage, culture, history, and tourism.
Keep responses engaging, concise (2–3 sentences), and unique.
"""

        full_prompt = system_prompt + "\n\nUser: " + user_message

        # Retry up to 3 times if server overloaded
        for attempt in range(3):
            try:
                response = client.models.generate_content(
                    model=MODEL_NAME,
                    contents=full_prompt,
                )
                return response.text
            except ServerError as e:
                if attempt < 2:
                    time.sleep(2)  # wait 2 seconds
                else:
                    raise e

    except Exception as e:
        print("FULL GEMINI ERROR:\n", traceback.format_exc())
        return "The AI service is currently busy. Please try again in a few seconds."