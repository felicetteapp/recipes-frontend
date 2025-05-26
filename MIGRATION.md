# Migration from Create React App to Vite

This project was migrated from Create React App (CRA) to Vite for improved performance and developer experience. Here's a summary of the changes made:

## Changes Made

1. **Package.json**:
   - Removed `react-scripts` dependency
   - Added Vite and related dependencies
   - Updated scripts to use Vite commands
   - Added `"type": "module"` for ESM support

2. **Configuration Files**:
   - Added `vite.config.ts` with appropriate plugins and settings
   - Updated `tsconfig.json` to be compatible with Vite
   - Added `tsconfig.node.json` for Vite config files
   - Created `vite-env.d.ts` for TypeScript environment declarations

3. **HTML Structure**:
   - Moved `index.html` from `/public` to the root directory
   - Updated HTML to use Vite's script loading approach
   - Updated paths for static assets

4. **Environment Variables**:
   - Renamed environment variables from `REACT_APP_*` to `VITE_*`
   - Updated code to use `import.meta.env.VITE_*` instead of `process.env.REACT_APP_*`

5. **Build Output**:
   - Configured Vite to output to the `build` directory (same as CRA)
   - Added chunk optimization for vendor libraries

6. **Testing**:
   - Switched from Jest to Vitest
   - Updated test configuration and setup files

7. **Static Files**:
   - Moved static files from `/public` to the root for Vite's public asset handling

## Benefits of Vite

- Much faster development server startup
- Instant hot module replacement
- Optimized production builds with better code splitting
- Modern ESM-based development
- Improved TypeScript support with faster compilation

## Known Issues

- Make sure all environment variables are properly updated in deployment environments
- Some third-party libraries might need updates or adjustments
