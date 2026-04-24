# Payments

## Provider

PayPal Standard Checkout.

The app exposes:

- `POST /api/paypal/orders`
- `POST /api/paypal/capture`

## Credit Rules

- First anonymous generation is free.
- Paid credits are granted only after capture succeeds.
- Production credit writes must be idempotent by PayPal order/capture id.
- Failed generations should not debit credits.

## Production Notes

The current checkout page exercises the server create/capture flow and is ready to be replaced with PayPal JavaScript buttons that call the same endpoints.
