import urllib.request
import json
import uuid

# Note: We can only mock the endpoints or assume some API responses if JWT is required, 
# because we don't have a valid JWT. But we can test the structure and error handling.
# A full regression test requires proper JWT or disabling auth in a test env.

API_BASE = 'https://noppasinp.vercel.app/api'
test_post_id = 'test_' + str(uuid.uuid4())[:8]

def test_api():
    print("Running Regression Test for Admin API Endpoints...")
    
    # 1. Test POST /api/posts (Expect 401 Unauthorized because we don't have a token)
    print("\n--- Test POST /api/posts ---")
    data = json.dumps({
        "title": "Test Post",
        "category": "Science",
        "summary": "Summary",
        "content": "<p>Content</p>"
    }).encode('utf-8')
    req = urllib.request.Request(f"{API_BASE}/posts", data=data, method="POST")
    req.add_header("Content-Type", "application/json")
    try:
        urllib.request.urlopen(req)
        print("FAIL: Expected 401 Unauthorized but request succeeded.")
    except urllib.error.HTTPError as e:
        if e.code == 401:
            print("PASS: POST /api/posts correctly returned 401 Unauthorized for unauthenticated request.")
        else:
            print(f"WARN: POST /api/posts returned HTTP {e.code}: {e.read().decode('utf-8', errors='ignore')}")

    # 2. Test GET /api/posts/detail?id=invalid (Expect 400 or 404)
    print("\n--- Test GET /api/posts/detail?id=invalid ---")
    req = urllib.request.Request(f"{API_BASE}/posts/detail?id=invalid")
    try:
        urllib.request.urlopen(req)
        print("FAIL: Expected 400 Bad Request but request succeeded.")
    except urllib.error.HTTPError as e:
        if e.code in (400, 404):
            print(f"PASS: GET /api/posts/detail correctly handled invalid ID with {e.code}.")
        else:
            print(f"WARN: GET /api/posts/detail returned HTTP {e.code}.")

    # 3. Test DELETE /api/posts/detail (Expect 401)
    print("\n--- Test DELETE /api/posts/detail ---")
    req = urllib.request.Request(f"{API_BASE}/posts/detail?id=123", method="DELETE")
    try:
        urllib.request.urlopen(req)
        print("FAIL: Expected 401 Unauthorized but request succeeded.")
    except urllib.error.HTTPError as e:
        if e.code == 401:
            print("PASS: DELETE /api/posts/detail correctly returned 401 Unauthorized.")
        else:
            print(f"WARN: DELETE returned HTTP {e.code}.")
            
    print("\nAll regression tests completed.")

if __name__ == '__main__':
    test_api()
