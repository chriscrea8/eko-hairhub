# ⚡ Eko HairHub — Setup Cheat Sheet

## Your .env file for eko-hairhub-backend/.env

Copy this exactly, fill in your values:

```
NODE_ENV=development
PORT=5000

# From Neon dashboard → Connect → toggle pooling ON for this one:
DATABASE_URL="postgresql://USER:PASS@ep-YOUR-ID-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require"

# From Neon dashboard → Connect → toggle pooling OFF for this one:
DIRECT_URL="postgresql://USER:PASS@ep-YOUR-ID.eu-west-2.aws.neon.tech/neondb?sslmode=require"

# Make up any random 40+ character string:
JWT_SECRET=abc123changethis456youcanmakethisanythingyouwant
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=anotherlongrandomstringfordifferentpurposehere
JWT_REFRESH_EXPIRES_IN=30d

# From paystack.com → Settings → API Keys (use test keys for now):
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYSTACK_WEBHOOK_SECRET=anything_for_now

# From cloudinary.com → Dashboard (can skip for now, upload won't work but rest will):
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Your Vercel URL once deployed (use localhost for now):
FRONTEND_URL=http://localhost:3000

PLATFORM_FEE_PERCENT=10
```

## Commands to run (in order)

```bash
cd eko-hairhub-backend
npm install
npx prisma migrate deploy
npm run seed
npm run dev
```

## Railway environment variables to add

Same as above PLUS change:
- NODE_ENV → production
- FRONTEND_URL → https://your-app.vercel.app
- Add DIRECT_URL (Railway needs it too for migrations on startup)
