# Recipes App

This project is a React TypeScript application built with Vite.

## Available Scripts

In the project directory, you can run:

### `npm run dev` or `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner using Vitest.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm run preview`

Locally previews the production build.

## Vite Configuration

This project uses Vite for fast development and optimized production builds. Key features include:

- Fast hot module replacement (HMR)
- Optimized builds with automatic code splitting
- TypeScript support with SWC
- Improved test experience with Vitest

## Environment Variables

Environment variables should be prefixed with `VITE_` instead of `REACT_APP_`. For example:

```
VITE_API_KEY=your_api_key
```

These can be accessed in your code with:

```typescript
import.meta.env.VITE_API_KEY
```

## Learn More

To learn more about the technologies used in this project:

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
