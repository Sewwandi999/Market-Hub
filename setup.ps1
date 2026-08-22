Write-Host "Installing MarketHub backend..."
Set-Location "$PSScriptRoot\server"
npm install

Write-Host "Installing MarketHub frontend..."
Set-Location "$PSScriptRoot\client"
npm install

Write-Host ""
Write-Host "Done."
Write-Host "Next:"
Write-Host "1. Copy server\.env.example to server\.env"
Write-Host "2. Configure MONGO_URI and JWT_SECRET"
Write-Host "3. cd server; npm run seed; npm run dev"
Write-Host "4. In another terminal: cd client; npm run dev"
