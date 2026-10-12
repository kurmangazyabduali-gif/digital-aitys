"""
Digital Aitys — NLP Engine for Kazakh Poetry Analysis and Aitys Battle
======================================================================
Модуль обработки естественного языка (NLP) для анализа казахских стихов,
подсчета слогов, определения рифмы, извлечения ключевых слов и генерации
ответных четверостиший для айтыса.
"""

import re
import string
from typing import List, Dict, Tuple, Optional, Any


# =====================================================================
# 1. ФОНЕТИКА И ПОДСЧЕТ СЛОГОВ (БУЫН САНАУ)
# =====================================================================

# Казахские гласные буквы (дауысты дыбыстар)
# Негізгі: а, ә, о, ө, ұ, ү, ы, і, е, и, у
# Қосарлы / кірме: я (й+а), ю (й+у), э
KAZAKH_VOWELS = set("аәоөұүыіеиуяюэАӘОӨҰҮЫІЕИУЯЮЭ")


def count_syllables_line(line: str) -> int:
    """
    Считает количество слогов в одной строке казахского стиха.
    В казахской поэтике количество слогов строго равно числу гласных звуков.
    """
    return sum(1 for char in line if char in KAZAKH_VOWELS)


def count_syllables(text: str) -> List[int]:
    """
    Принимает текст (стих) и возвращает список количества слогов
    для каждой непустой строки.
    """
    lines = [line.strip() for line in text.strip().split("\n") if line.strip()]
    return [count_syllables_line(line) for line in lines]


def analyze_poetic_meter(line_or_lines: Any) -> Dict[str, Any]:
    """
    Определяет стихотворный размер:
    - Жыр өлшемі: 7-8 слогов в строке (суырыпсалма айтыс пен толғау өлшемі)
    - Қара өлең өлшемі: 11 слогов в строке (классикалық қазақ өлеңі)
    - Еркін өлшем: смешанный размер
    """
    if isinstance(line_or_lines, str):
        lines = [l.strip() for l in line_or_lines.strip().split("\n") if l.strip()]
    else:
        lines = [str(l).strip() for l in line_or_lines if str(l).strip()]

    if not lines:
        return {
            "meter": "Белгісіз (бос жол)",
            "syllables_per_line": [],
            "avg_syllables": 0,
            "is_zhyr": False,
            "is_qara_olen": False,
            "is_valid_meter": False,
        }

    counts = [count_syllables_line(line) for line in lines]
    avg_count = sum(counts) / len(counts)

    # Проверка на соответствие 7-8 слогам (Жыр)
    is_zhyr = all(c in (7, 8) for c in counts) or (6.8 <= avg_count <= 8.2 and all(6 <= c <= 9 for c in counts))

    # Проверка на соответствие 11 слогам (Қара өлең)
    is_qara_olen = all(c == 11 for c in counts) or (10.5 <= avg_count <= 11.5 and all(10 <= c <= 12 for c in counts))

    if is_zhyr:
        meter_name = "Жыр өлшемі (7-8 буын)"
    elif is_qara_olen:
        meter_name = "Қара өлең өлшемі (11 буын)"
    else:
        meter_name = f"Аралас / еркін өлшем (орташа {avg_count:.1f} буын)"

    return {
        "meter": meter_name,
        "syllables_per_line": counts,
        "avg_syllables": round(avg_count, 1),
        "is_zhyr": is_zhyr,
        "is_qara_olen": is_qara_olen,
        "is_valid_meter": is_zhyr or is_qara_olen,
    }


# =====================================================================
# 2. АНАЛИЗ РИФМЫ (ҰЙҚАС ТАЛДАУЫ)
# =====================================================================

def clean_word(word: str) -> str:
    """Удаляет знаки препинания и приводит к нижнему регистру."""
    return word.strip().strip(string.punctuation + "«»—…–\"'").lower()


def get_rhyme_ending(line: str, suffix_len: int = 3) -> str:
    """
    Извлекает рифмующееся окончание последнего слова строки.
    Обычно это последние 2-3 буквы или последний слог.
    """
    words = line.strip().split()
    if not words:
        return ""
    last_word = clean_word(words[-1])
    if len(last_word) <= suffix_len:
        return last_word
    return last_word[-suffix_len:]


