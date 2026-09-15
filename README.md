# JobZing Frontend

React + Vite frontend wired to the JobZing Express backend.

## Run

```bash
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_URL` to your deployed backend API root, for example:

`https://your-backend.example.com/api`

## Backend features connected

- Register / login / current user / logout
- Jobs: listing, filters, pagination, search, job details, external JSearch jobs
- Companies: listing, search, details
- Bookmarks
- Notifications
- Search history
- Profile editing
- Resume PDF analysis with Gemini-backed results
- AI job matching against resume skills
- AI job recommendations

## Backend note

The supplied bookmark routes are not protected by the backend's `protect` middleware. The UI includes bookmark functionality, but user-level security for bookmarks should be fixed in the backend before production use.
