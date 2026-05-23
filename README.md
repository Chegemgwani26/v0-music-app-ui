# SoundWave - Music Upload Platform

Msanii wanaweza kujisajili, kuingia, na kupakia nyimzo zao kwenye platform hii.

## 🚀 Kuanza Haraka

### Installation

```bash
npm install
# or
pnpm install
```

### Environment Variables

Ungeza faili `.env.local`:

```bash
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### Kuendesha Development Server

```bash
npm run dev
# or
pnpm dev
```

Bukeni [http://localhost:3000](http://localhost:3000)

## 📋 Jinsi ya Kutimizia

### 1. Jisajili (Sign Up)
Msanii huenda kwa `/auth/register` na kuwajaza:
- Jina Lako Kamili
- Barua Pepe
- Jina la Msanii
- Nenosiri

### 2. Ingia (Login)
Msanii huenda kwa `/auth/login` na kuingia kwa email na nenosiri

### 3. Dashboard
Katika `/dashboard`, msanii anaweza:
- ✅ Kupakia nyimzo mpya (MP3, WAV, FLAC, OGG)
- ✅ Kuona orodha ya nyimzo zote
- ✅ Kuondoa nyimzo
- ✅ Kusikiliza nyimzo

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Jisajili
- `POST /api/auth/login` - Ingia

### Tracks
- `GET /api/tracks` - Kupata nyimzo zote za msanii
- `POST /api/upload` - Kupakia nyimzo mpya
- `DELETE /api/tracks/:id` - Kuondoa nyimzo

## 📁 Muundo wa Project

```
app/
├── auth/
│   ├── register/page.tsx    # Ukurasa wa jisajili
│   └── login/page.tsx       # Ukurasa wa kuingia
├── dashboard/
│   └── page.tsx             # Dashboard ya msanii
├── api/
│   ├── auth/
│   │   ├── register/route.ts
│   │   └── login/route.ts
│   ├── upload/route.ts      # Kupakia faili
│   └── tracks/route.ts      # Kusimamia nyimzo
└── page.tsx                 # Ukurasa wa nyumbani
```

## 🛠️ Technology Stack

- **Next.js 16** - React Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **bcryptjs** - Password Hashing
- **jsonwebtoken** - JWT Authentication
- **Lucide React** - Icons

## 📝 Variables za Environment

```env
# Lazima kuongezwa kwenye .env.local
JWT_SECRET=your-secret-key-change-this
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🔐 Security Notes

- Badilisha `JWT_SECRET` na key thabiti katika production
- Nyimzo zote zinalindwa kwa JWT tokens
- Passwords zinahashwa kwa bcryptjs
- File uploads zinalindwa kwa validation

## 📱 Responsive Design

Platform imetengenezwa kuwa responsive kwenye:
- Mobile devices
- Tablets
- Desktop

## 🚀 Kutengeneza kwa Production

```bash
npm run build
npm run start
```

## 📞 Support

Kama una maswali, tafadhali wasiliana na timu ya development.

## 📄 License

Milele - 2026
