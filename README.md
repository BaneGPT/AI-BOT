# Claude Chat - AI Chatbot with Authentication

A full-stack Next.js 14 chatbot application with user authentication, chat history, and Anthropic Claude API integration. Ready to deploy on Vercel.

## 🚀 Features

- **Authentication**: Secure email/password auth with NextAuth.js v5
- **Chat History**: Persistent conversations stored in PostgreSQL
- **Real-time Chat**: Stream responses from Claude 3 Haiku
- **Responsive UI**: Works on desktop and mobile
- **Dark Mode**: Automatic system preference detection
- **TypeScript**: Full type safety throughout

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Auth**: NextAuth.js v5 with Credentials provider
- **Database**: PostgreSQL with Prisma ORM
- **AI**: Anthropic Claude 3 Haiku API
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (recommended)

## 📦 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd claude-chatbot
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- `ANTHROPIC_API_KEY` - Get from [Anthropic Console](https://console.anthropic.com/)

### 3. Set Up Database

```bash
# Push schema to database
npx prisma db push

# Optional: View database in browser
npx prisma studio
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/claude-chatbot.git
git push -u origin main
```

### 2. Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings

### 3. Configure Environment Variables in Vercel

In your Vercel project settings → Environment Variables, add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_URL` | Your PostgreSQL connection string | Production, Preview, Development |
| `NEXTAUTH_SECRET` | Your generated secret | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Production |
| `ANTHROPIC_API_KEY` | Your Anthropic API key | Production, Preview, Development |

### 4. Set Up Database (Choose One)

**Option A: Vercel Postgres (Recommended)**
1. In Vercel dashboard → Storage → Create Database → Postgres
2. Connect to your project
3. Copy the connection string to `DATABASE_URL`

**Option B: Neon (Free Tier)**
1. Create account at [neon.tech](https://neon.tech)
2. Create project → Copy connection string
3. Add to Vercel environment variables

**Option C: Supabase**
1. Create project at [supabase.com](https://supabase.com)
2. Settings → Database → Copy connection string
3. Add to Vercel environment variables

**Option D: Railway**
1. Create project at [railway.app](https://railway.app)
2. Add PostgreSQL → Copy connection string
3. Add to Vercel environment variables

### 5. Deploy

Vercel will automatically deploy on push to main. The `postinstall` script runs `prisma generate` automatically.

## 📁 Project Structure

```
claude-chatbot/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/  # NextAuth endpoints
│   │   │   ├── chat/                # Chat completion endpoint
│   │   │   ├── chats/               # Chat CRUD operations
│   │   │   └── register/            # User registration
│   │   ├── chat/                    # Chat page (protected)
│   │   ├── signin/                  # Sign in page
│   │   ├── signup/                  # Sign up page
│   │   ├── globals.css              # Global styles
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Landing page
│   │   └── providers.tsx            # Session provider
│   ├── auth.ts                      # NextAuth configuration
│   ├── components/
│   │   ├── AuthForm.tsx             # Sign in/up form
│   │   └── ChatInterface.tsx        # Main chat UI
│   ├── lib/
│   │   ├── prisma.ts                # Prisma client
│   │   └── utils.ts                 # Utility functions
│   └── middleware.ts                # Route protection
├── .env.example                     # Environment template
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## 🔧 Customization

### Change AI Model

Edit `src/app/api/chat/route.ts`:

```typescript
const completion = await anthropic.messages.create({
  model: 'claude-3-sonnet-20240229', // or claude-3-opus-20240229
  max_tokens: 4000,
  messages: anthropicMessages,
})
```

### Add OAuth Providers

Edit `src/auth.ts` to add Google, GitHub, etc.:

```typescript
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'

providers: [
  Credentials({...}),
  Google({ clientId: ..., clientSecret: ... }),
  GitHub({ clientId: ..., clientSecret: ... }),
]
```

### Styling

Modify `tailwind.config.ts` for custom colors, fonts, etc.

## 🔒 Security Notes

- Passwords are hashed with bcrypt (cost factor 12)
- JWT sessions with secure cookies
- CSRF protection via NextAuth
- API routes protected by middleware
- Environment variables never exposed to client

## 📝 License

MIT License - feel free to use for personal or commercial projects.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

- Check [Vercel Deployment Docs](https://vercel.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Anthropic API Docs](https://docs.anthropic.com)