# SurveyMind AI 🧠

منصة استبيانات ذكية للطلاب والمحاضرين والباحثين وفرق الجودة — أنشئ استبيانك، اجمع الردود برابط عام، وحوّلها إلى ملخصات ومواضيع وتوصيات بالذكاء الاصطناعي.

An AI-powered survey platform for students, lecturers, researchers, and quality teams: build surveys, collect responses through a public link, and turn feedback into summaries, themes, and recommendations.

## المميزات / Features

- **حسابات بأدوار** — مؤسس (تحكم كامل) / محاضر (فرع يتابع طلابه) / طالب، مع توثيق الإيميل بكود 6 أرقام واستعادة كلمة المرور
- **استبيانات حقيقية** — إنشاء وتفعيل ومشاركة برابط عام `/s/{id}` يجيب عليه المشاركون بدون حساب
- **فرع المحاضر** — كود انضمام للطلاب، وجدول متابعة (عدد الأسئلة، الردود، مدة التجميع)
- **تحليل ذكي** — Claude يحلل الردود (ملخص، مواضيع، انطباع، توصيات) مع وضع إحصائي بديل بدون مفتاح API
- **لوحة المؤسس** — إحصائيات المشتركين، متابعة كل الحسابات، حجب/فك حجب الإيميلات
- **حماية** — حد المحاولات، قفل الأكواد بعد 5 محاولات، فحص كلمات مرور ثابت التوقيت، رؤوس أمنية

## التشغيل / Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

بدون أي إعداد إضافي: أكواد التوثيق تظهر على الشاشة (وضع التطوير)، والتحليل يعمل إحصائيًا.
انسخ `.env.example` إلى `.env.local` لتفعيل الإرسال الحقيقي للإيميل (Resend) والتحليل الذكي (Anthropic).

**حساب المؤسس الافتراضي:** `yassser969@gmail.com` / `admin12345` — غيّرهما عبر `ADMIN_EMAIL` و`ADMIN_PASSWORD`.

## الأوامر / Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm test` | Unit tests (Vitest) |

CI on GitHub Actions runs lint, typecheck, tests, and build on every push and pull request.

## بنية المشروع / Project structure

```
app/
  page.tsx                  # Landing page (EN/AR/ES)
  login, signup, verify,
  forgot-password,
  reset-password/           # Auth flows
  s/[id]/                   # Public survey answering page
  dashboard/
    layout.tsx              # Session guard + role-based nav
    page.tsx                # Overview (real stats)
    my-surveys/             # Create/activate/share + view responses
    responses/              # All collected answers
    analysis/               # AI analysis per survey
    branch/                 # Lecturer: student monitoring
    join/                   # Student: join a branch by code
    admin/                  # Founder panel
  components/CursorGlow.tsx # Custom cursor + lighting
lib/
  db.ts                     # SQLite schema + migrations
  auth.ts                   # Sessions, codes, passwords, founder seed
  analysis.ts               # Claude + statistical fallback
  mail.ts                   # Resend or dev-mode codes
  rate-limit.ts             # Fixed-window rate limiter
  actions/                  # Server actions (auth, surveys, branch, admin, analysis)
test/                       # Vitest unit tests (security-critical logic)
```

## قاعدة البيانات / Database

SQLite via `better-sqlite3`, stored in `data/surveymind.db` (git-ignored). Schema and lightweight migrations live in `lib/db.ts` and apply automatically on first access.
