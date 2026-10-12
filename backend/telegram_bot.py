"""
Digital Aitys — Telegram Bot
============================
Чат-бот для Telegram на базе aiogram 3.x, позволяющий проводить
виртуальный айтыс прямо в мессенджере с анализом слогов и рифм.
"""

import os
import asyncio
from typing import Dict

# Для запуска требуется: pip install aiogram
try:
    from aiogram import Bot, Dispatcher, types, F
    from aiogram.filters import Command
    from aiogram.utils.keyboard import InlineKeyboardBuilder
except ImportError:
    Bot = None
    Dispatcher = None

from nlp_engine import generate_response, analyze_poetic_meter, detect_rhyme_scheme

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "YOUR_BOT_TOKEN_HERE")

# Хранилище сессий пользователей (выбранная тема)
user_sessions: Dict[int, str] = {}


async def main():
    if not Bot:
        print("Ошибка: библиотека aiogram не установлена. Выполните: pip install aiogram")
        return

    if BOT_TOKEN == "YOUR_BOT_TOKEN_HERE":
        print("Внимание: установите TELEGRAM_BOT_TOKEN в переменных среды.")

    bot = Bot(token=BOT_TOKEN)
    dp = Dispatcher()

    @dp.message(Command("start"))
    async def cmd_start(message: types.Message):
        user_sessions[message.from_user.id] = "білім"

        builder = InlineKeyboardBuilder()
        builder.button(text="🚩 Отан", callback_data="theme_отан")
        builder.button(text="🎓 Білім", callback_data="theme_білім")
        builder.button(text="🔨 Еңбек", callback_data="theme_еңбек")
        builder.button(text="🚀 Болашақ", callback_data="theme_болашақ")
        builder.button(text="🤖 Жасанды интеллект", callback_data="theme_жасанды интеллект")
        builder.adjust(2)

        welcome_text = (
            "🪕 *«Digital Aitys» виртуалды айтыскер ботына қош келдіңіз!*\n\n"
            "Мұнда сіз жасанды интеллектпен сөз сайысына түсе аласыз.\n"
            "Бот өлеңіңіздің буын санын (7-8 немесе 11 буын) және ұйқасын тексереді.\n\n"
            "Айтыс тақырыбын таңдаңыз:"
        )
        await message.answer(welcome_text, parse_mode="Markdown", reply_markup=builder.as_markup())

    @dp.callback_query(F.data.startswith("theme_"))
    async def handle_theme_selection(callback: types.CallbackQuery):
        theme_name = callback.data.replace("theme_", "")
        user_sessions[callback.from_user.id] = theme_name
        await callback.message.answer(
            f"✅ Тақырып таңдалды: *«{theme_name.capitalize()}»*.\n\n"
            "Енді өлең жолдарыңызды жазып жіберіңіз! Менің кезегім басталады...",
            parse_mode="Markdown"
        )
        await callback.answer()

    @dp.message(F.text)
    async def handle_user_verse(message: types.Message):
        user_id = message.from_user.id
        theme = user_sessions.get(user_id, "білім")

        # Отправляем имитацию набора текста
        await message.bot.send_chat_action(chat_id=message.chat.id, action="typing")
        await asyncio.sleep(1.2)

        # Обработка через NLP-движок
        result = generate_response(message.text, current_theme=theme)

        # Формируем отчет об анализе стиха пользователя
        syllables_str = "-".join(str(c) for c in result["user_syllable_counts"])
        analysis_card = (
            f"📊 *Өлеңді талдау нәтижесі:*\n"
            f"• Буын сандары: `{syllables_str}`\n"
            f"• Өлшемі: *{result['user_meter']}*\n"
            f"• Ұйқас түрі: *{result['rhyme_scheme']}*\n"
            f"• Бағалау: *{result['score']['rating']}*\n"
            f"• Кілт сөздер: _{', '.join(result['detected_keywords']) if result['detected_keywords'] else 'жалпы'}_"
        )

        response_msg = (
            f"{analysis_card}\n\n"
            f"🪕 *AI Айтыскер жауабы:*\n"
            f"_{result['response_text']}_"
        )

        await message.answer(response_msg, parse_mode="Markdown")

    print("Digital Aitys Telegram боты іске қосылды...")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
