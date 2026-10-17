# ChatGoAI

A React + Vite chat workspace with an Express, MongoDB, and Gemini backend.

Run `npm run dev` in `backend` and `frontend`, then open http://localhost:5173. Preserve the existing private environment files. The frontend uses `VITE_API_BASE_URL` and `VITE_GOOGLE_CLIENT_ID`.

The public homepage is `/`; the protected workspace is `/chat`. Existing conversation links remain supported. Theme selection persists locally. Search, pin/archive/restore, sharing, and invitations use the existing APIs; some actions require email verification.

Validation: frontend lint and production build, backend syntax checks, local HTTP serving, and focused authentication middleware checks passed. Browser attachment timed out; visual layouts, theme persistence, mobile interactions, and live Gemini/Google/email/database workflows still need manual verification.

Manual review: check all routes at mobile, tablet, and desktop widths in both themes. Exercise authentication, shared-link redirects, chat streaming, copying, search, pin/archive/restore, sharing, invitations, and recovery with a test account.
