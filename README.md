# Project Source Code Documentation
#Check app here : https://imaginative-brigadeiros-d6e0e2.netlify.app/
## Project Overview
This project is built using **Vue 3**, **TypeScript**, and **Vite**. It is a frontend application that follows modern development practices.

## File Structure
```
├── .env                  # Environment variables
├── .gitignore            # Git ignore file
├── index.html            # Main HTML file
├── package.json          # Project metadata and dependencies
├── package-lock.json     # Lockfile for dependencies
├── README.md             # Project documentation
├── tsconfig.json         # TypeScript configuration
├── tsconfig.app.json     # TypeScript config for application
├── tsconfig.node.json    # TypeScript config for Node.js
├── vite.config.ts        # Vite configuration file
└── src/                  # Source code directory
    ├── main.ts          # Entry file
    ├── App.vue          # Root Vue component
    ├── components/      # Reusable Vue components
    ├── views/           # Application pages
    ├── router/          # Vue Router configuration
    ├── store/           # State management (if applicable)
    ├── assets/          # Static assets (images, styles, etc.)
    ├── composables/     # Reusable logic using Vue Composition API
    ├── utils/           # Utility functions
    ├── types/           # TypeScript type definitions
```

## Environment Variables (`.env`)
Contains sensitive API keys and other environment-specific settings:
```
VITE_OPENROUTER_API_KEY=your-api-key-here
```

## Dependencies (`package.json`)
```json
{
  "dependencies": {
    "vue": "^3.4.38",
    "axios": "^1.6.7",
    "vue-router": "^4.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.24",
    "@vitejs/plugin-vue": "^5.1.3",
    "typescript": "^5.5.3",
    "vite": "^5.4.2",
    "vue-tsc": "^2.1.4"
  }
}
```

## Build and Run Commands
- **Start Development Server:** `npm run dev`
- **Build for Production:** `npm run build`
- **Preview Build:** `npm run preview`

## Configuration Files
- **`vite.config.ts`**: Configuration for Vite bundler.
- **`tsconfig.json`**: Main TypeScript configuration.
- **`tsconfig.app.json`**: TypeScript config for the application.
- **`tsconfig.node.json`**: TypeScript config for Node.js-specific scripts.

## Additional Notes
- This project uses Vue 3's `<script setup>` for better performance and maintainability.
- TypeScript is enforced to catch potential type errors early.
- Uses Vue Router for navigation.

For more details, refer to the `README.md` file.
