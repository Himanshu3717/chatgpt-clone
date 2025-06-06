# ChatGPT Clone

A modern ChatGPT clone built with Next.js, Auth0, and Google's Generative AI.

## Features

- 🔐 Authentication with Auth0
- 🤖 AI-powered chat using Google's Generative AI
- 💅 Modern UI with Bootstrap
- ⚡ Real-time responses
- 🔒 Secure API key handling

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Himanshu3717/chatgpt-clone.git
cd chatgpt-clone
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with the following variables:
```
AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://YOUR_AUTH0_DOMAIN'
AUTH0_CLIENT_ID='YOUR_AUTH0_CLIENT_ID'
AUTH0_CLIENT_SECRET='YOUR_AUTH0_CLIENT_SECRET'
GOOGLE_API_KEY='YOUR_GOOGLE_API_KEY'
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- Next.js 14
- Auth0 for authentication
- Google Generative AI
- Bootstrap for styling
- TypeScript

## License

MIT

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

https://your-deployment-link.vercel.app

Allowed Callback URLs:
http://localhost:3001/api/auth/callback

Allowed Logout URLs:
http://localhost:3001

Allowed Web Origins:
http://localhost:3001
