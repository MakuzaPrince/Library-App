# LibraryHub

LibraryHub is a modern, responsive library management frontend built with Vite, React, TypeScript, and Tailwind (shadcn-style components). It provides a clean dashboard for browsing books, managing borrow requests, tracking user activity, and simple account management UI.

This repository contains the client-side application (Vite + React). The app expects a backend API for authentication and library data; sample/mock data is included for local development.

## Key Features

- Responsive dashboard layout (desktop and mobile)
- Collapsible icon-only sidebar for compact navigation
- Book browsing, detail views, and simple borrow/return flows (UI only)
- Role-based UI (Admin / Librarian / Student)
- Reusable UI components built with Radix + Tailwind + shadcn patterns
- TypeScript for type safety and maintainability

## Getting Started

Prerequisites

- Node.js (>=16 LTS recommended)
- npm (or yarn / pnpm)

Install dependencies

```powershell
npm install
```

Run the development server

```powershell
npm run dev
```

Open the app in your browser (Vite will show the local URL, typically `http://localhost:5173` or the port shown in the terminal).

Build for production

```powershell
npm run build
```

Preview the production build

```powershell
npm run preview
```

Linting

```powershell
npm run lint
```

## Project Structure

- `src/` — application source code
	- `components/` — reusable UI components and layout (sidebar, cards, forms)
	- `pages/` — application pages (Dashboard, Books, Login, etc.)
	- `contexts/` — React context providers (Auth)
	- `lib/` — utility helpers
	- `types/` — shared TypeScript types
- `public/` — static assets (favicon, robots.txt)
- `index.html` — app entry

## Sidebar Behavior (notes)

The sidebar supports a collapsed (icon-only) mode on desktop and a sliding overlay on mobile. The collapsed state is persisted in `localStorage` so your preference survives navigation and reloads. Navigation clicks do not reopen the sidebar when it is collapsed — only the header toggle controls expanding/collapsing on desktop.

## Customization

- Tailwind configuration: `tailwind.config.ts`
- Vite configuration: `vite.config.ts`
- To change path aliases, update `tsconfig.json` `paths` and `vite.config.ts` `resolve.alias` (if present).

## Troubleshooting

- If you see a browserslist warning when running dev, update the database:

```powershell
npx update-browserslist-db@latest
```

- If CSS build errors reference `@import` ordering, make sure any `@import` rules appear before `@tailwind` directives in `src/index.css`.

## Contributing

1. Fork the repo
2. Create a feature branch
3. Open a pull request with a clear description of changes

## License

This project template does not include a license. Add a `LICENSE` file if you intend to publish or share the project.

---

If you want, I can further customize this README with deployment steps, environment variables for a backend API, or developer notes specific to this codebase. Tell me what you'd like included.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
