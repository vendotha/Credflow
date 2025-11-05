flowchart LR
  subgraph Client[Frontend: Next.js + Clerk]
    A[Sign Up / Sign In] -->|JWT| B[Dashboard]
    B -->|GET /api/users/me| API
    B -->|GET /api/referrals/stats| API
    B -->|POST /api/purchases| API
    B -->|POST /api/users/init| API
    B -->|POST /api/referrals/bind| API
  end

  subgraph API[Backend: Express + Mongoose]
    API -->|verify Clerk JWT| Auth[Auth Middleware]
    Auth --> Users
    Auth --> Referrals
    Auth --> Purchases

    subgraph DB[(MongoDB Atlas)]
      U[(Users)]
      R[(Referrals)]
      P[(Purchases)]
    end

    Users --> U
    Referrals --> R
    Purchases --> P

    Purchases -->|Transaction| Referrals
    Users -->|Transaction| Referrals
    Users -->|Transaction| Purchases
  end
