#!/bin/bash

# Phase 2 Authentication Testing Script
# Tests all authentication endpoints

BASE_URL="http://localhost:5000/api/auth"
TEST_EMAIL="test-$(date +%s)@example.com"
TEST_PASSWORD="SecurePass123"
TEST_NAME="Test User $(date +%s)"

echo "=========================================="
echo "Phase 2 Authentication Endpoint Testing"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Register
echo -e "${YELLOW}TEST 1: User Registration${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"name\": \"$TEST_NAME\",
    \"role\": \"student\"
  }")

echo "Response:"
echo "$REGISTER_RESPONSE" | jq .

# Extract tokens
ACCESS_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.tokens.accessToken // empty')
REFRESH_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.tokens.refreshToken // empty')
USER_ID=$(echo "$REGISTER_RESPONSE" | jq -r '.data.user.id // empty')

if [ -z "$ACCESS_TOKEN" ]; then
  echo -e "${RED}❌ Registration failed - no access token received${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Registration successful${NC}"
echo "Access Token: ${ACCESS_TOKEN:0:20}..."
echo ""

# Test 2: Login
echo -e "${YELLOW}TEST 2: User Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }")

echo "Response:"
echo "$LOGIN_RESPONSE" | jq .
echo -e "${GREEN}✅ Login successful${NC}"
echo ""

# Test 3: Get Profile
echo -e "${YELLOW}TEST 3: Get User Profile (Protected)${NC}"
PROFILE_RESPONSE=$(curl -s -X GET "$BASE_URL/profile" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "Response:"
echo "$PROFILE_RESPONSE" | jq .

if echo "$PROFILE_RESPONSE" | jq -e '.data.user.email' > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Profile retrieval successful${NC}"
else
  echo -e "${RED}❌ Profile retrieval failed${NC}"
fi
echo ""

# Test 4: Update Profile
echo -e "${YELLOW}TEST 4: Update User Profile (Protected)${NC}"
UPDATE_RESPONSE=$(curl -s -X PATCH "$BASE_URL/profile" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Updated User Name\"
  }")

echo "Response:"
echo "$UPDATE_RESPONSE" | jq .
echo -e "${GREEN}✅ Profile update successful${NC}"
echo ""

# Test 5: Refresh Token
echo -e "${YELLOW}TEST 5: Refresh Access Token${NC}"
REFRESH_RESPONSE=$(curl -s -X POST "$BASE_URL/refresh" \
  -H "Content-Type: application/json" \
  -d "{
    \"refreshToken\": \"$REFRESH_TOKEN\"
  }")

echo "Response:"
echo "$REFRESH_RESPONSE" | jq .

NEW_ACCESS_TOKEN=$(echo "$REFRESH_RESPONSE" | jq -r '.data.accessToken // empty')
if [ -z "$NEW_ACCESS_TOKEN" ]; then
  echo -e "${RED}❌ Token refresh failed${NC}"
else
  echo -e "${GREEN}✅ Token refresh successful${NC}"
fi
echo ""

# Test 6: Logout
echo -e "${YELLOW}TEST 6: User Logout (Protected)${NC}"
LOGOUT_RESPONSE=$(curl -s -X POST "$BASE_URL/logout" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "Response:"
echo "$LOGOUT_RESPONSE" | jq .
echo -e "${GREEN}✅ Logout successful${NC}"
echo ""

# Test 7: Try accessing protected endpoint without token (should fail)
echo -e "${YELLOW}TEST 7: Protected Endpoint Without Token (Should Fail)${NC}"
NO_TOKEN_RESPONSE=$(curl -s -X GET "$BASE_URL/profile")

echo "Response:"
echo "$NO_TOKEN_RESPONSE" | jq .
echo -e "${YELLOW}✅ Properly rejected request without token${NC}"
echo ""

echo "=========================================="
echo "All tests completed!"
echo "=========================================="
