---
sidebar_position: 3
---

# Coding in Next.js

APIs will be automatically generated when you create your database tables.

## Installation

```bash
yarn add @supabase/supabase-js
yarn add @supabase/auth-helpers-react @supabase/auth-helpers-nextjs
yarn add @supabase/auth-ui-react
```

## Collect 2 environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Supabase client sets the user **session** in local storage

```bash
{
  "expires_at": 1670748631,
  "expires_in": 3338,
  "token_type": "bearer",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjcwNzQ4NjMxLCJzdWIiOiJiYjJiYzliMS1mNmEyLTQ5MjEtYTIyYS05ODhiMjFjMDY0Y2QiLCJlbWFpbCI6ImlzYWFjbGlAbWFjLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnt9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNjcwNzQ1MDMxfV0sInNlc3Npb25faWQiOiI3NDQzNGY2MS0xZGYxLTRjMTgtOGI5ZC1hOWMxN2NjYWE3OTAifQ.0mcYEjLpRNjKeN-o-olT2LZohCFHGik2_EXZaGONRnk",
  "refresh_token": "pKmP8zQj2TG9O1ybUIx8Ew",
  "provider_token": null,
  "provider_refresh_token": null,
  "user": {
    "id": "bb2bc9b1-f6a2-4921-a22a-988b21c064cd",
    "aud": "authenticated",
    "email": "isaacli@mac.com",
    "phone": "",
    "app_metadata": {
      "provider": "email",
      "providers": [
        "email"
      ]
    },
    "user_metadata": {},
    "role": "authenticated",
    "aal": "aal1",
    "amr": [
      {
        "method": "password",
        "timestamp": 1670745031
      }
    ],
    "session_id": "74434f61-1df1-4c18-8b9d-a9c17ccaa790"
  }
}
```

Source : [Supabase docs : RLS](https://supabase.com/docs/learn/auth-deep-dive/auth-row-level-security), [YouTube](https://youtu.be/qY_iQ10IUhs), [Part 3 : Policies](https://supabase.com/docs/learn/auth-deep-dive/auth-policies), [YouTube](https://youtu.be/0LvCOlELs5U), [PostgeSQL Policies](https://www.postgresql.org/docs/12/sql-createpolicy.html), [PostgREST RLS](https://postgrest.org/en/v7.0.0/auth.html), [YouTube](https://youtu.be/0Fs96oZ4se0), [GitHub](https://github.com/supabase/supabase/tree/master/examples/user-management/nextjs-ts-user-management)

```bash
curl -X POST 'https://gyhtmyvqhywrkzulcrwa.supabase.co/rest/v1/running2' \
-H "apikey: SUPABASE_KEY" \
-H "Authorization: Bearer SUPABASE_KEY" \
-H "Content-Type: application/json" \
-H "Prefer: return=minimal" \
-d '{ "some_column": "someValue", "other_column": "otherValue" }'

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjcwODI2NjQ4LCJzdWIiOiJiYjJiYzliMS1mNmEyLTQ5MjEtYTIyYS05ODhiMjFjMDY0Y2QiLCJlbWFpbCI6ImlzYWFjbGlAbWFjLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnt9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNjcwODIzMDQ4fV0sInNlc3Npb25faWQiOiIyYWY3NmFkNy00MjNhLTRmYTUtYTc2MS05ZWI1MzJmMzhlY2UifQ.6YHkSNUzfrr9LAwNgEiipMxSCegeUnfvMRazygP1LUk
```

```js
const loggedInUserId = "d0714948"
let { data, error } = await supabase.from("users").select("user_id, name").eq("user_id", loggedInUserId)
```

```js
// auth.uid() extracts UID from JWT
user_id = auth.uid()
```

- your request will return the rows which pass the rule, even when you remove the filter from your middleware

```js
let { data, error } = await supabase.from("users").select("user_id, name")

// console.log(data)
// Still => { id: 'd0714948', name: 'Jane' }
```

```js
console.log(supabase.auth.signUp({ email, password }))

// the user access JWT is issued
console.log(
  supabase.auth.signIn({
    email: "lao.gimmie@gov.sg",
    password: "They_Live_1988!"
  })
)

// automatically plucks the access_token out of the URL and initiates a session
// retrieve the session to see if there is a valid session
console.log(supabase.auth.getSession())
```

&nbsp;

```bash
curl 'https://gyhtmyvqhywrkzulcrwa.supabase.co/rest/v1/jokes0?select=*' \
-H "apikey: SUPABASE_ANON_KEY" \
-H "Authorization: Bearer SUPABASE_ANON_KEY"
```

```js
const readLeaderboard = async () => {
  let { data, error } = await supabase.from("leaderboard").select("name, score").order("score", { ascending: false })

  if (error) {
    console.error(error)
    return
  }

  console.log(data)
}

// Writing
let { data, error } = await supabase.from("leaderboard").insert({ name: "Bob", score: 99999 })
```

- need to provide your site url in Auth > Settings on the dashboard. By default this is http://localhost:3000

```js
supabase.from("my_scores").select("*").then(console.log)
```

- only receive scores belonging to the current logged in user

```bash
curl 'https://sjvwsaokcugktsdaxxze.supabase.co/rest/v1/my_scores?select=*' \
-H "apikey: <ANON_KEY>" \
-H "Authorization: Bearer <ACCESS_TOKEN>"
```

Note that the anon key (or service role key) is always needed to get past the API gateway. This can be passed in the apikey header or in a query param named apikey. It is passed automatically in supabase-js as long as you used it to instantiate the client.

There are some more notes here on how to structure your schema to best integrate with the auth.users table.

Once you get the hang of policies you can start to get a little bit fancy. Let's say I work at Blizzard and I only want Blizzard staff members to be able to update people's high scores, I can write something like:

Supabase comes with two built-in helper functions: auth.uid() and auth.jwt().
