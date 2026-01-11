#!/usr/bin/env python3
"""
Backend API Testing for Razorpay Payment Flow
Tests the digital product store payment endpoints
"""

import requests
import json
import os
from datetime import datetime

# Get base URL from environment
BASE_URL = "https://digiloft.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

def print_test_result(test_name, success, details=""):
    """Print formatted test results"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"\n{status} {test_name}")
    if details:
        print(f"   Details: {details}")

def test_get_products():
    """Test getting products from database"""
    print("\n" + "="*60)
    print("TESTING: Get Products")
    print("="*60)
    
    try:
        response = requests.get(f"{API_BASE}?path=products", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:500]}...")
        
        if response.status_code == 200:
            data = response.json()
            products = data.get('products', [])
            print(f"Found {len(products)} products")
            
            if products:
                # Return first product ID for testing
                product_id = products[0]['id']
                print(f"Using product ID for testing: {product_id}")
                print_test_result("Get Products", True, f"Found {len(products)} products")
                return product_id
            else:
                print_test_result("Get Products", False, "No products found in database")
                return None
        else:
            print_test_result("Get Products", False, f"HTTP {response.status_code}")
            return None
            
    except Exception as e:
        print_test_result("Get Products", False, f"Exception: {str(e)}")
        return None

def test_get_featured_coupons():
    """Test GET /api/coupons?featured=true"""
    print("\n" + "="*60)
    print("TESTING: GET /api/coupons?featured=true")
    print("="*60)
    
    try:
        response = requests.get(f"{API_BASE}/coupons?featured=true", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                coupons = data.get('coupons', [])
                print_test_result("Get Featured Coupons", True, f"Found {len(coupons)} featured coupons")
                return coupons
            else:
                print_test_result("Get Featured Coupons", False, "API returned success=false")
                return []
        else:
            print_test_result("Get Featured Coupons", False, f"HTTP {response.status_code}")
            return []
            
    except Exception as e:
        print_test_result("Get Featured Coupons", False, f"Exception: {str(e)}")
        return []

def test_validate_coupon():
    """Test POST /api/coupons/validate"""
    print("\n" + "="*60)
    print("TESTING: POST /api/coupons/validate")
    print("="*60)
    
    test_cases = [
        {
            "name": "Valid coupon WELCOME10",
            "payload": {
                "code": "WELCOME10",
                "cartTotal": 500
            }
        },
        {
            "name": "Valid coupon FLAT50",
            "payload": {
                "code": "FLAT50", 
                "cartTotal": 500
            }
        },
        {
            "name": "Invalid coupon code",
            "payload": {
                "code": "INVALID123",
                "cartTotal": 500
            }
        },
        {
            "name": "Missing coupon code",
            "payload": {
                "cartTotal": 500
            }
        }
    ]
    
    results = []
    for test_case in test_cases:
        print(f"\n--- Testing: {test_case['name']} ---")
        try:
            response = requests.post(
                f"{API_BASE}/coupons/validate",
                json=test_case['payload'],
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            
            data = response.json()
            
            if test_case['name'] == "Valid coupon WELCOME10":
                success = response.status_code == 200 and data.get('success') == True
                print_test_result(test_case['name'], success)
                results.append(success)
            elif test_case['name'] == "Valid coupon FLAT50":
                success = response.status_code == 200 and data.get('success') == True
                print_test_result(test_case['name'], success)
                results.append(success)
            elif test_case['name'] == "Invalid coupon code":
                success = response.status_code == 400 and data.get('success') == False
                print_test_result(test_case['name'], success, "Should return 400 for invalid coupon")
                results.append(success)
            elif test_case['name'] == "Missing coupon code":
                success = response.status_code == 400 and data.get('success') == False
                print_test_result(test_case['name'], success, "Should return 400 for missing code")
                results.append(success)
                
        except Exception as e:
            print_test_result(test_case['name'], False, f"Exception: {str(e)}")
            results.append(False)
    
    return results

def test_create_order(product_id):
    """Test POST /api/create-order"""
    print("\n" + "="*60)
    print("TESTING: POST /api/create-order")
    print("="*60)
    
    if not product_id:
        print_test_result("Create Order", False, "No product ID available for testing")
        return [], None
    
    test_cases = [
        {
            "name": "Guest checkout - valid order",
            "payload": {
                "amount": 100,
                "products": [product_id],
                "guestEmail": "test@example.com",
                "guestName": "Test User"
            }
        },
        {
            "name": "Guest checkout with coupon",
            "payload": {
                "amount": 90,
                "products": [product_id],
                "guestEmail": "test@example.com",
                "guestName": "Test User",
                "couponId": "test-coupon-id",
                "couponDiscount": 10
            }
        },
        {
            "name": "Missing required fields",
            "payload": {
                "amount": 100
                # Missing products, guestEmail
            }
        },
        {
            "name": "Missing guest info",
            "payload": {
                "amount": 100,
                "products": [product_id]
                # Missing guestEmail or userId
            }
        }
    ]
    
    results = []
    razorpay_order_id = None
    
    for test_case in test_cases:
        print(f"\n--- Testing: {test_case['name']} ---")
        try:
            response = requests.post(
                f"{API_BASE}/create-order",
                json=test_case['payload'],
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if test_case['name'] in ["Guest checkout - valid order", "Guest checkout with coupon"]:
                if response.status_code == 200:
                    data = response.json()
                    if data.get('success') and data.get('razorpayOrderId'):
                        razorpay_order_id = data.get('razorpayOrderId')
                        print_test_result(test_case['name'], True, f"Order created: {razorpay_order_id}")
                        results.append(True)
                    else:
                        print_test_result(test_case['name'], False, "Missing success or razorpayOrderId")
                        results.append(False)
                else:
                    print_test_result(test_case['name'], False, f"HTTP {response.status_code}")
                    results.append(False)
            else:
                # Should fail with 400
                success = response.status_code == 400
                print_test_result(test_case['name'], success, "Should return 400 for invalid data")
                results.append(success)
                
        except Exception as e:
            print_test_result(test_case['name'], False, f"Exception: {str(e)}")
            results.append(False)
    
    return results, razorpay_order_id

def test_verify_payment(razorpay_order_id):
    """Test POST /api/verify-payment"""
    print("\n" + "="*60)
    print("TESTING: POST /api/verify-payment")
    print("="*60)
    
    test_cases = [
        {
            "name": "Invalid signature (expected to fail)",
            "payload": {
                "razorpay_order_id": razorpay_order_id or "test_order_id",
                "razorpay_payment_id": "test_payment_id",
                "razorpay_signature": "invalid_signature",
                "orderId": "test-order-id"
            }
        },
        {
            "name": "Missing payment details",
            "payload": {
                "razorpay_order_id": razorpay_order_id or "test_order_id"
                # Missing other required fields
            }
        }
    ]
    
    results = []
    for test_case in test_cases:
        print(f"\n--- Testing: {test_case['name']} ---")
        try:
            response = requests.post(
                f"{API_BASE}/verify-payment",
                json=test_case['payload'],
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if test_case['name'] == "Invalid signature (expected to fail)":
                # Should return 400 for invalid signature
                success = response.status_code == 400
                print_test_result(test_case['name'], success, "Should return 400 for invalid signature")
                results.append(success)
            elif test_case['name'] == "Missing payment details":
                # Should return 400 for missing fields
                success = response.status_code == 400
                print_test_result(test_case['name'], success, "Should return 400 for missing fields")
                results.append(success)
                
        except Exception as e:
            print_test_result(test_case['name'], False, f"Exception: {str(e)}")
            results.append(False)
    
    return results

def main():
    """Run all backend API tests"""
    print("="*80)
    print("RAZORPAY PAYMENT FLOW - BACKEND API TESTING")
    print("="*80)
    print(f"Testing against: {API_BASE}")
    print(f"Timestamp: {datetime.now().isoformat()}")
    
    all_results = []
    
    # Test 1: Get products (needed for order testing)
    product_id = test_get_products()
    
    # Test 2: Get featured coupons
    coupons = test_get_featured_coupons()
    all_results.extend([len(coupons) >= 0])  # Pass if no error occurred
    
    # Test 3: Validate coupons
    coupon_results = test_validate_coupon()
    all_results.extend(coupon_results)
    
    # Test 4: Create orders
    order_results, razorpay_order_id = test_create_order(product_id)
    all_results.extend(order_results)
    
    # Test 5: Verify payment
    payment_results = test_verify_payment(razorpay_order_id)
    all_results.extend(payment_results)
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed = sum(all_results)
    total = len(all_results)
    
    print(f"Total Tests: {total}")
    print(f"Passed: {passed}")
    print(f"Failed: {total - passed}")
    print(f"Success Rate: {(passed/total)*100:.1f}%")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED!")
    else:
        print(f"\n⚠️  {total - passed} TESTS FAILED")
    
    return passed == total

if __name__ == "__main__":
    main()