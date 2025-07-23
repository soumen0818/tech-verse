# TechVerse Connect 🚀

<div align="center">
  <img src="https://img.shields.io/badge/TechVerse-Connect-blue?style=for-the-badge&logo=rocket" alt="TechVerse Connect" />
  <img src="https://img.shields.io/badge/Version-1.0.0-green?style=for-the-badge" alt="Version" />
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status" />
</div>

<p align="center">
  <strong>Your ultimate destination for technology news, insightful discussions, and a thriving community of tech enthusiasts.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## ✨ Features

### 🏠 **Core Features**
- **📰 Latest Tech News**: Curated technology news from trusted sources with AI-powered summaries
- **💬 Discussion Forums**: Engage in meaningful conversations with tech professionals
- **👥 Community Management**: Create and join specialized tech communities
- **😄 Tech Memes**: Share and enjoy technology-related humor
- **⚡ Quick News**: 24-hour tech news summaries for busy professionals
- **🔍 Smart Search**: Powerful search across all content types

### 🎯 **User Experience**
- **🔐 Secure Authentication**: Support for email, Google, and GitHub sign-in
- **👤 User Profiles**: Customizable profiles with social links and bio
- **📊 Personal Dashboard**: Track your posts, communities, and engagement
- **🔔 Real-time Updates**: Live notifications and content updates
- **🎨 Modern UI**: Beautiful, responsive design with dark/light mode support

### 🛡️ **Admin & Moderation**
- **⚙️ Admin Dashboard**: Comprehensive site management and analytics
- **🛠️ Content Moderation**: AI-powered content filtering and manual moderation
- **📈 Analytics**: User engagement metrics and trending content insights
- **🔧 User Management**: Role-based access control (Admin, Moderator, User)

---

## 🛠️ Tech Stack

### **Frontend**
- **⚛️ React 18** - Modern UI library with hooks
- **📘 TypeScript** - Type-safe JavaScript development
- **⚡ Vite** - Lightning-fast build tool and development server
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🧩 Shadcn/ui** - Beautiful and accessible UI components
- **🔄 React Query** - Powerful data fetching and caching

### **Backend & Database**
- **� Node.js & Express** - Fast and scalable backend server
- **🍃 MongoDB** - NoSQL database with flexible schema
- **� JWT Authentication** - Secure token-based authentication
- **🛡️ bcryptjs** - Password hashing and security
- **🌐 CORS** - Cross-origin resource sharing

### **Additional Tools**
- **📱 Progressive Web App** - Mobile-first responsive design
- **🎯 Lucide Icons** - Beautiful and consistent iconography
- **📝 Form Validation** - Robust form handling with validation
- **🎪 Animations** - Smooth transitions and micro-interactions

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm/yarn
- MongoDB Atlas account (or local MongoDB)
- Git for version control

### **Quick Start**

1. **Clone the repository**
   ```bash
   git clone https://github.com/soumen0818/tech-verse.git
   cd tech-verse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment variables
   cp .env.example .env
   
   # Add your MongoDB credentials
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   VITE_API_URL=http://localhost:5000/api
   ```

4. **MongoDB Setup**
   
   **Option A: Local MongoDB (Quick Start)**
   - MongoDB is already running on your system
   - Use: `MONGODB_URI=mongodb://localhost:27017/techverse`
   - ✅ **Ready to use immediately!**
   
   **Option B: MongoDB Atlas (Production)**
   - Create account at [MongoDB Atlas](https://cloud.mongodb.com/)
   - Create a new cluster
   - Get connection string and add to `.env`
   - **⚠️ Important**: Add your IP address to whitelist in Network Access

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   Frontend: http://localhost:8080
   Backend API: http://localhost:5000/api
   ```

### **Database Setup**

The application will automatically create the necessary collections when you start using it. No manual schema setup required!
4. Configure authentication providers (Google, GitHub)

---

## 📁 Project Structure

```
tech-verse/
├── 📁 public/                    # Static assets
├── 📁 src/                       # Source code
│   ├── 📁 components/            # Reusable UI components
│   │   ├── 📁 ui/               # Shadcn/ui components
│   │   ├── 📄 Header.tsx        # Navigation header
│   │   ├── 📄 PostCard.tsx      # Post display component
│   │   └── 📄 CreatePostDialog.tsx
│   ├── 📁 hooks/                # Custom React hooks
│   │   ├── 📄 useAuth.tsx       # Authentication logic
│   │   └── 📄 useSupabaseData.tsx # Data fetching
│   ├── 📁 pages/                # Application pages
│   │   ├── 📄 Index.tsx         # Landing page
│   │   ├── 📄 Dashboard.tsx     # User dashboard
│   │   ├── 📄 Community.tsx     # Communities page
│   │   ├── 📄 Admin.tsx         # Admin panel
│   │   └── 📄 Auth.tsx          # Authentication
│   ├── 📁 integrations/         # Third-party integrations
│   │   └── 📁 supabase/         # Supabase configuration
│   ├── 📁 types/                # TypeScript type definitions
│   └── 📁 lib/                  # Utility functions
├── 📁 supabase/                 # Database schema and functions
│   ├── 📁 migrations/           # Database migrations
│   └── 📁 functions/            # Edge functions
├── 📄 package.json              # Dependencies and scripts
├── 📄 tailwind.config.ts        # Tailwind configuration
├── 📄 vite.config.ts            # Vite configuration
└── 📄 README.md                 # This file
```

---

## 🌟 Key Components

### **Authentication System**
- Multi-provider authentication (Email, Google, GitHub)
- Secure session management
- Role-based access control
- User profile management

### **Content Management**
- Rich text post creation
- Category-based organization
- Image upload support
- Real-time content updates

### **Community Features**
- Community creation and management
- Member management
- Community-specific discussions
- Join/leave functionality

### **Admin Dashboard**
- User analytics and metrics
- Content moderation tools
- Community oversight
- System health monitoring

---

## 🚢 Deployment

### **Frontend Deployment**
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### **Supabase Functions**
```bash
# Deploy edge functions
supabase functions deploy tech-news-aggregator
supabase functions deploy ai-content-moderation
supabase functions deploy send-welcome-email
```

### **Environment Variables**
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SITE_URL=your_production_url
```

---

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

---

## 🔐 Security Features

- **Row Level Security (RLS)** - Database-level access control
- **Content Moderation** - AI-powered content filtering
- **Input Validation** - Comprehensive form validation
- **XSS Protection** - Sanitized user inputs
- **CSRF Protection** - Secure state management

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Supabase](https://supabase.io/) for the amazing backend platform
- [Shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide](https://lucide.dev/) for the icon library

---

<div align="center">
  <p><strong>Built with ❤️ for the tech community</strong></p>
  <p>
    <a href="https://github.com/soumen0818/tech-verse/issues">Report Bug</a> •
    <a href="https://github.com/soumen0818/tech-verse/issues">Request Feature</a>
  </p>
</div>
