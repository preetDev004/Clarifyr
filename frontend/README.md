# Frontend Application

A Next.js application with Clerk authentication and webhook integration.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- ngrok for local webhook testing
- Clerk account and project setup

## Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

3. Configure your environment variables:

```env
NEXT_PUBLIC_API_URL=your_api_url
CLERK_WEBHOOK_SECRET=your_webhook_secret
```

## Installation

```bash
npm install
# or
yarn install
```

## Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Clerk Webhook Setup with ngrok

1. Install ngrok:

```bash
brew install ngrok
```

2. Configure ngrok with your auth token:

```bash
ngrok config add-authtoken 2uTEB5drSklF7UaX4BqSp93oLOC_5LvoqH49k5S4oqC8SVQUz
```

3. Start ngrok tunnel:

```bash
ngrok http 3000
```

4. Update Clerk webhook settings:
   - Go to Clerk Dashboard
   - Navigate to Webhooks
   - Add new webhook endpoint using your ngrok URL
   - Example: `https://your-ngrok-url/api/webhooks/clerk`
   - Copy the Signing Secret and update your `.env` file's `CLERK_WEBHOOK_SECRET`

## Webhook Testing

The webhook endpoint is configured to handle Clerk events at:

```
/api/webhooks/clerk
```

Supported events:

- `session.created` - Creates new user record in database

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   └── api/
│   │       └── webhooks/
│   │           └── clerk/
│   │               └── route.ts   # Webhook handler
│   └── ...
├── .env.example
├── .env
└── ...
```

## Development Workflow

1. Make sure your development server is running
2. Start ngrok tunnel for webhook testing
3. Update Clerk webhook URL if ngrok URL changes
4. Test webhook functionality using Clerk Dashboard

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [ngrok Documentation](https://ngrok.com/docs)
