# Деплой на 90.156.227.169 (советветеранов74.рф)

## Подготовка сервера (один раз)

Подключитесь к серверу (если в `~/.ssh/config` добавлен хост `sovet-veteranov` — используйте `ssh sovet-veteranov`):
```bash
ssh root@90.156.227.169
```

Установите необходимое (Debian/Ubuntu):
```bash
apt update && apt install -y nginx python3 python3-venv python3-pip
```

Создайте каталог приложения:
```bash
mkdir -p /opt/sovet-veteranov/backend /opt/sovet-veteranov/frontend
```

Скопируйте конфиги с вашего компьютера (из папки проекта):
```bash
# С вашего ПК (PowerShell, в корне проекта):
scp deploy/nginx.conf root@90.156.227.169:/etc/nginx/sites-available/sovet-veteranov
scp deploy/sovet-veteranov.service root@90.156.227.169:/etc/systemd/system/
```

На сервере:
```bash
ln -sf /etc/nginx/sites-available/sovet-veteranov /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
systemctl daemon-reload
```

---

## Первый деплой и обновления

### 1. Сборка фронтенда (на вашем ПК)

В корне проекта (где `package.json`). Должен быть файл `.env.production` с `VITE_API_URL=/api` (уже есть в репозитории).
```powershell
npm run build
```

### 2. Загрузка на сервер

Из корня проекта:
```powershell
# Backend (без venv и __pycache__)
scp -r backend\app backend\requirements.txt backend\bot root@90.156.227.169:/opt/sovet-veteranov/backend/

# Frontend (собранный)
scp -r dist\* root@90.156.227.169:/opt/sovet-veteranov/frontend/

# Медиа и БД — при первом деплое можно скопировать, при обновлении — по желанию
# scp -r backend\media root@90.156.227.169:/opt/sovet-veteranov/backend/
# scp backend\sovet_veteranov.db root@90.156.227.169:/opt/sovet-veteranov/backend/
```

### 3. На сервере

```bash
ssh root@90.156.227.169
cd /opt/sovet-veteranov/backend
```

Первый раз — создать venv и .env:
```bash
python3 -m venv venv
. venv/bin/activate
pip install -r requirements.txt
# Создать .env (скопировать из backend/.env или deploy/env.production.example)
nano .env
```

Запуск/перезапуск API:
```bash
systemctl restart sovet-veteranov
systemctl status sovet-veteranov
```

Проверка сайта: откройте в браузере http://советветеранов74.рф (или http://90.156.227.169).

---

## SSL (HTTPS)

Certbot уже установлен на сервере. После того как DNS для советветеранов74.рф указывает на 90.156.227.169, зайдите на сервер и выполните (подставьте правильный punycode домена, если certbot не примет кириллицу):

```bash
ssh root@90.156.227.169
certbot --nginx -d советветеранов74.рф --non-interactive --agree-tos --register-unsafely-without-email --redirect
```

Если появится ошибка NXDOMAIN — проверьте A-запись домена (должна указывать на 90.156.227.169).

---

## Краткая шпаргалка обновления

На ПК:
```powershell
npm run build
scp -r dist\* root@90.156.227.169:/opt/sovet-veteranov/frontend/
scp -r backend\app backend\requirements.txt root@90.156.227.169:/opt/sovet-veteranov/backend/
```

На сервере:
```bash
ssh root@90.156.227.169 "cd /opt/sovet-veteranov/backend && pip install -r requirements.txt && systemctl restart sovet-veteranov"
```
