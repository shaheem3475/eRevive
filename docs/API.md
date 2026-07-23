# eRevive API

All private routes require `Authorization: Bearer <Firebase ID token>` and return `{ success, message, data }` on success or `{ success: false, message, errors }` on failure.

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/config/firebase` | Public Firebase web configuration |
| POST | `/api/auth/register` | Create/update a verified user profile |
| POST | `/api/auth/login` | Register verified login activity |
| POST | `/api/auth/logout` | Register logout activity |
| GET/PUT | `/api/user/profile` | Dashboard profile and profile updates |
| POST/GET | `/api/sell/request`, `/api/sell/history` | Server-valued sell requests/history |
| POST/GET | `/api/recycle/request`, `/api/recycle/history` | Recycling requests/history |
| POST/GET | `/api/donate/request`, `/api/donate/history` | Donation requests/history |
| GET/POST | `/api/rewards`, `/api/rewards/redeem` | Reward catalogue and redemption by `rewardId` |
| GET/PUT | `/api/notifications`, `/api/notifications/read` | User notifications |
| GET | `/api/admin/dashboard` | Admin-only aggregate metrics |

`POST /api/sell/request` accepts only `deviceName`, `defects`, and `customDefects`; the server determines value. `POST /api/recycle/request` accepts `product`, `isPickup`, and coordinates; the server calculates distance and charge. `POST /api/donate/request` accepts a JPEG, PNG, or WebP data URL under 5 MB plus validated contact details.
