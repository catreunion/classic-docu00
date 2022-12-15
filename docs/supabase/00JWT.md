---
sidebar_position: 1
---

# JWT

## from JSON to encoded string

A **JSON object** looks something like this :

```bash
{
  "id": "bb2bc9b1-f6a2-4921-a22a-988b21c064cd",
  "first_name": "Isaac",
  "last_name": "Li",
  "email": "isaacli@mac.com",
  "expires_at": 1670748631,
}
```

JSON Web Tokens (JWTs) are JSON objects **encoded** using algorithm such as HS256, **signed** and sent around as a string.

Useful tools : [Encoder by Ant Wilson](https://replit.com/@awalias/jsonwebtokens#index.js), [JWT Debugger by jwt.io](https://jwt.io), [JWT Inspector by Tore Green](https://chrome.google.com/webstore/detail/jwt-inspector/jgjihoodklabhdoeffdjofnknfijolgk)

For example :

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjcwNzQ4NjMxLCJzdWIiOiJiYjJiYzliMS1mNmEyLTQ5MjEtYTIyYS05ODhiMjFjMDY0Y2QiLCJlbWFpbCI6ImlzYWFjbGlAbWFjLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnt9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNjcwNzQ1MDMxfV0sInNlc3Npb25faWQiOiI3NDQzNGY2MS0xZGYxLTRjMTgtOGI5ZC1hOWMxN2NjYWE3OTAifQ.0mcYEjLpRNjKeN-o-olT2LZohCFHGik2_EXZaGONRnk
```

A JWT is composed of 3 segments.

- **algorithm** used in encoding

- original **payload**

- **signature** ( for token verification )

## Authentication using Supabase

1. When a user signs up, Supabase creates a new record in the `auth.users` table.

2. Supabase sends a confirmation email to the address provided, with a link to complete the registration.

```text
<!-- link on a confirm email -->
https://gyhtmyvqhywrkzulcrwa.supabase.co/auth/v1/verify?token=712871994756d7b26587e09906216c86c0a113b642f76504b5626a73&type=signup&redirect_to=http://localhost:3000/

<!-- magic link on an email -->
https://gyhtmyvqhywrkzulcrwa.supabase.co/auth/v1/verify?token=6f91fa7888f47eca6b133d59036aa62ffc996eb3278a64797493df24&type=magiclink&redirect_to=http://localhost:3000
```

3. After clicing the link, **Supabase returns a JWT**, which contains the user's `id`, to the user for **authentication**.

```text
http://localhost:3000/#access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjE2NDI5MDY0LCJzdWIiOiI1YTQzNjVlNy03YzdkLTRlYWYtYThlZS05ZWM5NDMyOTE3Y2EiLCJlbWFpbCI6ImFudEBzdXBhYmFzZS5pbyIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIn0sInVzZXJfbWV0YWRhdGEiOnt9LCJyb2xlIjoiYXV0aGVudGljYXRlZCJ9.4IFzn4eymqUNYYo2AHLxNRL8m08G93Qcg3_fblGqDjo&expires_in=3600&refresh_token=RuioJv2eLV05lgH5AlJwTw&token_type=bearer&type=signup
```

- `http://localhost:3000/`

  - the **base url**

  - need to be updated when running in production

- `#access_token=...` - the **JWT** issued to the user

- `&expires_in=3600` - valid for 60 minutes

- `&refresh_token=RuioJv2eLV05lgH5AlJwTw` - get a new JWT before expires

- `&token_type=bearer` - use Bearer header in requests

- `&type=signup` - JWT issued for ... signup / login / password reset / magic link

Supabase issues **new JWTs** when users login again or when existing JWTs expire.

JWT-based authentication is **decentralized** : Anyone with the `jwt_secret` can verify a token without needing access to a centralized database.

**Postgres** inspects the user's JWT to determine does he has the right to access certain content. <-- **Authorization**

Useful tools : [RESTED browser client](https://chrome.google.com/webstore/detail/rested/eelcnbccaccipfolokglfhhmapdchbfg/related)

Source : [Supabase docs](https://supabase.com/docs/learn/auth-deep-dive/auth-deep-dive-jwts), [Supabase YouTube](https://youtu.be/v3Exg5YpJvE),

## Keys

### Anon Key

Stands for **anonymous public** API key

For developers to send along **API requests** when interacting with Supabase

Safe to put into client-side code <-- okay if end users see it

### Service Role Key

Has super admin rights and **bypass RLS**

Should only ever be used on your own servers or environments

**Never share**; **never put into client-side code**

Keep it private

### "If my anon key can be found in client-side code, then can't someone use the anon key to access my data?"

Yes, and this is where **Row Level Security** and **policies** come in.

Policies **restrict table access** to authenticated users based on their JWT roles and email domains

Data is protected