def are_rhyming(word1: str, word2: str) -> bool:
    """
    Проверяет, рифмуются ли два слова.
    Сравнивает последние 2-3 звука, созвучность гласных и окончаний.
    """
    w1, w2 = clean_word(word1), clean_word(word2)
    if not w1 or not w2:
        return False
    if w1 == w2:
        return True

    # Сравнение суффикса длины 3, 2
    for length in (3, 2):
        if len(w1) >= length and len(w2) >= length:
            if w1[-length:] == w2[-length:]:
                return True

    return False


def detect_rhyme_scheme(lines: List[str]) -> Dict[str, Any]:
    """
    Определяет схему рифмовки четверостишия:
    - a-a-b-a: Қара өлең ұйқасы (дәстүрлі айтыс ұйқасы)
    - a-b-a-b: Шалыс ұйқас
    - a-a-b-b: Егіз ұйқас
    - a-b-c-b: Кезекті ұйқас
    - басқа: Еркін ұйқас
    """
    clean_lines = [l.strip() for l in lines if l.strip()]
    if len(clean_lines) < 4:
        return {
            "scheme": "Толық емес шумақ (4 жолдан аз)",
            "pattern": "?",
            "is_qara_olen_rhyme": False,
        }

    # Берём последние слова первых 4 строк
    endings = []
    for l in clean_lines[:4]:
        words = l.split()
        endings.append(clean_word(words[-1]) if words else "")

    e1, e2, e3, e4 = endings[0], endings[1], endings[2], endings[3]

    # Сравнение пар
    r12 = are_rhyming(e1, e2)
    r14 = are_rhyming(e1, e4)
    r24 = are_rhyming(e2, e4)
    r13 = are_rhyming(e1, e3)
    r23 = are_rhyming(e2, e3)
    r34 = are_rhyming(e3, e4)

    # 1) Қара өлең ұйқасы (a-a-b-a): 1, 2, 4 строки рифмуются
    if (r12 and r14) or (r12 and r24) or (r14 and r24):
        return {
            "scheme": "Қара өлең ұйқасы (а-а-б-а)",
            "pattern": "a-a-b-a",
            "is_qara_olen_rhyme": True,
        }

    # 2) Шалыс ұйқас (a-b-a-b): 1-3 и 2-4 рифмуются
    if r13 and r24:
        return {
            "scheme": "Шалыс ұйқас (а-б-а-б)",
            "pattern": "a-b-a-b",
            "is_qara_olen_rhyme": False,
        }

    # 3) Егіз ұйқас (a-a-b-b): 1-2 и 3-4 рифмуются
    if r12 and r34:
        return {
            "scheme": "Егіз ұйқас (а-а-б-б)",
            "pattern": "a-a-b-b",
            "is_qara_olen_rhyme": False,
        }

    # 4) Кезекті ұйқас (a-b-c-b): 2 и 4 рифмуются
    if r24:
        return {
            "scheme": "Кезекті ұйқас (а-б-в-б)",
            "pattern": "a-b-c-b",
            "is_qara_olen_rhyme": False,
        }

    return {
        "scheme": "Еркін / аралас ұйқас",
        "pattern": "custom",
        "is_qara_olen_rhyme": False,
    }


# =====================================================================
# 3. ТОКЕНИЗАЦИЯ И ИЗВЛЕЧЕНИЕ КЛЮЧЕВЫХ СЛОВ (КІЛТ СӨЗДЕР)
# =====================================================================

# Казахские стоп-слова (шылаулар, одағайлар, көмекші сөздер)
KAZAKH_STOPWORDS = {
    "мен", "пен", "бен", "және", "да", "де", "та", "те", "ғой", "қой",
    "ау", "ай", "мынау", "анау", "сол", "бұл", "бір", "үшін", "туралы",
    "сияқты", "секілді", "ғана", "қана", "емес", "болса", "деген", "дейін",
    "арқылы", "бойынша", "керек", "болады", "бар", "жоқ", "енді", "онда"
}

