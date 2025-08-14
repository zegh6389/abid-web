import requests


def test_health_api():
    url = "http://localhost:3000/api/health"
    try:
        resp = requests.get(url, timeout=10)
    except Exception as e:
        assert False, f"Request to {url} failed: {e}"

    assert resp.status_code == 200, f"Expected status 200 from {url}, got {resp.status_code}. Body: {resp.text}"


# Call the test
if __name__ == "__main__":
    test_health_api()
    print('Test passed')