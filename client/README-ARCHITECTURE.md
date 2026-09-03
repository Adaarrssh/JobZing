# JobZing Frontend Architecture

React + Vite frontend scaffold.

## Principles

- `api/` — backend communication only
- `components/` — reusable UI pieces
- `pages/` — route-level screens
- `layouts/` — page shells/layout wrappers
- `context/` — global React state
- `hooks/` — reusable React hooks
- `routes/` — application routing
- `styles/` — global styling/theme
- `utils/` — small frontend utilities
- `assets/` — static frontend assets

The backend is treated as an existing contract. Frontend API functions should be added without modifying the server.
