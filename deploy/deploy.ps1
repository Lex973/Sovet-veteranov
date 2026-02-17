# Deploy to 90.156.227.169 | Run from project root: .\deploy\deploy.ps1

$ErrorActionPreference = "Stop"
$Server = "root@90.156.227.169"
$ProjectRoot = Split-Path $PSScriptRoot -Parent
if (-not (Test-Path "$ProjectRoot\package.json")) {
    Write-Error "Run from project root: .\deploy\deploy.ps1"
}
Set-Location $ProjectRoot

Write-Host "=== Build frontend ===" -ForegroundColor Cyan
if (Test-Path ".env.production") {
    Copy-Item ".env.production" ".env.production.bak" -ErrorAction SilentlyContinue
}
$envContent = Get-Content ".env.production" -Raw -ErrorAction SilentlyContinue
if ($envContent -notmatch "VITE_API_URL") {
    Add-Content -Path ".env.production" -Value "`nVITE_API_URL=/api"
}
npm run build
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "`n=== Upload to server ===" -ForegroundColor Cyan
scp -r dist "${Server}:/opt/sovet-veteranov/"
ssh $Server "rm -rf /opt/sovet-veteranov/frontend && mv /opt/sovet-veteranov/dist /opt/sovet-veteranov/frontend"
scp -r backend\app backend\requirements.txt backend\bot "${Server}:/opt/sovet-veteranov/backend/"

Write-Host "`n=== Nginx config (upload limit 20M) ===" -ForegroundColor Cyan
scp deploy\nginx.conf "${Server}:/etc/nginx/sites-available/sovet-veteranov"
ssh $Server "nginx -t && systemctl reload nginx"

Write-Host "`n=== Backend .env (TELEGRAM_CHANNEL) ===" -ForegroundColor Cyan
ssh $Server "cd /opt/sovet-veteranov/backend && (grep -q 'TELEGRAM_CHANNEL' .env 2>/dev/null || echo 'TELEGRAM_CHANNEL=@sovetveteranov74' >> .env); echo 'OK'"

Write-Host "`n=== Restart API ===" -ForegroundColor Cyan
ssh $Server "cd /opt/sovet-veteranov/backend && (test -d venv && venv/bin/pip install -r requirements.txt -q); systemctl restart sovet-veteranov; systemctl is-active sovet-veteranov"

Write-Host "`n=== Restart Bot ===" -ForegroundColor Cyan
scp deploy\sovet-veteranov-bot.service "${Server}:/etc/systemd/system/"
ssh $Server "systemctl daemon-reload; systemctl enable sovet-veteranov-bot; systemctl restart sovet-veteranov-bot; systemctl is-active sovet-veteranov-bot"

Write-Host "`nDone. Site: https://xn--74-6kchabsba5fehxhsc.xn--p1ai" -ForegroundColor Green
