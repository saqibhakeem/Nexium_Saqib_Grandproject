#!/bin/bash

# 🍳 AI Recipe Generator - Quick Setup Script
# Run this script to set up your development environment

echo "🍳 Setting up AI Recipe Generator..."
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "🔧 Creating environment configuration..."
    cat > .env.local << EOL
# Supabase Configuration (Replace with your values)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=recipe_generator

# n8n Webhook Configuration
N8N_WEBHOOK_URL=your_n8n_webhook_url
N8N_API_KEY=your_n8n_api_key

# Email Service (for Magic Links)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password

# Security
JWT_SECRET=your_jwt_secret_key_change_this_in_production
MAGIC_LINK_SECRET=your_magic_link_secret_change_this
NEXTAUTH_SECRET=your_nextauth_secret_change_this
NEXTAUTH_URL=http://localhost:3000

# AI Service Keys
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
EOL
    
    echo "✅ Created .env.local file"
    echo "⚠️  IMPORTANT: Update .env.local with your actual API keys and URLs"
else
    echo "✅ .env.local already exists"
fi

# Create additional directories if they don't exist
mkdir -p src/components/{ui,auth,recipe,layout}
mkdir -p src/hooks
mkdir -p src/lib
mkdir -p tests/{unit,integration,e2e,__mocks__}
mkdir -p api/{auth,recipes,user,database}
mkdir -p ai/{workflows,prompts,services,testing}

echo "📁 Created project directories"

# Build the project to check for errors
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Setup complete! Next steps:"
    echo "=================================="
    echo "1. Update .env.local with your API keys"
    echo "2. Start development server: npm run dev"
    echo "3. Open http://localhost:3000"
    echo ""
    echo "📚 Documentation:"
    echo "- PRD: docs/PRD.md"
    echo "- Wireframes: docs/wireframes.md"
    echo "- Roadmap: docs/roadmap.md"
    echo ""
    echo "🎯 Current Milestone: Backend & Database Setup (Day 16-18)"
    echo "Good luck with your internship project! 🍀"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
