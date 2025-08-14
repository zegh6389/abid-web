# API Test Suite for abid-web
# PowerShell script to test all API endpoints

$API_BASE = "http://127.0.0.1:3000"
$results = @()
$startTime = Get-Date

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Endpoint,
        [object]$Body = $null,
        [int]$ExpectedStatus = 200
    )
    
    $url = "$API_BASE$Endpoint"
    $start = Get-Date
    
    try {
        $headers = @{
            'Content-Type' = 'application/json'
            'User-Agent' = 'API-Test-Suite/1.0'
        }
        
        $params = @{
            Uri = $url
            Method = $Method
            Headers = $headers
            TimeoutSec = 30
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json)
        }
        
        $response = Invoke-WebRequest @params -SkipHttpErrorCheck
        $responseTime = (Get-Date) - $start
        
        $result = [PSCustomObject]@{
            Name = $Name
            Method = $Method
            Endpoint = $Endpoint
            URL = $url
            Status = $response.StatusCode
            ExpectedStatus = $ExpectedStatus
            ResponseTime = "$([math]::Round($responseTime.TotalMilliseconds))ms"
            Success = ($response.StatusCode -eq $ExpectedStatus)
            Response = $response.Content
        }
        
        $status = if ($result.Success) { "✅ PASS" } else { "❌ FAIL" }
        Write-Host "$status | $Method $Endpoint | $($response.StatusCode) | $($result.ResponseTime)"
        
        return $result
    }
    catch {
        $responseTime = (Get-Date) - $start
        $result = [PSCustomObject]@{
            Name = $Name
            Method = $Method
            Endpoint = $Endpoint
            URL = $url
            Status = "ERROR"
            ExpectedStatus = $ExpectedStatus
            ResponseTime = "$([math]::Round($responseTime.TotalMilliseconds))ms"
            Success = $false
            Response = $_.Exception.Message
        }
        
        Write-Host "❌ ERROR | $Method $Endpoint | $($_.Exception.Message) | $($result.ResponseTime)"
        return $result
    }
}

Write-Host "🚀 Starting API Test Suite for abid-web`n" -ForegroundColor Green

# Health Check
$results += Test-Endpoint -Name "Health Check" -Method "GET" -Endpoint "/api/health"

# Products API
$results += Test-Endpoint -Name "List Products" -Method "GET" -Endpoint "/api/products"
$results += Test-Endpoint -Name "Get Non-existent Product" -Method "GET" -Endpoint "/api/products/999" -ExpectedStatus 404
$results += Test-Endpoint -Name "Get Non-existent Product by Slug" -Method "GET" -Endpoint "/api/products/slug/non-existent" -ExpectedStatus 404

# Collections API  
$results += Test-Endpoint -Name "List Collections" -Method "GET" -Endpoint "/api/collections"
$results += Test-Endpoint -Name "Get Non-existent Collection" -Method "GET" -Endpoint "/api/collections/999" -ExpectedStatus 404

# Orders API
$results += Test-Endpoint -Name "List Orders" -Method "GET" -Endpoint "/api/orders"
$results += Test-Endpoint -Name "Get Non-existent Order" -Method "GET" -Endpoint "/api/orders/999" -ExpectedStatus 404

# Admin Auth (should fail without credentials)
$results += Test-Endpoint -Name "Admin Me (No Auth)" -Method "GET" -Endpoint "/api/admin/me" -ExpectedStatus 401
$results += Test-Endpoint -Name "Admin Login (No Credentials)" -Method "POST" -Endpoint "/api/admin/login" -Body @{} -ExpectedStatus 400

# Sentinel APIs
$results += Test-Endpoint -Name "Sentinel Status" -Method "GET" -Endpoint "/api/sentinel/status"
$results += Test-Endpoint -Name "DB Off Sentinel Status" -Method "GET" -Endpoint "/api/db_off_sentinel_status"

# Protected endpoints (should return 401/403 without auth)
$results += Test-Endpoint -Name "Create Product (No Auth)" -Method "POST" -Endpoint "/api/products" -Body @{ title = "Test Product" } -ExpectedStatus 401
$results += Test-Endpoint -Name "Uploads Presign (No Auth)" -Method "POST" -Endpoint "/api/uploads/presign" -Body @{ filename = "test.jpg" } -ExpectedStatus 401

