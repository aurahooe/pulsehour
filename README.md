# Pulsehour

A small public wall that turns over every hour.

- Magic-link login via Supabase
- Private and public writing
- Public pieces appear on `/wall`
- Home features one piece for the current UTC hour

## Local

```
npm i
cp .env.example .env.local
# fill keys
npm run dev
```

Set the Supabase Auth redirect URL to `http://localhost:3000/auth/callback` and your production origin + `/auth/callback`.
