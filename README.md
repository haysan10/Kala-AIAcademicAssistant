# Kala - AI Academic Assistant

<p align="center">
    <img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Kala Logo">
</p>

<p align="center">
    <a href="https://laravel.com" target="_blank">
        <img src="https://img.shields.io/badge/Backend-Laravel_11-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel 11">
    </a>
    <a href="https://react.dev" target="_blank">
        <img src="https://img.shields.io/badge/Frontend-Inertia_React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="Inertia React">
    </a>
    <a href="https://grok.x.ai" target="_blank">
        <img src="https://img.shields.io/badge/AI_Engine-xAI_Grok-000000?style=for-the-badge&logo=x&logoColor=white" alt="xAI Grok">
    </a>
    <a href="https://turso.tech" target="_blank">
        <img src="https://img.shields.io/badge/Database-Turso_(LibSQL)-00E599?style=for-the-badge" alt="Turso Database">
    </a>
</p>

## 📚 About Kala

**Kala** ("Time" in Sanskrt/Indonesian) is an **AI-powered Academic Assistant** designed to help students overcome academic anxiety and procrastination.

Unlike traditional to-do lists, Kala doesn't just list your tasks—it **understands** them. By leveraging the power of **xAI Grok**, Kala analyzes your assignment documents, breaks them down into manageable milestones, and creates a structured study plan tailored to your deadlines.

> *"Don't just track your assignments. Crush them."*

## ✨ Key Features

### 🧠 **AI Ingestion Engine**
Upload your assignment sheets in **PDF**, **DOCX**, or **Text** format. Kala automatically reads the file, extracting crucial details like:
- Title & Description
- Hard Deadlines
- Grading Rubrics & Requirements

### 📅 **Intelligent Planning**
Stop wondering "where do I start?". Kala generates a step-by-step roadmap:
- **Milestone Breakdown**: Splits complex assignments into logical phases.
- **Task Estimation**: Provides realistic time estimates for every sub-task.
- **Auto-Scheduling**: Suggests when to work on what based on your deadline.

### 🤖 **Context-Aware AI Tutor**
Stuck on a specific task? Chat with the **AI Tutor** right inside the assignment page. The tutor is "context-aware"—it knows exactly what assignment you are working on and can answer questions based on the uploaded documents.

### 📊 **Smart Dashboard**
- **At-Risk Alerts**: Instantly see which assignments need immediate attention.
- **Progress Tracking**: Visual indicators of how far you are from completion.
- **Focus Mode**: A distraction-free environment to tick off tasks.

### 📝 **Mastery Assessment**
Before you submit, Kala can generate a **Quiz** based on your assignment topic to test your understanding, ensuring you're fully prepared.

## 🛠️ Tech Stack

- **Framework**: [Laravel 11](https://laravel.com)
- **Frontend**: [Inertia.js](https://inertiajs.com) with [React](https://react.dev)
- **Database**: [Turso](https://turso.tech) (LibSQL driver via `turso-driver-laravel`)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **AI Service**: [xAI Grok API](https://grok.x.ai) (via Vercel AI SDK)
- **Deployment**: Vercel (PHP Runtime)

## 🚀 Getting Started

### Prerequisites
- PHP 8.2+
- Node.js & NPM
- Composer
- A Turso Database URL & Auth Token
- An xAI (Grok) API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/haysan10/Kala-AssistStudy.git
   cd Kala-AssistStudy
   ```

2. **Install Dependencies**
   ```bash
   composer install
   npm install
   ```

3. **Environment Setup**
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your credentials:
   ```env
   DB_CONNECTION=libsql
   DB_DATABASE=libsql://your-db-url.turso.io
   DB_AUTH_TOKEN=your-turso-auth-token

   GROK_API_KEY=your-grok-api-key
   ```

4. **Run Migrations**
   ```bash
   php artisan migrate
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   # In a separate terminal
   php artisan serve
   ```

## 📂 Project Structure

- `app/Services/AI`: Contains logic for Parsing PDFs and Generating Study Plans.
- `resources/js/Pages`: React components for the frontend pages.
- `docs/`: Detailed development documentation, audit reports, and future plans.

## 📄 License

The Kala Application is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
