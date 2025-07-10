# JusFinn Frontend

## Project info

A modern React frontend for JusFinn AI Practice OS with Google OAuth integration.

## How can I edit this code?

You can use your preferred IDE or edit files directly in GitHub or Codespaces. The only requirement is having Node.js & npm installed.

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd jusfinn

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Set up environment variables
node setup_env.js

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Environment Configuration

### Development
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_NODE_ENV=development
```

### Production
```env
VITE_API_BASE_URL=https://api.jusfinn.com
VITE_NODE_ENV=production
```

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

You can deploy this project using your preferred deployment platform.

## Can I connect a custom domain?

Yes, you can! Follow your deployment platform's instructions to connect a custom domain.
