# Modern Pastebin Application

A secure, ephemeral pastebin clone built with **Next.js 15**, **Server Actions**, and **Vercel Postgres**. This application allows users to share code or text clips that self-destruct based on time or view limits.

## 🚀 How to Run Locally

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd pastebin-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory. You need a Postgres database connection string (you can use a local Postgres instance or a Vercel Postgres URL).
   ```env
   # Example for local development
   POSTGRES_URL="postgresql://user:password@localhost:5432/pastebin"
   ```

4. **Initialize the Database**
   This pushes the Prisma schema to your database.
   ```bash
   npx prisma db push
   ```

5. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🗄️ Persistence Layer

The application utilizes **Vercel Postgres** (managed PostgreSQL) as its primary data store.

- **ORM**: [Prisma](https://www.prisma.io/) is used for type-safe database interactions.
- **Why Postgres?**: Unlike key-value stores or simple file storage, Postgres allows us to perform atomic transactions. This is critical for the "Max Views" feature—we need to strictly enforce that the view counter increments reliably to prevent race conditions where a paste might be viewed more times than intended.

**Schema Overview:**
- `id`: Unique UUID.
- `slug`: Short, URL-friendly identifier (generated via `nanoid`).
- `content`: The text content of the paste.
- `views` & `maxViews`: Logic to handle the "Burn after reading" functionality.
- `expiresAt`: Timestamp for time-based expiration.

## 🎨 Design Decisions

### 1. **Server-Side Rendering (SSR) for Pastes**
The paste view page (`/p/[id]`) uses **React Server Components**.
- **Performance**: The content is fetched directly on the server, sending fully rendered HTML to the client. This is faster than client-side fetching and prevents "layout shift."
- **Expiration Logic**: Validation happens on the server *before* any content is sent. If a paste is expired, the server returns a 404/Expired state immediately, ensuring the sensitive content is never exposed to the client network tab.

### 2. **Ephemeral by Design**
The application is designed to be "privacy-first."
- View counts are updated transactionally.
- Expired pastes are inaccessible immediately.
- (Future enhancement: A Cron job would permanently delete expired rows from the DB to save space).

### 3. **Modern Styling**
- Built with **Tailwind CSS v4** for a clean, responsive interface.
- Includes a copy-to-clipboard utility and syntax highlighting-ready structure.
