# Next.js Proje Mimarisi Rehberi

Bu döküman, tooligo-frontend projesinin mimarisini temel alarak yeni bir projeye rehberlik etmek amacıyla hazırlanmıştır.

---

## İçindekiler

1. [Teknoloji Stack'i](#1-teknoloji-stacki)
2. [Klasör Yapısı](#2-klasör-yapısı)
3. [Routing Stratejisi](#3-routing-stratejisi)
4. [State Management](#4-state-management)
5. [API / Network Katmanı](#5-api--network-katmanı)
6. [Kimlik Doğrulama (Auth)](#6-kimlik-doğrulama-auth)
7. [Component Mimarisi](#7-component-mimarisi)
8. [Sayfa Modülleri (pages-lib)](#8-sayfa-modülleri-pages-lib)
9. [Provider Hiyerarşisi](#9-provider-hiyerarşisi)
10. [Redux Hydration Wrapper'ları](#10-redux-hydration-wrapperları)
11. [Uluslararasılaştırma (i18n)](#11-uluslararasılaştırma-i18n)
12. [Form Yönetimi ve Validasyon](#12-form-yönetimi-ve-validasyon)
13. [Gerçek Zamanlı Bağlantı (SignalR)](#13-gerçek-zamanlı-bağlantı-signalr)
14. [Tema Sistemi](#14-tema-sistemi)
15. [Test Yapısı](#15-test-yapısı)
16. [Önemli Konfigürasyonlar](#16-önemli-konfigürasyonlar)
17. [Uygulanacak Kalıplar (Patterns)](#17-uygulanacak-kalıplar-patterns)

---

## 1. Teknoloji Stack'i

| Kategori         | Paket                     | Versiyon |
| ---------------- | ------------------------- | -------- |
| **Core**         | `next`                    | 16.x     |
| **Core**         | `react`                   | 19       |
| **Core**         | `typescript`              | 5        |
| **UI**           | `@chakra-ui/react`        | v3       |
| **UI**           | `@emotion/react`          | —        |
| **State**        | `@reduxjs/toolkit`        | v2       |
| **State**        | `react-redux`             | v9       |
| **Server State** | `@tanstack/react-query`   | v5       |
| **Form**         | `react-hook-form`         | v7       |
| **Validasyon**   | `zod`                     | v3       |
| **Auth**         | `next-auth`               | v4       |
| **Social Auth**  | `firebase`                | v11      |
| **HTTP**         | `axios`                   | v1       |
| **Real-time**    | `@microsoft/signalr`      | v8       |
| **Ödeme**        | `@stripe/react-stripe-js` | —        |
| **Monitoring**   | `@sentry/nextjs`          | v10      |

---

## 2. Klasör Yapısı

```
project-root/
├── app/                    # Next.js App Router (RSC öncelikli)
│   ├── layout.tsx          # Root layout: font, GTM, metadata, Providers
│   ├── global-error.tsx    # Global hata sınırı
│   ├── not-found.tsx       # 404 sayfası
│   ├── manifest.ts
│   ├── robots.ts
│   ├── sitemap.ts
│   ├── api/                # BFF Route Handler'ları (~30 namespace)
│   │   ├── auth/           # NextAuth [...nextauth] handler
│   │   ├── products/
│   │   ├── basket/
│   │   └── ...             # Tüm backend proxy çağrıları
│   └── [lang]/             # Dinamik dil segmenti
│       ├── layout.tsx      # TranslationProvider + Toaster inject
│       ├── (authenticate)/ # Route group: giriş yapılmamış sayfalar
│       │   ├── login/
│       │   ├── forgot-password/
│       │   └── register/
│       └── (dashboard)/    # Route group: ana uygulama (GeneralLayout ile)
│           ├── layout.tsx  # Veri fetch → GeneralLayout
│           ├── page.tsx    # Ana sayfa
│           └── ...         # Diğer sayfalar
│
├── components/             # Paylaşımlı UI component kütüphanesi
│   ├── ChakraUiBase/       # Chakra UI atom wrapper'ları
│   ├── Form/               # RHF tabanlı kontrollü form alanları
│   ├── GeneralUi/          # Domain-specific bileşik componentler
│   ├── Layout/             # Yüksek seviye layout shell'leri
│   └── Skeleton/           # Yükleme iskelet varyantları
│
├── pages-lib/              # Sayfa başına istemci modülleri
│   └── [PageName]/         # Her sayfa için bağımsız klasör
│       ├── PageName.tsx    # Ana "use client" sayfa bileşeni
│       ├── components/     # Sayfaya özel section, popup, alert
│       └── config/         # Sayfaya özel konfigürasyon
│
├── redux/                  # Global state (RTK)
│   ├── store/index.ts      # configureStore + RootState + AppDispatch
│   └── slices/             # Her domain için ayrı slice
│
├── services/               # Yan etki servisleri
│   └── signalR/            # Gerçek zamanlı bağlantı yöneticileri
│
├── network/                # Sadece sunucu tarafı veri fetch fonksiyonları
│
├── providers/              # React context ve üçüncü taraf provider'lar
│
├── wrapper/                # Redux hydration wrapper'ları (istemci)
│
├── hooks/                  # Minimal paylaşımlı hook'lar
│
├── util/                   # Yardımcılar, HTTP istemcileri, özel hook'lar
│
├── configs/                # Firebase, Stripe, API config nesneleri
│
├── constants/              # Route, API URL, query key, enum sabitleri
│
├── interfaces/             # TypeScript domain model interface'leri
│
├── types/                  # Global TS augmentation'ları
│
├── validations/            # Form başına Zod şemaları
│
├── dictionaries/           # i18n JSON dosyaları
│   ├── en.json
│   └── tr.json
│
├── theme/                  # Chakra UI v3 sistem konfigürasyonu + recipe'ler
│
├── __tests__/              # Unit/entegrasyon test dosyaları
│
├── public/                 # Statik varlıklar
│
└── docs/                   # İç mühendislik rehberleri
```

---

## 3. Routing Stratejisi

### Dinamik Dil Segmenti

Tüm kullanıcıya yönelik sayfalar `app/[lang]/` altında konumlanır. Bu sayede URL'ler `/tr/...` ve `/en/...` şeklinde dil öneki alır.

```
/tr/anasayfa
/en/home
/tr/urum/iphone-13
```

### Route Group'ları

Parantez içi klasörler (`(authenticate)`, `(dashboard)`) URL'e etki etmez, sadece layout'ları gruplar:

```
app/[lang]/
├── (authenticate)/   # Ortak layout YOK — giriş yapılmamış sayfalar
│   ├── login/
│   └── forgot-password/
└── (dashboard)/      # GeneralLayout ile — ana uygulama sayfaları
    ├── layout.tsx    # Shared navbar + footer
    └── page.tsx      # /[lang]/ → Ana sayfa
```

### Middleware — Dil Algılama

`middleware.ts` dosyası, gelen istekleri yakalayarak `@formatjs/intl-localematcher` ve `negotiator` kütüphaneleriyle kullanıcının tarayıcı diline göre `[lang]` ön ekine yönlendirir.

```ts
// middleware.ts örnek akış
// 1. İstek alındı: /products/123
// 2. Accept-Language header'ı okunur
// 3. Desteklenen diller ile eşleştirilir (tr, en)
// 4. Yönlendirme: /tr/products/123
```

### BFF Route Handler'ları (`app/api/`)

İstemci hiçbir zaman doğrudan backend'e çağrı yapmaz. Her backend çağrısı `app/api/` altındaki Next.js Route Handler'larından geçer:

```
app/api/
├── auth/[...nextauth]/route.ts   # NextAuth
├── products/
│   ├── route.ts                  # GET /api/products
│   └── [id]/route.ts             # GET /api/products/:id
├── basket/route.ts
├── orders/route.ts
└── ...
```

---

## 4. State Management

### İki Katmanlı Yaklaşım

| Katman                | Araç           | Ne İçin                               |
| --------------------- | -------------- | ------------------------------------- |
| **Sunucu verisi**     | TanStack Query | API fetch, cache, senkronizasyon      |
| **İstemci UI durumu** | Redux Toolkit  | Sepet, favori, modal, multi-step form |

### Redux Slice Yapısı

```
redux/
├── store/
│   └── index.ts          # configureStore, RootState, AppDispatch export
└── slices/
    ├── basketSlice.ts    # Sepet verisi + drawer açık/kapalı
    ├── favoriteSlice.ts  # Kullanıcı favorileri
    ├── userVerificationSlice.ts  # KYC/doğrulama durumu
    ├── igoBotSlice.ts    # AI chatbot durumu
    ├── mobileCategorySlice.ts    # Mobil kategori drawer
    └── stepSlice.ts      # Çok adımlı form ilerlemesi
```

### Kural

- `createAsyncThunk` **kullanılmaz**. Asenkron işlemler TanStack Query üzerinden yönetilir.
- Redux yalnızca **UI durumu** ve türetilmiş kullanıcı verisi tutar.

---

## 5. API / Network Katmanı

### İki Katmanlı HTTP Mimarisi

```
İstemci
  ↓  nextApiClient (axios, baseURL: /api)
Next.js Route Handlers (app/api/)
  ↓  httpClient (axios, baseURL: BACKEND_API_BASE_URL)
Backend API
```

### `util/httpClient.ts` — Sunucu Tarafı

- Sadece sunucuda çalışır (`server-only`)
- `getServerSession` ile oturumdan `Authorization: Bearer <token>` otomatik ekler
- `skipAuth: true` seçeneği ile auth atlatılabilir

```ts
// Örnek kullanım (server component veya route handler içinde)
const data = await httpClient.get("/products", { skipAuth: false });
```

### `util/nextApiClient.ts` — İstemci Tarafı

- İstemci tarafı axios instance'ı, `/api/*` endpoint'lerine istek atar
- `SessionTerminated` yanıtını yakalayarak özel DOM eventi tetikler → logout

```ts
// Örnek kullanım (client component / TanStack Query içinde)
const { data } = useQuery({
  queryKey: ["products"],
  queryFn: () => nextApiClient.get("/api/products").then((r) => r.data),
});
```

### Token Refresh Stratejisi

`app/api/auth/` altında NextAuth v4 ile access token + refresh token yönetimi yapılır. Yarış koşullarını (race condition) önlemek için token yenileme işlemleri önbelleğe alınır.

---

## 6. Kimlik Doğrulama (Auth)

### NextAuth v4 Yapılandırması

```
providers/
└── AuthProvider.tsx    # AuthOptions burada tanımlanır ve export edilir
```

**Akış:**

1. `CredentialsProvider` ile email/şifre + OTP girişi
2. Access token + refresh token JWT session'da saklanır
3. `AuthOptions` hem Route Handler hem `getServerSession` tarafından kullanılır

### Firebase (Sosyal Giriş)

- Google / Apple Sign-In için Firebase kullanılır
- `util/firebaseAuth.ts` — Firebase auth metodları
- `util/getSocialIdToken.ts` — ID token alımı

### Oturum Sonlandırma

`SessionProvider.tsx`, `auth:error` DOM eventini dinler. Backend `SessionTerminated` döndürdüğünde `nextApiClient` interceptor bu eventi fırlatır ve `signOut()` çağrılır.

---

## 7. Component Mimarisi

### `components/ChakraUiBase/`

Projeye özgü varsayılanlar ve özel tema recipe'leri uygulayan, Chakra UI v3 atom'larının ince wrapper'ları.

```
ChakraUiBase/
├── Button/
├── Input/
├── Select/
├── Drawer/
├── Tabs/
├── Toaster/
└── ...
```

### `components/Form/`

`react-hook-form` `Controller` tabanlı kontrollü form alanları:

```
Form/
├── ControlledInput.tsx
├── ControlledSelectBox.tsx
├── ControlledTextarea.tsx
├── ControlledSwitch.tsx
└── ControlledRadioButton.tsx
```

**Kullanım Kalıbı:**

```tsx
<ControlledInput
  control={control}
  name="email"
  label="E-posta"
  rules={{ required: true }}
/>
```

### `components/GeneralUi/`

70+ adet domain-specific bileşik bileşen:

- `ProductCard`, `BasketDrawer`, `OtpPopup`, `IgoBot`
- `Notification`, `LoginPopup`, `Pagination`
- `DatePicker`, `UploadImages`, `QrCode`

### `components/Layout/`

Yüksek seviye layout shell'leri:

```
Layout/
├── GeneralLayout/     # Ana uygulama: navbar + footer
├── MyProfileLayout/   # Kullanıcı profil sayfaları
├── MyStoreLayout/     # Satıcı mağaza sayfaları
└── StoreLayout/       # Genel mağaza sayfaları
```

---

## 8. Sayfa Modülleri (pages-lib)

Her sayfa için ağır istemci mantığını RSC page component'lerinden ayıran katman:

```
pages-lib/
└── ProductDetailPage/
    ├── ProductDetailPage.tsx    # "use client" — ana sayfa bileşeni
    ├── components/
    │   ├── ProductImages/
    │   ├── ProductInfo/
    │   ├── ReviewSection/
    │   └── RentalPopup/
    └── config/
        └── rentalStepsConfig.ts
```

**`app/[lang]/(dashboard)/products/[id]/page.tsx`** (RSC — hafif):

```tsx
import ProductDetailPage from "@/pages-lib/ProductDetailPage/ProductDetailPage";

export default async function Page({ params }) {
  const product = await fetchProduct(params.id); // sunucu tarafı fetch
  return <ProductDetailPage initialData={product} />;
}
```

**`pages-lib/ProductDetailPage/ProductDetailPage.tsx`** (istemci — ağır):

```tsx
'use client';

export default function ProductDetailPage({ initialData }) {
  const [state, setState] = useState(...);
  // TanStack Query, Redux, event handler'lar burada
}
```

---

## 9. Provider Hiyerarşisi

`providers/Providers.tsx` içinde aşağıdaki sırayla iç içe geçmiş:

```
FirebaseProvider
  └── SessionProvider (NextAuth)
        └── TanstackQueryProvider (React Query)
              └── ReduxProvider
                    └── EmotionCacheProvider (SSR için)
                          └── ChakraProvider (Chakra UI v3)
                                └── TranslationProvider
                                      └── UserVerificationWrapper
                                            └── BasketWrapper
                                                  └── FavoriteWrapper
                                                        └── {children}
```

**Kritik Sıralama Kuralları:**

- `SessionProvider` → `TanstackQueryProvider`'dan önce (session hook'ları query'lerde kullanılır)
- `ReduxProvider` → Wrapper'lardan önce (dispatch için Redux gerekli)
- `ChakraProvider` → Her UI bileşeninden önce

---

## 10. Redux Hydration Wrapper'ları

`wrapper/` klasöründeki bileşenler, mount anında TanStack Query ile veri çekip sonuçları Redux'a dispatch eden istemci bileşenleridir:

```
wrapper/
├── UserVerificationWrapper.tsx   # KYC durumu → Redux
├── BasketWrapper.tsx             # Sepet verisi → Redux
└── FavoriteWrapper.tsx           # Favoriler → Redux
```

**Neden gerekli?**
Sunucu tarafında Redux store doldurulamaz. Bu wrapper'lar client mount'ta çalışarak Redux'ı sunucu verisiyle senkronize eder.

```tsx
// wrapper/BasketWrapper.tsx örnek kalıp
"use client";

export function BasketWrapper({ children }) {
  const dispatch = useAppDispatch();
  const { data: basket } = useQuery({
    queryKey: ["basket"],
    queryFn: fetchBasket,
  });

  useEffect(() => {
    if (basket) dispatch(setBasket(basket));
  }, [basket]);

  return children;
}
```

---

## 11. Uluslararasılaştırma (i18n)

### Sözlük Dosyaları

Düz anahtar-değer JSON, yalnızca sunucu tarafında yüklenir:

```json
// dictionaries/tr.json
{
  "common": {
    "save": "Kaydet",
    "cancel": "İptal",
    "search": "Ara"
  },
  "product": {
    "addToCart": "Sepete Ekle"
  }
}
```

### Kullanım Kalıbı

```ts
// util/getDictionary.ts — server-only
import "server-only";

const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  tr: () => import("@/dictionaries/tr.json").then((m) => m.default),
};

export const getDictionary = (locale: "en" | "tr") => dictionaries[locale]();
```

```tsx
// app/[lang]/layout.tsx içinde
const dict = await getDictionary(lang);
// dict + locale → <Providers> içinden TranslationProvider'a geçilir
```

```tsx
// İstemci bileşeninde
const { t } = useTranslation();
// t("common.save") → "Kaydet"
// t("product.addToCart") → "Sepete Ekle"
```

---

## 12. Form Yönetimi ve Validasyon

### Şema Tabanlı Validasyon

```
validations/
├── loginValidation.ts
├── registerValidation.ts
├── createProductValidation.ts
└── ...   # Form başına bir şema dosyası
```

```ts
// validations/loginValidation.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta girin"),
  password: z.string().min(8, "En az 8 karakter gerekli"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
```

### Form Bileşeni Kalıbı

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "@/validations/loginValidation";
import { ControlledInput } from "@/components/Form";

export function LoginForm() {
  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ControlledInput control={control} name="email" label="E-posta" />
      <ControlledInput
        control={control}
        name="password"
        label="Şifre"
        type="password"
      />
    </form>
  );
}
```

---

## 13. Gerçek Zamanlı Bağlantı (SignalR)

```
services/signalR/
├── config.ts                      # WSS URL'lerini dinamik olarak oluşturur
├── orderConnectionManager.ts      # Sipariş durum güncellemeleri için hub
└── paymentConnectionManager.ts    # Ödeme durum güncellemeleri için hub
```

### Tüketim Kalıbı

```ts
// util/useOrderSignalR.ts
export function useOrderSignalR(orderId: string) {
  useEffect(() => {
    const connection = orderConnectionManager.connect(orderId);
    connection.on("OrderStatusUpdated", (status) => {
      // Redux'a dispatch veya TanStack Query invalidate
    });
    return () => connection.stop();
  }, [orderId]);
}
```

---

## 14. Tema Sistemi

```
theme/
├── index.ts              # createSystem + defineConfig
├── recipes/
│   ├── button.recipe.ts  # Düğme varyantları
│   ├── input.recipe.ts   # Input varyantları
│   └── text.recipe.ts    # Metin stilleri
```

```ts
// theme/index.ts
import { createSystem, defineConfig } from "@chakra-ui/react";
import { buttonRecipe } from "./recipes/button.recipe";

const config = defineConfig({
  theme: {
    recipes: { button: buttonRecipe },
  },
});

export const system = createSystem(config);
```

```tsx
// providers/Providers.tsx içinde
<ChakraProvider value={system}>{children}</ChakraProvider>
```

---

## 15. Test Yapısı

```
__tests__/
├── date.test.ts
├── formatRelativeTime.test.ts
├── middleware.test.ts
└── pages/
    └── [sayfa başına testler]
```

### Araçlar

- **Çalıştırıcı**: Jest 29 + `jest-environment-jsdom`
- **Konfigürasyon**: `nextJest({ dir: "./" })` ile Next.js entegrasyonu
- **Kütüphaneler**: `@testing-library/react`, `@testing-library/jest-dom`
- **Coverage**: v8 provider

### Komutlar

```bash
npm test           # Tek seferlik
npm run test:watch # İzleme modu
```

---

## 16. Önemli Konfigürasyonlar

### `next.config.js`

```js
const nextConfig = {
  reactCompiler: true, // Production'da React Compiler
  cacheComponents: true,
  images: {
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60 * 60 * 24 * 60, // 60 gün
    remotePatterns: [
      /* S3 bucket'lar */
    ],
  },
  experimental: {
    optimizePackageImports: ["@chakra-ui/react", "react-icons"],
  },
};
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "paths": { "@/*": ["./*"] },
    "strict": true,
    "moduleResolution": "bundler"
  }
}
```

### Ortam Değişkenleri (`.env.local`)

```
NEXT_PUBLIC_TOOLIGO_API_BASE_URL=https://api.example.com
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
SENTRY_DSN=...
```

---

## 17. Uygulanacak Kalıplar (Patterns)

### ✅ Yap

1. **RSC + istemci bileşen ayrımı**: Sunucu bileşenlerini hafif tut, ağır mantığı `pages-lib/` istemci modüllerine taşı.

2. **BFF Pattern**: İstemci asla doğrudan backend'e çağrı yapmasın. Her şey `app/api/` Route Handler'larından geçsin.

3. **Redux yalnızca UI state için**: Sunucu verisi için TanStack Query kullan. Redux'a sadece modal durumu, sepet gibi anlık UI state'ini koy.

4. **Form başına validasyon şeması**: Her form için `validations/` klasöründe ayrı Zod şeması tanımla, tipi Zod'dan `infer` et.

5. **Sayfaya özel bileşenler**: Sadece bir sayfada kullanılan bileşenler `pages-lib/[PageName]/components/` altında olsun.

6. **Server-only fetch'ler**: `network/` klasöründeki fonksiyonlar `"server-only"` ile işaretle, Next.js cacheTag/cacheLife ile ISR uygula.

### ❌ Yapma

1. İstemci bileşeninden doğrudan backend API'sine istek atma.
2. `createAsyncThunk` ile Redux üzerinden API çağrısı yapma.
3. Sunucu bileşenine `"use client"` ekleme (sadece gerçekten gerektiğinde).
4. Form validasyon mantığını bileşen içine gömmek yerine, `validations/` klasöründe tutma.
5. Paylaşımlı olmayan bileşenleri `components/GeneralUi/` altına koyma.

---

## Yeni Proje Başlatma Adımları

```bash
# 1. Next.js projesi oluştur
npx create-next-app@latest my-project --typescript --tailwind --app

# 2. Temel paketleri kur
npm install @chakra-ui/react @emotion/react @reduxjs/toolkit react-redux
npm install @tanstack/react-query react-hook-form @hookform/resolvers zod
npm install next-auth axios
npm install @microsoft/signalr  # gerçek zamanlı gerekiyorsa

# 3. Klasör yapısını oluştur
mkdir -p app/api app/\[lang\]/\(authenticate\) app/\[lang\]/\(dashboard\)
mkdir -p components/{ChakraUiBase,Form,GeneralUi,Layout,Skeleton}
mkdir -p pages-lib redux/{store,slices} services/signalR
mkdir -p network providers wrapper hooks util configs constants
mkdir -p interfaces types validations dictionaries theme docs

# 4. Temel dosyaları oluştur
touch dictionaries/tr.json dictionaries/en.json
touch redux/store/index.ts
touch providers/Providers.tsx
touch util/httpClient.ts util/nextApiClient.ts
touch middleware.ts
```

---

_Bu döküman tooligo-frontend projesinin mimarisinden üretilmiştir. Projeye özgü domain mantığı çıkarılmıştır; yeni projeye göre uyarlanması gerekir._