# Казахские аффиксы (жалғаулар) для базового стемминга
# Септік, көптік, тәуелдік, жіктік жалғаулары
COMMON_SUFFIXES = [
    # Көптік
    "лар", "лер", "дар", "дер", "тар", "тер",
    # Септік
    "ның", "нің", "дың", "дің", "тың", "тің",
    "ға", "ге", "қа", "ке", "на", "не",
    "ны", "ні", "ды", "ді", "ты", "ті",
    "да", "де", "та", "те", "нда", "нде",
    "дан", "ден", "тан", "тен", "нан", "нен",
    "мен", "бен", "пен", "менен", "бенен", "пенен",
    # Тәуелдік
    "ым", "ім", "мыз", "міз", "ың", "ің", "ыңыз", "іңіз", "сы", "сі",
]


def kazakh_stem(word: str) -> str:
    """
    Упрощенный стеммер для казахского языка.
    Отсекает стандартные грамматические окончания (жалғаулар),
    чтобы найти корень слова (например: мектепте -> мектеп, ұстаздарға -> ұстаз).
    """
    clean = clean_word(word)
    if len(clean) <= 3:
        return clean

    changed = True
    while changed and len(clean) > 3:
        changed = False
        for suffix in sorted(COMMON_SUFFIXES, key=len, reverse=True):
            if clean.endswith(suffix) and len(clean) - len(suffix) >= 3:
                clean = clean[:-len(suffix)]
                changed = True
                break

    return clean


def extract_keywords(user_text: str) -> List[str]:
    """
    Токенизирует текст пользователя, удаляет стоп-слова
    и извлекает нормализованные ключевые слова.
    """
    tokens = re.findall(r"[a-zA-Zа-яА-ЯәіңғүұқөһӘІҢҒҮҰҚӨҺ]+", user_text.lower())
    filtered = [t for t in tokens if t not in KAZAKH_STOPWORDS and len(t) > 2]

    # Получаем стеммы и сохраняем исходные слова
    keywords = set()
    for token in filtered:
        keywords.add(token)
        stem = kazakh_stem(token)
        if len(stem) >= 3:
            keywords.add(stem)

    return sorted(list(keywords))


# =====================================================================
# 4. ТЕСТОВЫЙ СЛОВАРЬ (DATASET КАЗАХСКИХ СТИХОВ ДЛЯ АЙТЫСА)
# =====================================================================

