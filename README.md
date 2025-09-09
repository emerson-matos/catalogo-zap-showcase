# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/846ec136-ef21-4d52-abb1-c59de32df7e3

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/846ec136-ef21-4d52-abb1-c59de32df7e3) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/846ec136-ef21-4d52-abb1-c59de32df7e3) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Google Sheets products (optional)

You can load products from a public Google Sheet. If not configured, the app falls back to local mock data in `src/data/products.ts`.

1) Publish or share your sheet as public (viewer). We support the Google Visualization API (`gviz`).

2) Create a `.env.local` with:

```env
VITE_GOOGLE_SHEETS_ID=your_spreadsheet_id
# One of the two below is required to select a worksheet
# If you know the numeric gid:
VITE_GOOGLE_SHEETS_GID=0
# Or if you prefer the sheet tab name:
# VITE_GOOGLE_SHEETS_SHEET=Products
# Optional: If you publish to web (File > Share > Publish to web > Link > Sheet > CSV)
# you can paste the direct CSV URL to bypass gviz entirely:
# VITE_GOOGLE_SHEETS_CSV_URL=https://docs.google.com/spreadsheets/d/<id>/pub?gid=0&single=true&output=csv
```

3) Expected column headers (case-insensitive; PT aliases supported):

- id (optional)
- name | nome
- description | descricao
- price | preco
- image | imagem (use a full URL)
- category | categoria
- rating (optional, number)
- isNew | is_new | novo (optional: 1/true/yes/sim)

No server needed; values are fetched client-side from:

```
https://docs.google.com/spreadsheets/d/${VITE_GOOGLE_SHEETS_ID}/gviz/tq?gid=${VITE_GOOGLE_SHEETS_GID}
```

Restart the dev server after changing env vars.

Troubleshooting CORS/redirects:

- Ensure the sheet is accessible without login. Open the URL above in an incognito window. If it redirects to accounts.google.com, it is not public.
- Alternative: use the published CSV URL (`VITE_GOOGLE_SHEETS_CSV_URL`) which typically serves with permissive headers suitable for client-side fetch.
