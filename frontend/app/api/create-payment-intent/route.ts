import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { rateLimit } from "@/lib/rateLimit";
import { logger } from "@/lib/logger";

// Validate environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY environment variable is required");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

// Rate limiter: 10 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10,
});

// Request validation schema
interface CreatePaymentIntentRequest {
  amount: number;
  planType?: string;
  user_id?: string;
  user_email?: string;
}

function validatePaymentRequest(data: any): data is CreatePaymentIntentRequest {
  // Basic structure validation
  if (typeof data !== "object" || data === null) {
    return false;
  }
  
  // Amount validation
  if (typeof data.amount !== "number" || !Number.isInteger(data.amount)) {
    return false;
  }
  
  // Amount range validation (50 cents minimum, 999,999.99 EUR maximum)
  if (data.amount < 50 || data.amount > 99999999) {
    return false;
  }
  
  // Ensure amount is safe integer
  if (!Number.isSafeInteger(data.amount)) {
    return false;
  }
  
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Set security headers
    const headers = {
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
    };

    // Rate limiting check
    const ip = request.headers.get('x-forwarded-for') ?? 
               request.headers.get('x-real-ip') ?? 
               'anonymous';
    const rateLimitResult = limiter(ip);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { 
          status: 429, 
          headers: {
            ...headers,
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
          }
        }
      );
    }

    // Check content type
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 400, headers }
      );
    }

    // Check content length (prevent large payloads)
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 1024) { // 1KB limit
      return NextResponse.json(
        { error: "Request payload too large" },
        { status: 413, headers }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400, headers }
      );
    }

    // Validate request data
    if (!validatePaymentRequest(body)) {
      return NextResponse.json(
        {
          error:
            "Invalid amount. Amount must be between €0.50 and €999,999.99",
        },
        { status: 400, headers }
      );
    }

    const { amount, planType, user_id, user_email } = body;

    // Validate user authentication
    if (!user_id && !user_email) {
      return NextResponse.json(
        { error: "User authentication required" },
        { status: 401, headers }
      );
    }

    // Create payment intent with additional security measures
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        integration_check: "accept_a_payment",
        created_at: new Date().toISOString(),
        plan_type: planType || "unknown",
        user_id: user_id || "",
        user_email: user_email || "",
      },
    });

    // Log successful payment intent creation
    logger.info("Payment intent created successfully", {
      paymentIntentId: paymentIntent.id,
      amount,
      currency: "eur",
      planType,
    });

    return NextResponse.json(
      { clientSecret: paymentIntent.client_secret },
      { headers }
    );
  } catch (error) {
    // Log error for debugging (without exposing sensitive information)
    logger.error("Payment Intent creation failed", {
      error: error instanceof Error ? error.message : "Unknown error",
      errorType: error?.constructor?.name,
    });

    // Return generic error message to client
    if (error instanceof Stripe.errors.StripeError) {
      // Handle Stripe-specific errors
      return NextResponse.json(
        { error: "Payment processing error occurred" },
        { status: 402, headers: {
          "Content-Type": "application/json",
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
          "X-XSS-Protection": "1; mode=block",
        }}
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: "Internal server error occurred" },
      { status: 500, headers: {
        "Content-Type": "application/json",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
      }}
    );
  }
}
