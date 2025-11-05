```mermaid
flowchart LR
  subgraph Client[Frontend: Next.js + Clerk]
    A[Sign Up / Sign In] -->|JWT| B[Dashboard]
    B -->|GET /api/users/me| API
    B -->|GET /api/referrals/stats| API
    B -->|POST /api/purchases| API
    B -->|POST /api/users/init| API
    B -->|POST /api/referrals/bind (r=code)| API
  end

  subgraph API[Backend: Express + Mongoose]
    API -->|verify Clerk JWT| Auth[Auth Middleware]
    Auth --> Users
    Auth --> Referrals
    Auth --> Purchases

    subgraph DB[(MongoDB Atlas)]
      Users[(Users)]
      Referrals[(Referrals)]
      Purchases[(Purchases)]
    end

    Purchases -->|Tx| Referrals
    Users -->|Tx| Referrals
    Users -->|Tx| Purchases
  end
