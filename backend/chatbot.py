import os
from openai import OpenAI
from dotenv import load_dotenv
import traceback
import json

# Load environment variables from .env file
load_dotenv()

# Initialize OpenRouter client (OpenAI-compatible)
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")

def get_ai_response(user_message: str, conversation_history: list = None) -> str:
    """
    Get dynamic AI responses using OpenRouter API (real LLM, no repetition).
    Provides intelligent responses about Delhi heritage, culture, and history.
    """
    if not OPENROUTER_API_KEY:
        return "⚠️ API Key not configured. Please set OPENROUTER_API_KEY in .env file."
    
    if conversation_history is None:
        conversation_history = []

    try:
        client = OpenAI(
            api_key=OPENROUTER_API_KEY,
            base_url="https://openrouter.ai/api/v1",
        )
        
        # System prompt for Delhi heritage context
        system_prompt = """You are an expert AI guide about Delhi's heritage, culture, history, and tourism. 
You provide engaging, accurate, and dynamic responses about:
- Historic monuments (Red Fort, India Gate, Qutb Minar, Jama Masjid, Chandni Chowk, Rashtrapati Bhawan, etc.)
- Festivals and celebrations (Diwali, Holi, Eid, Republic Day, Independence Day, etc.)
- Traditional cuisine (samosas, chole bhature, butter chicken, tandoori, Delhi street food, parathas, etc.)
- Languages spoken (Hindi, Urdu, English, Punjabi, and their cultural significance)
- Art, crafts, and traditional trades (marble inlay, block printing, metalwork, carpet weaving, etc.)
- Local neighborhoods and famous markets (Chandni Chowk, Paharganj, Sarojini Nagar, Dilli Haat, etc.)
- Historical events and Mughal/British colonial history
- Local traditions, customs, and ways of life

Keep responses:
- Engaging and conversational (not repetitive)
- Concise but informative (2-3 sentences typically)
- Rich with interesting details and local insights
- Encouraging cultural appreciation and tourism
- Varied and creative every time

Always provide diverse, creative responses. Never repeat the same information twice. Make each response unique and engaging."""

        # Build message history for context - add system message as first message
        messages = [
            {
                "role": "system",
                "content": system_prompt
            }
        ]
        
        # Add conversation history
        for msg in conversation_history[-6:]:  # Keep last 6 messages for context
            messages.append({
                "role": msg.get("role", "user"),
                "content": msg.get("content", "")
            })
        
        # Add current user message
        messages.append({
            "role": "user",
            "content": user_message
        })

        # Debug: log outgoing request
        try:
            print("[chatbot] Calling OpenRouter/OpenAI with model=openai/gpt-3.5-turbo")
            print("[chatbot] Messages payload:", json.dumps(messages, ensure_ascii=False)[:2000])
        except Exception:
            pass

        # Call OpenRouter/OpenAI-compatible API
        response = client.chat.completions.create(
            model="openai/gpt-3.5-turbo",
            messages=messages,
            max_tokens=500,
            temperature=0.9,
        )

        # Debug: log response structure
        try:
            print("[chatbot] API response:", getattr(response, '__dict__', str(response))[:2000])
        except Exception:
            pass

        # Extract text in a resilient way
        try:
            text = response.choices[0].message.content
        except Exception:
            try:
                text = response.choices[0].text
            except Exception:
                text = str(response)

        return text

    except Exception as e:
        # Log full traceback for debugging
        tb = traceback.format_exc()
        print(f"OpenRouter API error: {e}\n{tb}")
        return f"I'm having trouble connecting to the AI service. Please try again in a moment. Error: {str(e)[:200]}"

