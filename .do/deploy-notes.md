# DigitalOcean Deployment Notes

## Build Dependencies

The application build process requires several tools that are in `devDependencies`:
- `vite` - Frontend bundler
- `esbuild` - Backend bundler  
- `typescript` - Type checking
- `tsx` - TypeScript execution

**This is intentional and correct!** DigitalOcean App Platform:
1. Installs ALL dependencies (including devDependencies) during build
2. Runs `npm run build` which uses the dev tools
3. Creates production artifacts in `dist/`
4. Strips devDependencies after build to reduce app size
5. Only ships `dependencies` + built artifacts to production

## Port Configuration

The app correctly uses `process.env.PORT` (see `server/index.ts` line 63):
```typescript
const port = parseInt(process.env.PORT || '5000', 10);
```

DigitalOcean will inject the PORT environment variable automatically.

## Static File Serving

In production mode, Express serves pre-built static files from `dist/public/`:
```typescript
// server/vite.ts line 70-85
export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
```

## No Database Required

This calculator app:
- Performs all calculations client-side
- Requires no database connection
- Stores no user data
- No environment secrets needed (except PORT)

## Build Output Structure

After `npm run build`:
```
dist/
├── index.js          # Bundled Express server (from esbuild)
└── public/           # Frontend assets (from vite)
    ├── index.html
    ├── assets/
    │   ├── *.js      # JavaScript bundles
    │   └── *.css     # Stylesheets
    └── ...
```

## Health Checks

The app responds to health checks at `/` (root path) which serves the calculator interface.