# Словарь готовых поэтических ответов для айтыса.
# Каждое четверостишие размечено по тематике, размеру и схеме рифмовки (а-а-б-а).
POETRY_DATASET: Dict[str, List[Dict[str, Any]]] = {
    "білім": [
        {
            "id": "bilim_1",
            "verse": (
                "Ұстаз бізге білім беріп,\n"
                "Жақсылыққа баулиды.\n"
                "Тәрбиесін санаға құйсаң,\n"
                "Болашағың жарқырайды!"
            ),
            "theme": "білім",
            "meter": "Жыр (7-8 буын)",
            "rhyme": "a-b-c-b",
            "keywords": ["білім", "ұстаз", "тәрбие", "болашақ", "жақсылық"],
        },
        {
            "id": "bilim_2",
            "verse": (
                "Оқыған жан оза шауып бәйгеден,\n"
                "Ғылым қусаң, алдың ашық қай кезде.\n"
                "Кітап оқып, білім жина көкейге,\n"
                "Асыл мұрат орындалар әйгілі ең!"
            ),
            "theme": "білім",
            "meter": "Қара өлең (11 буын)",
            "rhyme": "a-a-b-a",
            "keywords": ["білім", "ғылым", "кітап", "оқу", "бәйге", "мұрат"],
        },
    ],
    "ұстаз": [
        {
            "id": "ustaz_1",
            "verse": (
                "Ұстаз деген – шамшырағы өмірдің,\n"
                "Көзін ашқан көкіректегі көңілдің.\n"
                "Алғыс айтып бас иеміз мәңгілік,\n"
                "Шәкірті боп нұрлы шапақ төгілдің!"
            ),
            "theme": "ұстаз",
            "meter": "Қара өлең (11 буын)",
            "rhyme": "a-a-b-a",
            "keywords": ["ұстаз", "мұғалім", "мектеп", "шәкірт", "алғыс"],
        },
    ],
    "мектеп": [
        {
            "id": "mektep_1",
            "verse": (
                "Мектебім – білім ордасы,\n"
                "Ашылған алтын қақпасы.\n"
                "Сенде өткен әрбір күн –\n"
                "Өмірдің бақыт бастасы!"
            ),
            "theme": "мектеп",
            "meter": "Жыр (7-8 буын)",
            "rhyme": "a-a-b-a",
            "keywords": ["мектеп", "білім", "парта", "орда", "алтын"],
        },
    ],
    "отан": [
        {
            "id": "otan_1",
            "verse": (
                "Туған жерім – байтақ далам, дарханым,\n"
                "Сені мақтан етіп жырға тартамын.\n"
                "Қазағымның абыройы асқақтап,\n"
                "Отан үшін аянбайды тарланың!"
            ),
            "theme": "отан",
            "meter": "Қара өлең (11 буын)",
            "rhyme": "a-a-b-a",
            "keywords": ["отан", "туған жер", "қазақ", "ел", "байтақ", "дала"],
        },
        {
            "id": "otan_2",
            "verse": (
                "Отан десе жүрегім,\n"
                "Лүпілдейді білемін.\n"
                "Елім аман болсын деп,\n"
                "Тілек тілеп жүремін!"
            ),
            "theme": "отан",
            "meter": "Жыр (7-8 буын)",
            "rhyme": "a-a-b-a",
            "keywords": ["отан", "ел", "жүрек", "тілек"],
        },
    ],
    "еңбек": [
        {
            "id": "enbek_1",
            "verse": (
                "Адал еңбек – абыройдың тірегі,\n"
                "Ерінбеген адам ғана жеңеді.\n"
                "Таңнан кешке тынбай терді төккен жан,\n"
                "Маңдай тердің тәтті дәмін көреді!"
            ),
            "theme": "еңбек",
            "meter": "Қара өлең (11 буын)",
            "rhyme": "a-a-b-a",
            "keywords": ["еңбек", "кәсіп", "адал", "тер", "маңдай", "табыс"],
        },
    ],
    "болашақ": [
        {
            "id": "bolashaq_1",
            "verse": (
                "Болашақтың кілті бүгін қолыңда,\n"
                "Жалын жастар білім ізде жолыңда.\n"
                "Егемен ел ертеңіне нық басқан,\n"
                "Бәсекеге қабілетті болыңдар!"
            ),
            "theme": "болашақ",
            "meter": "Қара өлең (11 буын)",
            "rhyme": "a-a-b-a",
            "keywords": ["болашақ", "жастар", "ертең", "өркениет", "мақсат"],
        },
    ],
    "жасанды интеллект": [
        {
            "id": "ai_1",
            "verse": (
                "Жасанды ақыл – жаңа заман тынысы,\n"
                "Цифрланды өркениеттің құрышы.\n"
                "Айтыста да сөз жарыстырған бүгінде,\n"
                "Технология – ғылымның зор жеңісі!"
            ),
            "theme": "жасанды интеллект",
            "meter": "Қара өлең (11 буын)",
            "rhyme": "a-a-b-a",
            "keywords": ["жасанды интеллект", "робот", "технология", "цифр", "ақыл", "ai", "компьютер"],
        },
    ],
    "default": [
        {
            "id": "default_1",
            "verse": (
                "Сөзің маржан, ойың кең, бағалаймын,\n"
                "Айтыс десе от болып жана аламын.\n"
                "Домбырамды қолыма алып серпілсем,\n"
                "Сөз өнерін биікке балағанмын!"
            ),
            "theme": "жалпы айтыс",
            "meter": "Қара өлең (11 буын)",
            "rhyme": "a-a-b-a",
            "keywords": ["айтыс", "домбыра", "сөз", "өнер"],
        },
    ],
}


# =====================================================================
# 5. ГЛАВНАЯ ФУНКЦИЯ GENERATE_RESPONSE
# =====================================================================

