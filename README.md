## Takehome Frontend (Next.js)

This project is the Next.js counterpart to the NestJS backend in `takehome-backend`. It provides a simple but professional UI for the two personas (User A and User B) described in the take‑home assignment.

### Tech stack

- **Framework**: Next.js 14 (App Router) with React 18 and TypeScript
- **Styling**: Lightweight custom CSS with a dark theme
- **Integration**: Talks to the NestJS API via `fetch` with `credentials: 'include'` so that the HttpOnly auth cookie set by the backend is automatically sent with requests.

### Environment configuration

- API base URL is provided via `NEXT_PUBLIC_API_BASE_URL` in `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL="http://localhost:4000"
```

Adjust this if you host the backend elsewhere.

### Running the frontend

1. Install dependencies:

```bash
npm install
```

2. Run in development mode:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Persona flows

- **User A**
  - Registers/logs in on the left auth card (role is implied by the active persona toggle).
  - Submits company data (company name, number of users, number of products).
  - The UI shows the latest stored record and the computed percentage.

- **User B**
  - Switches the persona toggle to User B and logs in.
  - Pastes a User A ID (visible in the "Session snapshot" when User A is logged in).
  - Can:
    - Fetch the latest company input and image metadata for that User A.
    - Upload an image on behalf of that User A, which is persisted in the backend.

