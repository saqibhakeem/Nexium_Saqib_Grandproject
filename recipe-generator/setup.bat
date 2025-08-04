@echo off
REM 🍳 AI Recipe Generator - Quick Setup Script (Windows)
REM Run this script to set up your development environment

echo 🍳 Setting up AI Recipe Generator...
echo ==================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js detected

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Create environment file if it doesn't exist
if not exist .env.local (
    echo 🔧 Creating environment configuration...
    (
        echo # Supabase Configuration ^(Replace with your values^)
        echo NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
        echo NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
        echo SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
        echo.
        echo # MongoDB Configuration
        echo MONGODB_URI=your_mongodb_connection_string
        echo MONGODB_DB_NAME=recipe_generator
        echo.
        echo # n8n Webhook Configuration
        echo N8N_WEBHOOK_URL=your_n8n_webhook_url
        echo N8N_API_KEY=your_n8n_api_key
        echo.
        echo # Email Service ^(for Magic Links^)
        echo SMTP_HOST=your_smtp_host
        echo SMTP_PORT=587
        echo SMTP_USER=your_smtp_username
        echo SMTP_PASS=your_smtp_password
        echo.
        echo # Security
        echo JWT_SECRET=your_jwt_secret_key_change_this_in_production
        echo MAGIC_LINK_SECRET=your_magic_link_secret_change_this
        echo NEXTAUTH_SECRET=your_nextauth_secret_change_this
        echo NEXTAUTH_URL=http://localhost:3000
        echo.
        echo # AI Service Keys
        echo OPENAI_API_KEY=your_openai_api_key
        echo ANTHROPIC_API_KEY=your_anthropic_api_key
    ) > .env.local
    
    echo ✅ Created .env.local file
    echo ⚠️  IMPORTANT: Update .env.local with your actual API keys and URLs
) else (
    echo ✅ .env.local already exists
)

REM Create additional directories if they don't exist
if not exist "src\components\ui" mkdir "src\components\ui"
if not exist "src\components\auth" mkdir "src\components\auth"
if not exist "src\components\recipe" mkdir "src\components\recipe"
if not exist "src\components\layout" mkdir "src\components\layout"
if not exist "src\hooks" mkdir "src\hooks"
if not exist "src\lib" mkdir "src\lib"
if not exist "tests\unit" mkdir "tests\unit"
if not exist "tests\integration" mkdir "tests\integration"
if not exist "tests\e2e" mkdir "tests\e2e"
if not exist "tests\__mocks__" mkdir "tests\__mocks__"
if not exist "api\auth" mkdir "api\auth"
if not exist "api\recipes" mkdir "api\recipes"
if not exist "api\user" mkdir "api\user"
if not exist "api\database" mkdir "api\database"
if not exist "ai\workflows" mkdir "ai\workflows"
if not exist "ai\prompts" mkdir "ai\prompts"
if not exist "ai\services" mkdir "ai\services"
if not exist "ai\testing" mkdir "ai\testing"

echo 📁 Created project directories

REM Build the project to check for errors
echo 🔨 Building project...
npm run build

if %errorlevel% equ 0 (
    echo ✅ Build successful!
    echo.
    echo 🚀 Setup complete! Next steps:
    echo ==================================
    echo 1. Update .env.local with your API keys
    echo 2. Start development server: npm run dev
    echo 3. Open http://localhost:3000
    echo.
    echo 📚 Documentation:
    echo - PRD: docs/PRD.md
    echo - Wireframes: docs/wireframes.md
    echo - Roadmap: docs/roadmap.md
    echo.
    echo 🎯 Current Milestone: Backend ^& Database Setup ^(Day 16-18^)
    echo Good luck with your internship project! 🍀
) else (
    echo ❌ Build failed. Please check the errors above.
    pause
    exit /b 1
)

pause
