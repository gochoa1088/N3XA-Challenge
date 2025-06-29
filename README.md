# N3XA Support - AI-Powered Customer Support System

A modern customer support application built with Next.js, React, Prisma, and OpenAI. The system features an AI assistant that helps customers create support tickets and a comprehensive admin dashboard for support agents to manage and respond to tickets.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/gochoa1088/N3XA-Challenge.git
cd n3xa-challenge
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

Add database URL to `.env`:

```env
DATABASE_URL=\"file:./dev.db\"
```

Add your OpenAI API key to `.env`:

```env
OPEN_AI_API_KEY=your_openai_api_key_here
```

Can provide API key if necessary

### 4. Database Setup

Initialize and run database migrations:

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

```

### 5. Start the Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).
