# ChatGPT Clone

A modern ChatGPT clone built with Next.js, Auth0, Google AI, and Supabase.

## Features

- User authentication with Auth0
- Real-time chat interface
- Powered by Google's Generative AI
- Chat history storage with Supabase
- Modern UI with Bootstrap

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/chatgpt-clone.git
cd chatgpt-clone
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with the following variables:
```
AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://your-tenant.auth0.com'
AUTH0_CLIENT_ID='your-client-id'
AUTH0_CLIENT_SECRET='your-client-secret'
GOOGLE_API_KEY='your-google-api-key'
NEXT_PUBLIC_SUPABASE_URL='your-supabase-url'
NEXT_PUBLIC_SUPABASE_ANON_KEY='your-supabase-anon-key'
```

4. Set up Supabase:
- Create a new Supabase project
- Run the SQL commands in the SQL editor to create the necessary tables
- Enable Row Level Security and create the required policies

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- Next.js 14
- Auth0 for authentication
- Google Generative AI
- Supabase for database
- Bootstrap for styling
- TypeScript for type safety

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
