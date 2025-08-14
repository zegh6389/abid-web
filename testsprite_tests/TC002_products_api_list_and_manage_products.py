import urllib.request
import urllib.error


def test_health_endpoint():
    url = "http://localhost:3000/api/health"
    try:
        req = urllib.request.Request(url, method="GET")
        with urllib.request.urlopen(req, timeout=10) as resp:
            status = resp.getcode()
            body = resp.read().decode(errors="replace")
    except Exception as e:
        assert False, f"Request to {url} failed: {e}"

    assert status == 200, f"Expected HTTP 200 from {url}, got {status}. Response body: {body}"
    print(f"Health check passed: {status}")


if __name__ == '__main__':
    test_health_endpoint()