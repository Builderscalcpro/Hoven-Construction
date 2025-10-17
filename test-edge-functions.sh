#!/bin/bash

# Test script for edge functions
# Usage: ./test-edge-functions.sh [function-name]

PROJECT_URL="https://your-project.supabase.co"

echo "🧪 Edge Functions Test Suite"
echo "=============================="
echo ""

# Test AI Chatbot
test_ai_chatbot() {
  echo "Testing ai-chatbot..."
  curl -X POST "$PROJECT_URL/functions/v1/ai-chatbot" \
    -H "Content-Type: application/json" \
    -d '{"message": "Hello, how can you help me?"}' \
    -w "\nStatus: %{http_code}\n"
  echo ""
}

# Test Send Email
test_send_email() {
  echo "Testing send-email..."
  curl -X POST "$PROJECT_URL/functions/v1/send-email" \
    -H "Content-Type: application/json" \
    -d '{
      "to": "test@example.com",
      "subject": "Test Email",
      "html": "<h1>Test</h1>"
    }' \
    -w "\nStatus: %{http_code}\n"
  echo ""
}

# Test AI Email Suggestions
test_ai_email() {
  echo "Testing ai-email-suggestions..."
  curl -X POST "$PROJECT_URL/functions/v1/ai-email-suggestions" \
    -H "Content-Type: application/json" \
    -d '{
      "context": "Customer inquiry about kitchen remodel",
      "recipientName": "John Doe",
      "emailType": "follow-up"
    }' \
    -w "\nStatus: %{http_code}\n"
  echo ""
}

# Test AI Project Estimator
test_ai_estimator() {
  echo "Testing ai-project-estimator..."
  curl -X POST "$PROJECT_URL/functions/v1/ai-project-estimator" \
    -H "Content-Type: application/json" \
    -d '{
      "projectType": "Kitchen Remodel",
      "scope": "Full renovation",
      "materials": "Mid-range",
      "location": "California"
    }' \
    -w "\nStatus: %{http_code}\n"
  echo ""
}

# Test Payment Intent
test_payment_intent() {
  echo "Testing stripe-create-payment-intent..."
  curl -X POST "$PROJECT_URL/functions/v1/stripe-create-payment-intent" \
    -H "Content-Type: application/json" \
    -d '{
      "amount": 5000,
      "currency": "usd"
    }' \
    -w "\nStatus: %{http_code}\n"
  echo ""
}

# Run all tests or specific test
if [ -z "$1" ]; then
  echo "Running all tests..."
  test_ai_chatbot
  test_send_email
  test_ai_email
  test_ai_estimator
  test_payment_intent
else
  case $1 in
    "chatbot") test_ai_chatbot ;;
    "email") test_send_email ;;
    "ai-email") test_ai_email ;;
    "estimator") test_ai_estimator ;;
    "payment") test_payment_intent ;;
    *) echo "Unknown test: $1" ;;
  esac
fi

echo "✅ Tests complete!"
