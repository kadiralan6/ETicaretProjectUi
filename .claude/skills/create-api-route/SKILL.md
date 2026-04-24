---
name: create-api-route
description: Step-by-step guide and patterns for creating a new BFF API route in Tooligo Frontend
---

# Creating a New API Route

The frontend uses a BFF (Backend-for-Frontend) proxy architecture. Client components **never** make direct requests to the backend.

## Flow

```
Client ("use client") → nextApiClient.post("/api/xxx") → app/api/xxx/route.ts → httpClient.post(BACKEND_URL) → Backend
```

## Basic GET Proxy

**`app/api/[module]/route.ts`**:
```ts
import { BACKEND_ENDPOINT } from "@/constants/tooligoApi";
import httpClient from "@/util/httpClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const response = await httpClient.get(BACKEND_ENDPOINT);
    return NextResponse.json(response.data);
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, {
      status: errorData.StatusCode || 500,
    });
  }
}
```

## Basic POST Proxy (Filtering / Creating)

```ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  try {
    const response = await httpClient.post(BACKEND_ENDPOINT, body);
    return NextResponse.json(response.data);
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, {
      status: errorData.StatusCode || 500,
    });
  }
}
```

## Dynamic Route (with ID)

**`app/api/[module]/[id]/route.ts`**:
```ts
import httpClient from "@/util/httpClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const response = await httpClient.get(`${BACKEND_ENDPOINT}/${id}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, {
      status: errorData.StatusCode || 500,
    });
  }
}
```

## FormData (File Upload)

```ts
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  try {
    const response = await httpClient.post(BACKEND_ENDPOINT, formData);
    return NextResponse.json(response.data);
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, {
      status: errorData.StatusCode || 500,
    });
  }
}
```

## Adding Custom Headers

`httpClient` automatically adds the `Authorization` header from `getServerSession`. For extra headers:
```ts
const response = await httpClient.post(BACKEND_ENDPOINT, body, {
  headers: { "Custom-Header": "value" },
});
```

## Routes That Don't Require Auth

```ts
const response = await httpClient.post(BACKEND_ENDPOINT, body, {
  skipAuth: true,
});
```

## Checklist

1. `constants/tooligoApi.ts` → Add backend endpoint constant
2. `constants/nextApi.ts` → Add BFF endpoint constant in `NEXT_API_URLS`
3. `app/api/[module]/route.ts` → Create route handler
4. Call from client side using `nextApiClient`

## Important Rules

- Use `error.response?.data` for error responses, not `error.message`.
- Use `errorData.StatusCode || 500` for the status code.
- `httpClient` is used **only** server-side (API routes, server components).
- `nextApiClient` is used **only** client-side ("use client" components).
