# Enzo Birthday Invite

Mobile-first Next.js invitation site for Enzo's 22nd birthday on November 12.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

On this WSL workspace, a local Node runtime is available at `.tools/node`. If your default WSL Node is old, run:

```bash
PATH=/home/epereira/enzo-birthday/.tools/node/bin:$PATH npm run dev
```

## RSVP email

Copy `.env.example` to `.env.local` and add your Resend key:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
RSVP_TO_EMAIL=enzo.pereira60200@gmail.com
RSVP_FROM_EMAIL="Enzo RSVP <onboarding@resend.dev>"
ADMIN_PASSWORD=your-admin-password
```

Resend requires a verified sender domain for production. The local JSON backup is stored in `data/rsvps.json`.

## Replace placeholders

- Teaser video: put your file in `public/videos/teaser.mp4` and update `VIDEO_SRC` in `lib/event-config.ts`.
- Gallery images: replace files in `public/gallery/` or update `GALLERY_ITEMS` in `lib/event-config.ts`.
- Event details: edit `lib/event-config.ts`.
# birthday