def generate_response(user_text: str, current_theme: Optional[str] = None) -> Dict[str, Any]:
    """
    Главная функция генерации ответа в айтысе:
    1. Считает слоги в строках пользователя.
    2. Определяет стихотворный размер (Жыр 7-8 или Қара өлең 11).
    3. Извлекает ключевые слова.
    4. Определяет схему рифмы строк пользователя.
    5. Подбирает подходящий ответный стих из словаря, соблюдая тематику и рифму.
    
    Возвращает словарь с анализом и ответом ИИ.
    """
    if not user_text or not user_text.strip():
        default_verse = POETRY_DATASET["default"][0]["verse"]
        return {
            "response_text": default_verse,
            "status": "empty_input",
            "detected_keywords": [],
            "user_syllable_counts": [],
            "user_meter": "Белгісіз",
            "rhyme_scheme": "Белгісіз",
            "score": {"syllable_match": False, "rhyme_valid": False},
        }

    # 1. Построчный анализ текста пользователя
    lines = [l.strip() for l in user_text.strip().split("\n") if l.strip()]
    syllable_counts = [count_syllables_line(l) for l in lines]
    meter_info = analyze_poetic_meter(lines)

    # 2. Анализ рифмы пользователя
    rhyme_info = detect_rhyme_scheme(lines) if len(lines) >= 4 else {
        "scheme": "Жол саны 4-тен аз (қысқа шумақ)",
        "pattern": "short",
        "is_qara_olen_rhyme": False,
    }

    # 3. Извлечение ключевых слов
    extracted_keywords = extract_keywords(user_text)

    # 4. Поиск наилучшего совпадения в поэтическом датасете
    best_verse = None
    best_score = -1
    selected_category = "default"

    # Приоритет заданной теме (если передана, например, "Білім")
    normalized_theme = current_theme.lower() if current_theme else ""

    for category, verse_list in POETRY_DATASET.items():
        if category == "default":
            continue

        category_match = 2 if category in normalized_theme else 0

        for verse_data in verse_list:
            score = category_match
            # Проверка пересечения ключевых слов
            for kw in verse_data["keywords"]:
                if kw in extracted_keywords or any(kw in ek for ek in extracted_keywords):
                    score += 3

            # Бонус за совпадение стихотворного размера
            if meter_info["is_zhyr"] and "Жыр" in verse_data["meter"]:
                score += 2
            elif meter_info["is_qara_olen"] and "Қара өлең" in verse_data["meter"]:
                score += 2

            if score > best_score:
                best_score = score
                best_verse = verse_data["verse"]
                selected_category = category

    # Если точных совпадений по ключевым словам не найдено,
    # используем стих по текущей выбранной теме или дефолтный
    if best_score <= 0 or not best_verse:
        if normalized_theme and normalized_theme in POETRY_DATASET:
            best_verse = POETRY_DATASET[normalized_theme][0]["verse"]
            selected_category = normalized_theme
        else:
            best_verse = POETRY_DATASET["default"][0]["verse"]
            selected_category = "default"

    # 5. Оценка качества стиха пользователя (метрика айтыса)
    score_analysis = {
        "is_valid_meter": meter_info["is_valid_meter"],
        "is_traditional_rhyme": rhyme_info.get("is_qara_olen_rhyme", False),
        "total_lines": len(lines),
        "avg_syllables": meter_info["avg_syllables"],
        "rating": "Тамаша!" if (meter_info["is_valid_meter"] and rhyme_info.get("is_qara_olen_rhyme")) else "Жақсы талап",
    }

    return {
        "response_text": best_verse,
        "matched_theme": selected_category,
        "detected_keywords": extracted_keywords,
        "user_syllable_counts": syllable_counts,
        "user_meter": meter_info["meter"],
        "rhyme_scheme": rhyme_info["scheme"],
        "score": score_analysis,
    }


# =====================================================================
# ТЕСТОВЫЙ ЗАПУСК ДЛЯ ПРОВЕРКИ
# =====================================================================
if __name__ == "__main__":
    test_user_poem = (
        "Мектепте білім алып біз өсеміз,\n"
        "Ұстаздың ақылымен түзелеміз.\n"
        "Ғылымның сара жолын таңдаған соң,\n"
        "Асудан қиындықсыз біз өтеміз."
    )

    print("--- [ТЕСТ АЙТЫС NLP АЛГОРИТМІ] ---")
    print("Қолданушы өлеңі:")
    print(test_user_poem)
    print("\n--- Талдау және жауап генерациясы ---")
    result = generate_response(test_user_poem, current_theme="білім")
    print(f"Табылған кілт сөздер: {result['detected_keywords']}")
    print(f"Буын сандары: {result['user_syllable_counts']}")
    print(f"Өлең өлшемі: {result['user_meter']}")
    print(f"Ұйқас түрі: {result['rhyme_scheme']}")
    print(f"Бағалау: {result['score']['rating']}")
    print("\nAI Айтыскер жауабы:")
    print(result["response_text"])
