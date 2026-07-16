# Implementation Plan - Revise Tech Ltd React & Python Migration

We will migrate the existing static website for **Revise Tech Ltd** into a modern, full-stack application.
- **Frontend**: A React application powered by **Vite** for fast, optimized, and component-driven UI development. We will preserve the high-fidelity neo-brutalist theme, animations, interactive counters, and custom form behaviors.
- **Backend**: A **FastAPI** (Python) service that handles portfolio data distribution and securely registers investor enquiries, logging them back to `enquiries.txt`.

This architecture separates concerns, enables real-time client-side interactivity without page reloads, and sets a modern foundation for future expansion.

---

## User Review Required

> [!IMPORTANT]
> **Subdirectory Architecture:**
> The code will be structured into two main subdirectories under the current folder `C:\Users\user\Documents\revise-tech-ltd`:
> 1. `backend/` for the Python FastAPI application.
> 2. `frontend/` for the React Vite application.
> This keeps the codebase organized and allows independent development.

> [!NOTE]
> **Enquiry Database Persistence:**
> The Python backend will continue to save enquiries to `enquiries.txt` in the root of the project (`C:\Users\user\Documents\revise-tech-ltd\enquiries.txt`) to preserve compatibility with any existing files.

---

## Open Questions

- We assume Python 3.8+ and Node.js 18+ are installed locally. If not, please let us know so we can adjust our setup commands.

---

## Proposed Changes

### Backend Component (FastAPI)

We will create a lightweight Python backend using **FastAPI** to manage project data and receive investor enquiries.

#### [NEW] [requirements.txt](file:///C:/Users/user/Documents/revise-tech-ltd/backend/requirements.txt)
Specifies python dependencies: `fastapi`, `uvicorn`, and `pydantic`.

#### [NEW] [main.py](file:///C:/Users/user/Documents/revise-tech-ltd/backend/main.py)
Configures the FastAPI app with:
- CORS middleware enabled for the React development server (`http://localhost:5173`).
- `GET /api/projects`: Serves the portfolio list (previously in `projects.js`).
- `POST /api/enquire`: Validates and saves investor contact details to `../enquiries.txt`.

---

### Frontend Component (React + Vite)

We will build the frontend using React and Vite. We will port the exact layout, colors, typography, and interactive components.

#### [NEW] [package.json](file:///C:/Users/user/Documents/revise-tech-ltd/frontend/package.json)
Standard Vite-React configuration.

#### [NEW] [index.html](file:///C:/Users/user/Documents/revise-tech-ltd/frontend/index.html)
Main mounting index, linking to Google Fonts (`Space Grotesk`, `Plus Jakarta Sans`).

#### [NEW] [src/index.css](file:///C:/Users/user/Documents/revise-tech-ltd/frontend/src/index.css)
Ports the full neo-brutalist theme CSS definitions, colors, responsive grid layouts, and custom button designs from the original stylesheet.

#### [NEW] [src/main.jsx](file:///C:/Users/user/Documents/revise-tech-ltd/frontend/src/main.jsx)
Standard React DOM mounting entry point.

#### [NEW] [src/App.jsx](file:///C:/Users/user/Documents/revise-tech-ltd/frontend/src/App.jsx)
Coordinates page rendering and maintains global states, including:
- Mobile navbar toggle state.
- Interactive filter selection for projects.
- Selected contact chips list for the message box.
- Asynchronously fetching project list from the FastAPI backend.
- Handlers for the async React form submission with loader state and success/error confirmation views.

#### [NEW] [src/components/Counter.jsx](file:///C:/Users/user/Documents/revise-tech-ltd/frontend/src/components/Counter.jsx)
A reusable React component that counts up to a target number when scrolled into view, replicating the exact `IntersectionObserver` counting logic from `projects.js`.

---

## Verification Plan

### Automated Tests
We will verify endpoints and application assembly:
- Run backend verification scripts to test API response payloads for `/api/projects` and submission logic for `/api/enquire`.

### Manual Verification
1. **API check:** Open `http://localhost:8000/docs` and test both endpoints.
2. **UI interaction check:**
   - Filter portfolio projects and verify card transition animations.
   - Scroll to Mondrian board and Case Studies to watch stats counters run up.
   - Click contact chips to append topics dynamically to the text area.
   - Submit the Investor Call enquiry form and confirm the inline confirmation screen.
   - Check that `C:\Users\user\Documents\revise-tech-ltd\enquiries.txt` is updated correctly.
