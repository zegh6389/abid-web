# Backend tests (manual/Testsprite)

This file lists simple steps to verify backend functionality. You can use these as Testsprite test cases or manual checks.

## 1) Health check
- Request: GET /api/health
- Expect: { ok: true } with HTTP 200 (when DB reachable). If Prisma not generated/DB off, expect 500 with error.

## 2) Admin login/logout
- Request: POST /api/admin/login with JSON { "email": "admin@example.com", "password": "<password>" }
- Expect: { ok: true, user: { id, email, role } } and a Set-Cookie admin_session.
- Request: GET /admin (or any protected page) should not redirect when cookie is present.
- Request: POST /api/admin/logout then GET /admin should redirect to /admin/login.
- Negative: invalid email or missing password returns 400 with BAD_REQUEST.
- Rate limit: repeat login more than 10 times in 5 minutes should return 429 with RATE_LIMITED.

### 2a) Admin me (session introspection)
- Request: GET /api/admin/me (with admin_session cookie)
- Expect: 200 with { ok: true, user: { id, email, role, name? }, ttl }
- Without cookie: expect 401 with { ok: false, user: null }

## 3) Products listing with facets
- Request: GET /api/products?q=shirt&f_brand=Nike&f_size=M&page=1&limit=12
- Expect: 200 with JSON { items, total, page, limit, facets }.

## 4) Create product (admin)
- Pre: Login to get admin_session cookie.
- Request: POST /api/products with JSON { slug, title, description }
- Expect: 200 with created product.
- Negative: POST /api/products with missing slug or title should return 400 with code BAD_REQUEST.

## 5) Create variant (admin)
- Request: POST /api/products/{productId}/variants with JSON { sku, optionSize, optionColor, price, stock }
- Expect: 200 with variant and inventory.
- Negative: invalid price/stock should return 400 with code BAD_REQUEST.

## 6) Presigned upload (admin)
## 6a) Media update and delete (admin)
- Request: PATCH /api/media/{mediaId} with { isPrimary: true } should demote others and set this as primary.
- Request: PATCH /api/media/{mediaId} with invalid body should return 400 with BAD_REQUEST.
- Request: DELETE /api/media/{mediaId} should return { ok: true }.
- Request: POST /api/variants/{variantId}/media with invalid url should return 400 with BAD_REQUEST.
- Request: POST /api/uploads/presign with JSON { key: "variants/<variantId>/image.jpg", contentType: "image/jpeg" }
- Expect: 200 with { url, publicUrl }.
- Negative: invalid key (not starting with variants/) should return 400 with BAD_REQUEST.

## 7) Create order with Zod validation
- Request: POST /api/orders with JSON:
  {
    "items": [
      { "title": "Test Item", "quantity": 2, "price": 123.45, "variantId": "<variantId>" }
    ],
    "total": 246.9,
    "currency": "PKR",
    "email": "buyer@example.com",
    "name": "Buyer Name",
    "address": { "line1": "123 Main St", "city": "Lahore" },
    "provider": "card"
  }
- Expect: 200 with { ok: true, order }.
- Negative: POST with missing items or total should return 400 with { ok: false, code: "BAD_REQUEST" } and validation errors.

## 8) Checkout session
- Request: POST /api/payments/checkout with JSON { amount: 246.9, currency: "PKR", method: "card", orderId }
- If Stripe is configured: Expect 200 with { ok: true, url, sessionId, provider: "stripe" }.
- Else: Expect 200 with { ok: true, sessionId, provider: "card" }.
- Negative: missing amount or method returns 400 with BAD_REQUEST.

## 9) Mock webhook confirmation
- When Stripe not configured:
  - Request: POST /api/payments/webhook with JSON { orderId, success: true }
  - Expect: order.status becomes PAID and inventory decremented for items with variantId.
  - Negative: missing orderId returns 400 with BAD_REQUEST.

## 10) Order retrieval
- Request: GET /api/orders?limit=10
- Expect: 200 with recent orders array.
- Request: GET /api/orders/{id}
- Expect: 200 with specific order (or 404 if not found).
 - Request: PATCH /api/orders/{id} with { status: "PAID" } returns 200 with updated order.
 - Negative: PATCH with invalid status returns 400 with BAD_REQUEST.

## 11) Reviews
- Request: GET /api/products/{productId}/reviews returns latest reviews.
- Request: POST /api/products/{productId}/reviews with { rating: 5, title: "Great", body: "Fits well" } returns 200 with review.
- Negative: POST with rating 0 or > 5 returns 400 with BAD_REQUEST.

## 12) Collections (admin)
- Request: POST /api/collections with { slug, title, desc? } creates a collection.
- Request: GET /api/collections returns collections.
- Request: PATCH /api/collections/{id} with { title } updates the collection.
- Request: POST /api/collections/{id}/products with { productId, position? } attaches product.
- Request: PATCH /api/collections/{id}/products with { productId, position } reorders link.
- Request: DELETE /api/collections/{id}/products with { productId } detaches product.
- Request: DELETE /api/collections/{id} deletes the collection.
- Note: If ENABLE_CSRF=1, include 'X-CSRF-Token' header matching 'csrfToken' cookie for all admin mutations.

Notes:
- For admin-protected routes, set the admin_session cookie from login response when making requests.
- Adjust ids from created resources in your local run.
