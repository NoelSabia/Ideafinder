# Authentication Integration for Stripe Payments

This document outlines the authentication requirements and user account management integrated with the Stripe payment system.

## Key Changes Made

### 1. Database Schema Updates
- Added subscription management fields to users table:
  - `subscription_plan`: Current plan (spark/innovator/visionary/inactive)
  - `subscription_status`: Status (active/inactive)
  - `subscription_start_date`: When subscription started
  - `subscription_end_date`: When subscription expires (NULL for one-time purchases)
  - `stripe_customer_id`: Stripe customer ID for future use
  - `credits_remaining`: Number of idea credits available

### 2. Authentication Requirements
- **Checkout Protection**: Users must be logged in to access `/checkout`
- **Payment Intent Security**: User ID/email required for payment processing
- **Session Validation**: Real-time session checking throughout the flow

### 3. Backend Enhancements

#### Payment Intent Creation (`/create-payment-intent`)
- Now requires `user_id` or `user_email` 
- Validates authentication before creating payment intent
- Includes user metadata in Stripe payment intent

#### Webhook Processing (`/webhook/stripe`)
- Automatically updates user subscription on successful payment
- Credits assignment based on plan type:
  - **Spark**: 1 credit (one-time)
  - **Innovator**: 4 credits (monthly)
  - **Visionary**: 20 credits (monthly)
- Subscription expiration handling for recurring plans

#### User Subscription Status (`/user/subscription/{user_id}`)
- Returns current plan, status, credits, and expiration date
- Real-time subscription validation

### 4. Frontend Enhancements

#### Checkout Flow Protection
- Authentication check before showing payment form
- Redirect to login/signup if unauthenticated  
- User session data passed to payment processing

#### Account Management (`/account`)
- Real-time subscription status display
- Credits remaining counter
- Plan expiration dates
- Upgrade/downgrade options

#### Payment Processing
- User information automatically included in payment requests
- Better error handling for authentication failures
- Success page shows plan-specific confirmation

## User Flow

1. **User visits pricing page** → Can browse plans without authentication
2. **User selects a plan** → Redirected to `/checkout?plan=<plan_name>`
3. **Authentication check** → Must login/signup to continue
4. **Payment processing** → User data included in Stripe payment intent
5. **Payment success** → Webhook automatically updates user subscription
6. **Account management** → User can view status in `/account` page

## Security Features

- ✅ Authentication required for all payment operations
- ✅ User data validation in payment intents
- ✅ Secure webhook signature verification  
- ✅ Rate limiting on payment endpoints
- ✅ Input sanitization and validation
- ✅ Session-based access control

## Plan Benefits

| Plan | Price | Credits | Duration | Features |
|------|-------|---------|----------|----------|
| Spark | €1 | 1 | One-time | Basic access |
| Innovator | €3/month | 4 | 30 days | E-Book + Priority Support |
| Visionary | €5/month | 20 | 30 days | All features + Early access |

## Testing Checklist

- [ ] Unauthenticated users cannot access checkout
- [ ] Payment requires valid user session
- [ ] Successful payments update user subscription
- [ ] Account page shows correct subscription status
- [ ] Credits are properly assigned per plan
- [ ] Subscription expiration is handled correctly
- [ ] Webhook properly processes payment events

## Environment Variables Required

```bash
# Authentication
AUTH_SECRET="your-auth-secret"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Database
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="your-password"
POSTGRES_DB="ideafinder"
```

This integration ensures that all payments are properly associated with user accounts and that subscription benefits are automatically applied upon successful payment.
