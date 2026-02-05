"""
Одноразовый скрипт для импорта новостей с https://советветеранов.рф/ в наш бэкенд.

Важно:
- Скрипт нужно запускать ЛОКАЛЬНО у тебя (не из Cursor): python -m scripts.import_news_from_sovet_site
- Перед запуском должен быть поднят наш API: http://127.0.0.1:8000
- Верстка стороннего сайта может отличаться – возможно, нужно будет подправить CSS‑селекторы.
"""

import dataclasses
from dataclasses import dataclass
from typing import List, Optional

import requests
from bs4 import BeautifulSoup


BASE_SOURCE = "https://xn--80adabmba9dchtfqc.xn--p1ai"  # советветеранов.рф в punycode
BASE_API = "http://127.0.0.1:8000"


@dataclass
class RemoteNews:
    title: str
    content: str
    category: Optional[str] = None


def fetch_page(url: str) -> BeautifulSoup:
    resp = requests.get(url, timeout=20)
    resp.raise_for_status()
    return BeautifulSoup(resp.text, "html.parser")


def parse_news_from_page(soup: BeautifulSoup, category: Optional[str]) -> List[RemoteNews]:
    """
    Черновой парсер: нужно адаптировать под реальную вёрстку.

    Сейчас он ищет блоки по заголовкам <h2>/<h3> внутри основного контента
    и собирает следующий за ними текст как содержимое новости.
    """
    results: List[RemoteNews] = []

    # TODO: если на сайте есть спец. контейнер для новостей (div с id/class),
    # лучше сначала сузить область поиска, например:
    # main = soup.select_one("main") or soup
    main = soup

    # Ищем заголовки, похожие на новости
    for h in main.find_all(["h2", "h3"]):
        title = (h.get_text(strip=True) or "").strip()
        if not title:
            continue

        # Берём все соседние параграфы до следующего заголовка
        parts: List[str] = []
        for sib in h.find_next_siblings():
            if sib.name in ("h2", "h3"):
                break
            text = sib.get_text(separator=" ", strip=True)
            if text:
                parts.append(text)

        if not parts:
            continue

        content_html = "<p>" + "</p><p>".join(parts) + "</p>"
        results.append(RemoteNews(title=title, content=content_html, category=category))

    return results


def collect_all_news() -> List[RemoteNews]:
    """
    Собираем новости с главной и тематических разделов.
    При необходимости добавь сюда другие URl.
    """
    sections = [
        ("/", None),
        ("/sport-otdykh", "#Спорт, отдых"),
        ("/%D0%B6%D0%BA%D1%85", "#ЖКХ"),
        ("/%D0%B7%D0%B4%D0%BE%D1%80%D0%BE%D0%B2%D1%8C%D0%B5", "#Здоровье"),
        ("/%D0%BA%D1%83%D0%BB%D1%8C%D1%82%D1%83%D1%80%D0%B0", "#Культура"),
        ("/%D1%80%D0%B0%D0%B7%D0%BD%D0%BE%D0%B5", "#Разное"),
    ]

    all_items: List[RemoteNews] = []

    for path, cat in sections:
        url = BASE_SOURCE + path
        print(f"Загружаю {url} ...")
        try:
            soup = fetch_page(url)
            items = parse_news_from_page(soup, category=cat)
            print(f"  найдено новостей: {len(items)}")
            all_items.extend(items)
        except Exception as e:
            print(f"  ошибка при разборе {url}: {e}")

    # Убираем дубли по заголовку + категории
    unique: dict[tuple[str, Optional[str]], RemoteNews] = {}
    for n in all_items:
        key = (n.title, n.category)
        unique[key] = n

    return list(unique.values())


def push_to_api(items: List[RemoteNews]) -> None:
    """
    Создаём записи в нашем API /news.
    Даты и картинки на исходном сайте почти не размечены,
    поэтому ставим сегодняшнюю дату и пустые изображения —
    потом можно отредактировать через админку.
    """
    import datetime as _dt

    created = 0
    for n in items:
        payload = {
            "title": n.title,
            "subtitle": "",
            "image": "",
            "images": [],
            "content": n.content,
            "date": _dt.date.today().isoformat(),
            "hashtag": n.category or "",
        }
        try:
            r = requests.post(f"{BASE_API}/news", json=payload, timeout=10)
            r.raise_for_status()
            created += 1
            print(f"[OK] {n.title[:60]!r}")
        except Exception as e:
            print(f"[FAIL] {n.title[:60]!r}: {e} — ответ: {getattr(e, 'response', None)}")

    print(f"Готово, создано новостей: {created}")


def main():
    print("Собираю новости с https://советветеранов.рф/ ...")
    items = collect_all_news()
    print(f"Всего уникальных новостей: {len(items)}")
    if not items:
        print("Новостей не найдено — вероятно, нужно подправить селекторы в parse_news_from_page.")
        return

    print("Отправляю новости в наш API ...")
    push_to_api(items)


if __name__ == "__main__":
    main()

