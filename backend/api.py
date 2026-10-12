"""
Digital Aitys — FastAPI Backend Service
=======================================
REST API сервис для интеграции NLP-движка айтыса с веб-приложением (Next.js)
или мобильным клиентом.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

from nlp_engine import (
    count_syllables,
    analyze_poetic_meter,
    detect_rhyme_scheme,
    extract_keywords,
    generate_response,
    POETRY_DATASET,
)

app = FastAPI(
    title="Digital Aitys NLP API",
    description="API для анализа казахской поэзии, подсчета слогов, рифм и состязания с AI-айтыскером",
    version="1.0.0",
)

# Разрешаем CORS для подключения к Next.js фронтенду (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Модели данных (Pydantic) ---

class PoemAnalysisRequest(BaseModel):
    text: str = Field(..., description="Текст казахского стиха или куплета")


class PoemAnalysisResponse(BaseModel):
    lines: List[str]
    syllable_counts: List[int]
    meter: str
    avg_syllables: float
    is_zhyr: bool
    is_qara_olen: bool
    rhyme_scheme: str
    rhyme_pattern: str
    keywords: List[str]


class AitysGenerateRequest(BaseModel):
    user_text: str = Field(..., description="Реплика пользователя (стих)")
    current_theme: Optional[str] = Field("білім", description="Текущая тема айтыса (білім, отан, еңбек...)")


class AitysGenerateResponse(BaseModel):
    response_text: str
    matched_theme: str
    detected_keywords: List[str]
    user_syllable_counts: List[int]
    user_meter: str
    rhyme_scheme: str
    score: Dict[str, Any]


# --- Эндпоинты API ---

@app.get("/")
def root():
    return {
        "project": "Digital Aitys NLP Backend",
        "status": "online",
        "docs": "/docs",
    }


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/analyze", response_model=PoemAnalysisResponse)
def analyze_poem_endpoint(payload: PoemAnalysisRequest):
    """
    Эндпоинт для полного NLP-анализа казахского стиха:
    - Подсчет слогов в каждой строке
    - Определение стихотворного размера (Жыр 7-8 / Қара өлең 11)
    - Определение схемы рифмовки (а-а-б-а, шалыс, егіз)
    - Извлечение ключевых слов
    """
    if not payload.text.strip():
        raise HTTPException(status_code=400, detail="Мәтін бос болмауы керек (Текст не должен быть пустым)")

    lines = [l.strip() for l in payload.text.strip().split("\n") if l.strip()]
    meter_info = analyze_poetic_meter(lines)
    rhyme_info = detect_rhyme_scheme(lines)
    keywords = extract_keywords(payload.text)

    return PoemAnalysisResponse(
        lines=lines,
        syllable_counts=meter_info["syllables_per_line"],
        meter=meter_info["meter"],
        avg_syllables=meter_info["avg_syllables"],
        is_zhyr=meter_info["is_zhyr"],
        is_qara_olen=meter_info["is_qara_olen"],
        rhyme_scheme=rhyme_info["scheme"],
        rhyme_pattern=rhyme_info.get("pattern", "custom"),
        keywords=keywords,
    )


@app.post("/generate", response_model=AitysGenerateResponse)
def generate_aitys_response_endpoint(payload: AitysGenerateRequest):
    """
    Главный эндпоинт для состязания в айтысе:
    Принимает стих пользователя, анализирует слоги и рифму,
    находит ключевые слова и генерирует рифмованный ответ от AI.
    """
    result = generate_response(payload.user_text, payload.current_theme)
    return AitysGenerateResponse(**result)


@app.get("/dataset")
def get_dataset_themes():
    """Возвращает список доступных тем и структуру базы стихов."""
    themes = {}
    for key, items in POETRY_DATASET.items():
        themes[key] = {
            "count": len(items),
            "sample": items[0]["verse"] if items else "",
        }
    return {"themes": themes}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
