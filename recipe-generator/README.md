# 🍳 AI-Powered Recipe Generator

> **Internship Project:** Grand Project - AI-Powered Web Application  
> **Duration:** 30 Days  
> **Tech Stack:** Next.js, TypeScript, Supabase, MongoDB, n8n, Vercel

## 📋 Project Overview

An intelligent web application that generates personalized recipes based on available ingredients, dietary preferences, and cooking constraints. Built with modern technologies and AI integration for a seamless cooking experience.

### 🎯 Key Features

- **🤖 AI Recipe Generation** - Powered by advanced language models via n8n workflows
- **🔐 Magic Link Authentication** - Passwordless login with email verification
- **🎨 Responsive Design** - Mobile-first UI with Tailwind CSS
- **💾 Smart Storage** - Supabase for user data, MongoDB for recipes
- **⚡ Real-time Updates** - Live recipe generation and saving
- **🔍 Advanced Filtering** - Dietary preferences, cuisine types, cooking time

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/recipe-generator.git
cd recipe-generator

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
recipe-generator/
├── 📂 docs/                    # Day 15: PRD + Wireframes
│   ├── PRD.md                  # Product Requirements Document
│   └── wireframes.md           # UI/UX Design Specifications
├── 📂 api/                     # Day 18: Backend & Database
│   ├── auth/                   # Authentication endpoints
│   ├── recipes/                # Recipe management APIs
│   └── database/               # Database schemas & migrations
├── 📂 ai/                      # Day 22-24: AI Logic & n8n
│   ├── workflows/              # n8n workflow configurations
│   ├── prompts/                # AI prompt templates
│   └── testing/                # AI integration tests
├── 📂 src/
│   ├── 📂 app/                 # Next.js App Router
│   │   ├── api/                # API routes
│   │   ├── auth/               # Auth pages
│   │   ├── recipes/            # Recipe pages
│   │   └── profile/            # User profile
│   ├── 📂 components/          # Reusable UI components
│   ├── 📂 lib/                 # Utility functions
│   └── 📂 hooks/               # Custom React hooks
├── 📂 public/                  # Static assets
└── 📂 tests/                   # Test suites
```

## 🛠️ Technology Stack

### Frontend

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State Management:** React Context + Hooks
- **UI Components:** Custom component library

### Backend

- **API:** Next.js API Routes
- **Authentication:** Supabase Auth (Magic Links)
- **Database:** Supabase (PostgreSQL) + MongoDB
- **File Storage:** Supabase Storage

### AI & Automation

- **Workflow Engine:** n8n
- **AI Models:** OpenAI GPT-4 / Anthropic Claude
- **Recipe Processing:** Custom validation logic

### Infrastructure

- **Hosting:** Vercel
- **CI/CD:** GitHub Actions → Vercel
- **Monitoring:** Vercel Analytics
- **Domain:** Custom domain via Vercel

## 📅 Development Timeline

| Milestone              | Date   | Status         | Deliverable    |
| ---------------------- | ------ | -------------- | -------------- |
| **PRD + Wireframes**   | Day 15 | ✅ Complete    | `/docs/`       |
| **Backend & DB Setup** | Day 18 | 🔄 In Progress | `/api/`        |
| **Frontend UI**        | Day 21 | 📅 Planned     | `/app/`        |
| **AI Logic + Testing** | Day 24 | 📅 Planned     | `/ai/`         |
| **Public Demo Live**   | Day 27 | 📅 Planned     | Production URL |
| **Docs + Loom**        | Day 29 | 📅 Planned     | `README.md`    |
| **Final Demo**         | Day 30 | 📅 Planned     | Presentation   |

## 🎨 Design System

### Color Palette

- **Primary:** Orange (#F97316) - Energy, creativity, appetite
- **Secondary:** Blue (#3B82F6) - Trust, technology
- **Success:** Green (#10B981) - Fresh, healthy
- **Background:** Light (#FEFEFE) / Dark (#111827)

### Typography

- **Headings:** Geist Sans (Bold)
- **Body:** Geist Sans (Regular)
- **Code:** Geist Mono

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
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
JWT_SECRET=your_jwt_secret_key
MAGIC_LINK_SECRET=your_magic_link_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# AI Service Keys
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect GitHub Repository**

   ```bash
   # Push to GitHub
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**

   - Visit [vercel.com](https://vercel.com)
   - Import GitHub repository
   - Configure environment variables
   - Deploy automatically

3. **Custom Domain** (Optional)
   - Add custom domain in Vercel dashboard
   - Configure DNS settings
   - Enable HTTPS

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🧪 Testing

### Run Tests

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

### Test Structure

```
tests/
├── unit/           # Component and utility tests
├── integration/    # API and database tests
├── e2e/           # End-to-end user flows
└── __mocks__/     # Mock data and services
```

## 📊 Performance Metrics

### Target Metrics

- **Page Load Speed:** < 3 seconds
- **API Response Time:** < 2 seconds
- **Recipe Generation:** < 10 seconds
- **Mobile Performance:** 90+ Lighthouse score
- **Accessibility:** WCAG 2.1 AA compliance

### Monitoring

- **Vercel Analytics:** Real-time performance monitoring
- **Error Tracking:** Automatic error logging
- **User Analytics:** Usage patterns and behavior

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

### Code Standards

- **ESLint:** Automated linting
- **Prettier:** Code formatting
- **TypeScript:** Type safety
- **Conventional Commits:** Consistent commit messages

## 📋 API Documentation

### Authentication Endpoints

```
POST /api/auth/magic-link    # Send magic link
GET  /api/auth/verify        # Verify magic link
POST /api/auth/logout        # Logout user
```

### Recipe Endpoints

```
POST /api/recipes/generate   # Generate new recipe
GET  /api/recipes/saved      # Get saved recipes
POST /api/recipes/save       # Save recipe
DELETE /api/recipes/{id}     # Delete recipe
```

### User Endpoints

```
GET  /api/user/profile       # Get user profile
PUT  /api/user/preferences   # Update preferences
```

## 🔧 Troubleshooting

### Common Issues

**Build Errors:**

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**Database Connection:**

```bash
# Check environment variables
echo $MONGODB_URI
echo $NEXT_PUBLIC_SUPABASE_URL
```

**Authentication Issues:**

```bash
# Verify Supabase configuration
# Check magic link email delivery
# Validate JWT tokens
```

## 📚 Documentation

### Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.io/docs)
- [n8n Documentation](https://docs.n8n.io)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Project Documentation

- 📖 [Product Requirements Document](./docs/PRD.md)
- 🎨 [Wireframes & Design](./docs/wireframes.md)
- 🔌 [API Documentation](./api/README.md)
- 🤖 [AI Integration Guide](./ai/README.md)

## 📄 License

This project is part of an internship program and is intended for educational purposes.

## 👥 Team

**Developer:** [Your Name]  
**Role:** Full-Stack Developer Intern  
**Duration:** 30-Day Sprint  
**Supervisor:** [Supervisor Name]

## 🏆 Project Goals

### Learning Objectives

- ✅ Modern web development with Next.js 15
- ✅ TypeScript for type-safe development
- ✅ Database design and integration
- 🔄 AI/ML integration in web applications
- 🔄 Authentication and security best practices
- 🔄 Deployment and DevOps workflows

### Deliverables

- ✅ Functional web application
- ✅ Complete documentation
- 🔄 Live demo deployment
- 🔄 Video walkthrough
- 🔄 Final presentation

---

**Project Status:** 🔄 Day 15 - PRD & Wireframes Complete  
**Next Milestone:** Backend & Database Setup (Day 18)  
**Demo URL:** [Coming Soon - Day 27]

Made with ❤️ during internship at [Company Name]
