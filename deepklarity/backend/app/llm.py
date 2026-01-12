"""
LLM interaction and safe JSON parsing.
"""

import os
import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate

llm = ChatGoogleGenerativeAI(
    model="gemini-pro",
    google_api_key=os.getenv("GEMINI_API_KEY"),
    temperature=0.3
)

PROMPT = PromptTemplate(
    input_variables=["text"],
    template="""
Return STRICT JSON ONLY.

{
  "summary": "",
  "key_entities": {
    "people": [],
    "organizations": [],
    "locations": []
  },
  "quiz": [
    {
      "question": "",
      "options": ["", "", "", ""],
      "answer": "",
      "difficulty": "easy | medium | hard",
      "explanation": ""
    }
  ],
  "related_topics": []
}

TEXT:
{text}
"""
)

def generate_all(text: str) -> dict:
    """
    Generates structured content using Gemini and safely parses JSON.
    """
    response = llm.invoke(PROMPT.format(text=text))
    raw = response.content.strip()

    if "```json" in raw:
        raw = raw.split("```json")[1].split("```")[0].strip()
    elif "```" in raw:
        raw = raw.split("```")[1].strip()

    return json.loads(raw)
