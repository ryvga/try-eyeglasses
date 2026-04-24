# Product Spec

## Goal

Let users try on eyeglasses online immediately: upload or capture a face photo, choose a frame style, generate one realistic result, and decide whether to keep exploring.

## MVP Workflow

1. User lands on `/` and sees the working studio in the first viewport.
2. User uploads a face photo or uses camera capture.
3. User selects a curated frame style or enters reference notes.
4. User generates one free anonymous try-on.
5. If they generate again, the app asks them to sign up or buy credits.

## Privacy Default

Source face uploads are used for generation and then deleted. The generated result, selected style, prompt metadata, model config, and billing/audit data may be retained.

## Monetization

The first generation is free. Additional generations use paid credits purchased through PayPal Standard Checkout.