# Test order creation with invalid data
$results += Test-Endpoint -Name "Create Order (Invalid Data)" -Method "POST" -Endpoint "/api/orders" -Body @{ invalid = "data" } -ExpectedStatus 400

# Test payment checkout with invalid data
$results += Test-Endpoint -Name "Payment Checkout (Invalid Data)" -Method "POST" -Endpoint "/api/payments/checkout" -Body @{ invalid = "data" } -ExpectedStatus 400

# Test reviews for non-existent product
$results += Test-Endpoint -Name "Get Reviews (Non-existent Product)" -Method "GET" -Endpoint "/api/products/999/reviews"

# Test cron endpoint
$results += Test-Endpoint -Name "Cron Catalog Sync" -Method "GET" -Endpoint "/api/cron/catalogSync"

# Generate summary
$totalTime = (Get-Date) - $startTime
$passed = ($results | Where-Object { $_.Success }).Count
$failed = ($results | Where-Object { -not $_.Success }).Count
$total = $results.Count

Write-Host "`n📊 TEST RESULTS SUMMARY" -ForegroundColor Yellow
Write-Host "========================" -ForegroundColor Yellow
Write-Host "Total Tests: $total"
Write-Host "✅ Passed: $passed" -ForegroundColor Green
Write-Host "❌ Failed: $failed" -ForegroundColor Red
Write-Host "🕐 Total Time: $([math]::Round($totalTime.TotalMilliseconds))ms"
Write-Host "📈 Success Rate: $([math]::Round(($passed/$total) * 100, 1))%"

if ($failed -gt 0) {
    Write-Host "`n❌ FAILED TESTS:" -ForegroundColor Red
    $results | Where-Object { -not $_.Success } | ForEach-Object {
        Write-Host "- $($_.Method) $($_.Endpoint): Expected $($_.ExpectedStatus), got $($_.Status)" -ForegroundColor Red
        if ($_.Response -and $_.Status -eq "ERROR") {
            Write-Host "  Error: $($_.Response)" -ForegroundColor Red
        }
    }
}

# Generate markdown report
$markdown = @"
# API Test Report - abid-web

**Generated:** $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
**Base URL:** $API_BASE

## Summary

| Metric | Value |
|--------|-------|
| Total Tests | $total |
| ✅ Passed | $passed |
| ❌ Failed | $failed |
| Success Rate | $([math]::Round(($passed/$total) * 100, 1))% |
| Total Time | $([math]::Round($totalTime.TotalMilliseconds))ms |

## Test Results

| Status | Method | Endpoint | Expected | Actual | Time | Response |
|--------|--------|----------|----------|---------|------|----------|
"@

$results | ForEach-Object {
    $status = if ($_.Success) { "✅" } else { "❌" }
    $response = if ($_.Response.Length -gt 100) { $_.Response.Substring(0, 100) + "..." } else { $_.Response }
    $response = $response -replace "`n", " " -replace "`r", ""
    $markdown += "`n| $status | $($_.Method) | $($_.Endpoint) | $($_.ExpectedStatus) | $($_.Status) | $($_.ResponseTime) | $response |"
}

if ($failed -gt 0) {
    $markdown += "`n`n## Failed Tests Details`n"
    $results | Where-Object { -not $_.Success } | ForEach-Object {
        $markdown += "`n### $($_.Method) $($_.Endpoint)`n"
        $markdown += "- **Expected Status:** $($_.ExpectedStatus)`n"
        $markdown += "- **Actual Status:** $($_.Status)`n"
        $markdown += "- **Response Time:** $($_.ResponseTime)`n"
        if ($_.Response) {
            $markdown += "- **Response:** ``````text`n$($_.Response)`n```````n"
        }
    }
}

# Save report
$reportPath = "testsprite_tests\api-test-report.md"
New-Item -ItemType Directory -Force -Path "testsprite_tests" | Out-Null
$markdown | Out-File -FilePath $reportPath -Encoding UTF8

Write-Host "`n📝 Detailed report saved to: $reportPath" -ForegroundColor Green
