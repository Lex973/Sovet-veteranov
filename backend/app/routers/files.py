from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, UploadFile, File, HTTPException


router = APIRouter(prefix="/files", tags=["files"])

UPLOAD_DIR = Path("media") / "uploads"


@router.post("/images", status_code=201)
async def upload_image(file: UploadFile = File(...)):
    """Загрузка одного файла-изображения. Возвращает URL для вставки на сайт."""
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Можно загружать только изображения")

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    ext = (Path(file.filename).suffix or "").lower()
    if ext not in {".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"}:
        ext = ".jpg"

    name = f"{uuid4().hex}{ext}"
    filepath = UPLOAD_DIR / name

    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Файл пустой")

    with open(filepath, "wb") as f:
        f.write(data)

    # URL, по которому фронт сможет получить картинку
    url = f"/media/uploads/{name}"
    return {"url": url}

