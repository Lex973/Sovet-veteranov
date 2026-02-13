# Add SSH key to server 90.156.227.169
# Run in PowerShell and enter server password when prompted.

$keyPath = Join-Path $env:USERPROFILE ".ssh\id_ed25519.pub"
$server = "root@90.156.227.169"

if (-not (Test-Path $keyPath)) {
    Write-Host "Key not found: $keyPath" -ForegroundColor Red
    exit 1
}

$key = (Get-Content $keyPath -Raw).Trim()

Write-Host "Adding key to $server ..." -ForegroundColor Cyan
Write-Host "Enter server password when ssh prompts." -ForegroundColor Yellow

$remoteCmd = "mkdir -p .ssh; chmod 700 .ssh; echo " + [char]39 + $key + [char]39 + " >> .ssh/authorized_keys; chmod 600 .ssh/authorized_keys; echo OK"

ssh -o StrictHostKeyChecking=accept-new $server $remoteCmd

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Done. You can now login without password: ssh $server" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Error. Check password and server availability." -ForegroundColor Red
}
