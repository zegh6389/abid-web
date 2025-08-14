# API Test Suite for abid-web
param()

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
        
        $status = if ($result.Success) { "[PASS]" } else { "[FAIL]" }
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
        
        Write-Host "[ERROR] | $Method $Endpoint | $($_.Exception.Message) | $($result.ResponseTime)"
        return $result
    }
}

Write-Host "Starting API Test Suite for abid-web" -ForegroundColor Green
Write-Host ""

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

# Admin Auth
$results += Test-Endpoint -Name "Admin Me (No Auth)" -Method "GET" -Endpoint "/api/admin/me" -ExpectedStatus 401
$results += Test-Endpoint -Name "Admin Login (No Credentials)" -Method "POST" -Endpoint "/api/admin/login" -Body @{} -ExpectedStatus 400

# Sentinel APIs
$results += Test-Endpoint -Name "Sentinel Status" -Method "GET" -Endpoint "/api/sentinel/status"
$results += Test-Endpoint -Name "DB Off Sentinel Status" -Method "GET" -Endpoint "/api/db_off_sentinel_status"

# Protected endpoints
$results += Test-Endpoint -Name "Create Product (No Auth)" -Method "POST" -Endpoint "/api/products" -Body @{ title = "Test Product" } -ExpectedStatus 401
$results += Test-Endpoint -Name "Uploads Presign (No Auth)" -Method "POST" -Endpoint "/api/uploads/presign" -Body @{ filename = "test.jpg" } -ExpectedStatus 401

# Test invalid data
$results += Test-Endpoint -Name "Create Order (Invalid Data)" -Method "POST" -Endpoint "/api/orders" -Body @{ invalid = "data" } -ExpectedStatus 400
$results += Test-Endpoint -Name "Payment Checkout (Invalid Data)" -Method "POST" -Endpoint "/api/payments/checkout" -Body @{ invalid = "data" } -ExpectedStatus 400

# Reviews
$results += Test-Endpoint -Name "Get Reviews (Non-existent Product)" -Method "GET" -Endpoint "/api/products/999/reviews"

# Cron
$results += Test-Endpoint -Name "Cron Catalog Sync" -Method "GET" -Endpoint "/api/cron/catalogSync"

# Generate summary
$totalTime = (Get-Date) - $startTime
$passed = ($results | Where-Object { $_.Success }).Count
$failed = ($results | Where-Object { -not $_.Success }).Count
$total = $results.Count

Write-Host ""
Write-Host "TEST RESULTS SUMMARY" -ForegroundColor Yellow
Write-Host "===================="
Write-Host "Total Tests: $total"
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red
Write-Host "Total Time: $([math]::Round($totalTime.TotalMilliseconds))ms"
Write-Host "Success Rate: $([math]::Round(($passed/$total) * 100, 1))%"

if ($failed -gt 0) {
    Write-Host ""
    Write-Host "FAILED TESTS:" -ForegroundColor Red
    $results | Where-Object { -not $_.Success } | ForEach-Object {
        Write-Host "- $($_.Method) $($_.Endpoint): Expected $($_.ExpectedStatus), got $($_.Status)" -ForegroundColor Red
    }
}

# Generate report
$reportContent = @"
# API Test Report - abid-web

**Generated:** $(Get-Date)
**Base URL:** $API_BASE

## Summary

- Total Tests: $total
- Passed: $passed
- Failed: $failed  
- Success Rate: $([math]::Round(($passed/$total) * 100, 1))%
- Total Time: $([math]::Round($totalTime.TotalMilliseconds))ms

## Test Results

"@

$results | ForEach-Object {
    $status = if ($_.Success) { "PASS" } else { "FAIL" }
    $reportContent += "- [$status] $($_.Method) $($_.Endpoint) - Expected: $($_.ExpectedStatus), Got: $($_.Status) ($($_.ResponseTime))`n"
}

if ($failed -gt 0) {
    $reportContent += "`n## Failed Test Details`n"
    $results | Where-Object { -not $_.Success } | ForEach-Object {
        $reportContent += "`n### $($_.Method) $($_.Endpoint)`n"
        $reportContent += "- Expected: $($_.ExpectedStatus)`n"
        $reportContent += "- Actual: $($_.Status)`n" 
        $reportContent += "- Time: $($_.ResponseTime)`n"
        if ($_.Response -and $_.Status -eq "ERROR") {
            $reportContent += "- Error: $($_.Response)`n"
        }
    }
}

# Save report
New-Item -ItemType Directory -Force -Path "testsprite_tests" | Out-Null
$reportContent | Out-File -FilePath "testsprite_tests\api-test-report.md" -Encoding UTF8

Write-Host ""
Write-Host "Report saved to: testsprite_tests\api-test-report.md" -ForegroundColor Green
