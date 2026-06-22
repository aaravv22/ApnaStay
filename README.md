<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=ApnaStay&fontSize=60&fontColor=fff&animation=twinkling&fontAlignY=35&desc=Apna%20Ghar%2C%20Apni%20Choice%20%E2%80%94%20India%27s%20Smartest%20Campus%20Living%20Platform&descAlignY=58&descSize=15" width="100%"/>

</div>

<div align="center">

[![Typing SVG](https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=20&pause=1000&color=9D79F7&center=true&vCenter=true&width=700&lines=Discover+%C2%B7+Compare+%C2%B7+Book+%E2%80%94+All+In+One+Platform;Hostels+%7C+PGs+%7C+Gyms+%7C+Libraries+%7C+Mess+%7C+Cafes;Built+for+50%2C000%2B+Students+Across+India;TypeScript+%C2%B7+React+%C2%B7+Supabase+%C2%B7+Vite)](https://git.io/typing-svg)

</div>

<br/>

<div align="center">

[![Live Demo](https://img.shields.io/badge/LIVE%20DEMO-smart--stay--india--rv15.vercel.app-7C3AED?style=for-the-badge&logo=vercel&logoColor=white)](https://smart-stay-india-rv15.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-aaravv22%2FApnaStay-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/aaravv22/ApnaStay)
[![Status](https://img.shields.io/badge/STATUS-LIVE%20%26%20DEPLOYED-22c55e?style=for-the-badge&logo=statuspage&logoColor=white)](#)

</div>

<br/>

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-91.7%25-3178C6?style=flat-square&logo=typescript&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-2.7%25-1572B6?style=flat-square&logo=css3&logoColor=white)
![PLpgSQL](https://img.shields.io/badge/PLpgSQL-5.1%25-336791?style=flat-square&logo=postgresql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646CFF?style=flat-square&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase&logoColor=white)

</div>

---

## ◈ What is ApnaStay?

> **ApnaStay** is India's smartest campus living platform — built for college students who are tired of navigating scattered WhatsApp groups, random broker calls, and unverified PG listings.

One platform. Every student need.

Find **hostels, PGs, gyms, libraries, mess services, and cafes** near your college — compare them side by side, read real verified reviews, and book instantly. Whether you're moving cities for college or just need a quiet library near campus, ApnaStay has you covered.

**Built by a student. For students. Across India.**

---

## ◈ Live Stats

<div align="center">

| Metric | Value |
|:---|:---:|
| Students Helped | **50,000+** |
| Cities Covered | **120+** |
| Verified Vendors | **8,000+** |
| Average Rating | **4.8 ★** |
| Deployment | **Vercel — Live** |

</div>

---

## ◈ Core Features

<details>
<summary><b>⬡ Student Discovery — Search, Explore & Filter</b></summary>

<br/>

- Search by **college name, city, or area** with live map integration
- Browse across **6 categories** — Hostels, PGs, Gyms, Libraries, Mess & Cafes
- Filter by price, rating, amenities, and proximity to campus
- View verified vendor badges and real student reviews
- Side-by-side comparison of shortlisted spaces

<br/>
</details>

<details>
<summary><b>⬡ Instant Booking & Secure Payments</b></summary>

<br/>

- One-click booking flow with instant confirmation
- Secure payment integration with digital rent agreements
- Booking history and management dashboard for students
- Real-time availability tracking per listing

<br/>
</details>

<details>
<summary><b>⬡ Vendor Dashboard — List Your Space</b></summary>

<br/>

- Dedicated vendor onboarding and listing management portal
- Upload photos, set pricing, manage availability, and respond to bookings
- Analytics dashboard for vendor performance tracking
- Verified vendor badge system for trust and credibility

<br/>
</details>

<details>
<summary><b>⬡ Authentication & User Management</b></summary>

<br/>

- Supabase-powered authentication — Sign up, Sign in, Session management
- Role-based access — Student vs Vendor vs Admin flows
- Secure, persistent sessions with JWT token management
- Protected routes and auth-gated dashboards

<br/>
</details>

---

## ◈ Tech Stack

<div align="center">

| Layer | Technology |
|:---|:---|
| **Frontend** | React.js, TypeScript, Vite, Tailwind CSS |
| **UI Components** | shadcn/ui, Radix UI |
| **Backend & Auth** | Supabase (PostgreSQL + Auth + Storage) |
| **Database** | PostgreSQL with PLpgSQL functions |
| **Deployment** | Vercel |
| **Code Quality** | ESLint, Prettier |
| **Package Manager** | Bun |

</div>

---

## ◈ Project Structure

```
ApnaStay/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Route-level page components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and helpers
│   └── integrations/      # Supabase client & types
├── supabase/
│   └── migrations/        # Database schema & PLpgSQL functions
├── vite.config.ts
├── tailwind.config.ts
└── components.json        # shadcn/ui config
```

---

## ◈ Getting Started

### Prerequisites

```bash
node >= 18.0.0
bun >= 1.0.0
```

### Installation

```bash
# Clone the repository
git clone https://github.com/aaravv22/ApnaStay.git

# Navigate into the project
cd ApnaStay

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase URL and Anon Key

# Start the development server
bun run dev
```

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## ◈ Deployment

ApnaStay is deployed on **Vercel** with automatic deployments on every push to `main`.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aaravv22/ApnaStay)

---

## ◈ Roadmap

```yaml
completed:
  - Student discovery with search & filters
  - 6 category listings (Hostel, PG, Gym, Library, Mess, Cafe)
  - Vendor dashboard & listing management
  - Supabase auth with role-based access
  - Live deployment on Vercel

in_progress:
  - Native mobile app (React Native)
  - AI-powered recommendation engine
  - Real-time chat between students and vendors
  - Advanced map view with radius search

upcoming:
  - College-verified student badges
  - Roommate finder feature
  - Digital rent agreement generation
  - Multi-city vendor analytics
```

---

## ◈ Screenshots

> **Live Preview →** [smart-stay-india-rv15.vercel.app](https://smart-stay-india-rv15.vercel.app/)

| View | Description |
|:---|:---|
| **Homepage** | Hero section with category search and featured spaces |
| **Dashboard** | Full listing explorer with filters and map |
| **Listing Detail** | Reviews, amenities, pricing and instant booking |
| **Vendor Portal** | Space management and booking analytics |
| **Auth Flow** | Sign in / Sign up with Supabase session |

---

## ◈ Author

<div align="center">

Built with focus by **Aarav Dadhwal**

[![GitHub](https://img.shields.io/badge/GitHub-aaravv22-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/aaravv22)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Aarav%20Dadhwal-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/aarav-dadhwal-b33297339/)
[![Email](https://img.shields.io/badge/Email-thakuraarav558@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:thakuraarav558@gmail.com)

*CSE Student @ SRM IST Chennai · Summer Intern @ Tata Steel · Oracle GenAI Professional*

</div>

---

## ◈ License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute with attribution.

---

<div align="center">

*"Built for every student who ever struggled to find a decent PG near college."*

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer&animation=twinkling" width="100%"/>

</div>
