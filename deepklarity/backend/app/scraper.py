"""
Scrapes Wikipedia pages and cleans extracted content.
"""

import requests
import re
from bs4 import BeautifulSoup

def scrape_wikipedia(url: str) -> dict:
    """
    Scrapes Wikipedia content and returns structured data.
    """
    response = requests.get(url, timeout=10)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    title = soup.find("h1").get_text(strip=True)

    paragraphs = soup.select("p")
    content = " ".join(p.get_text() for p in paragraphs if p.get_text(strip=True))

    # Clean Wikipedia artifacts
    content = re.sub(r"\[\d+\]", "", content)
    content = content.replace("[edit]", "")
    content = content[:5000]

    sections = [h.get_text() for h in soup.select("h2 span.mw-headline")]

    return {
        "title": title,
        "content": content,
        "sections": sections,
        "html": response.text
    }
