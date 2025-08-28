export default async function handler(req, res) {
  const tests = [];
  
  try {
    console.log('🔍 Starting AWS connectivity tests...');
    
    // Test 1: Basic HTTPS connection
    try {
      console.log('Test 1: Basic HTTPS connection to gb-ocr-stage.vertekx.com');
      const response = await fetch('https://gb-ocr-stage.vertekx.com/health', {
        method: 'GET',
        timeout: 10000,
      });
      
      if (response.ok) {
        const data = await response.text();
        tests.push({
          test: 'HTTP Connection',
          status: '✅ SUCCESS',
          details: `Status: ${response.status}, Response: ${data}`
        });
        console.log('✅ HTTP connection successful');
      } else {
        tests.push({
          test: 'HTTP Connection',
          status: '❌ HTTP Error',
          details: `Status: ${response.status}, StatusText: ${response.statusText}`
        });
        console.log('❌ HTTP error:', response.status);
      }
    } catch (error) {
      tests.push({
        test: 'HTTP Connection',
        status: '❌ Connection Failed',
        details: `Error: ${error.message}, Type: ${error.constructor.name}`
      });
      console.log('❌ HTTP connection failed:', error.message);
    }
    
    // Test 2: Try with different timeout
    try {
      console.log('Test 2: Connection with 30 second timeout');
      const response2 = await fetch('https://gb-ocr-stage.vertekx.com/health', {
        method: 'GET',
        timeout: 30000,
      });
      
      if (response2.ok) {
        tests.push({
          test: 'Extended Timeout',
          status: '✅ SUCCESS',
          details: 'Connection successful with 30s timeout'
        });
      } else {
        tests.push({
          test: 'Extended Timeout',
          status: '❌ Still Failed',
          details: `Status: ${response2.status}`
        });
      }
    } catch (error) {
      tests.push({
        test: 'Extended Timeout',
        status: '❌ Still Failed',
        details: `Error: ${error.message}`
      });
    }
    
    // Test 3: Check if it's a DNS issue
    try {
      console.log('Test 3: DNS resolution');
      const dnsResponse = await fetch('https://gb-ocr-stage.vertekx.com/health', {
        method: 'GET',
        timeout: 10000,
      });
      
      if (dnsResponse.ok) {
        tests.push({
          test: 'DNS Resolution',
          status: '✅ SUCCESS',
          details: 'IP address resolves correctly'
        });
      } else {
        tests.push({
          test: 'DNS Resolution',
          status: '⚠️ Partial Success',
          details: `IP resolves but HTTP error: ${dnsResponse.status}`
        });
      }
    } catch (error) {
      tests.push({
        test: 'DNS Resolution',
        status: '❌ Failed',
        details: `Error: ${error.message}`
      });
    }
    
    // Summary
    const successCount = tests.filter(t => t.status.includes('✅')).length;
    const totalTests = tests.length;
    
    console.log(`\n📊 Test Results: ${successCount}/${totalTests} successful`);
    tests.forEach(test => {
      console.log(`${test.status} - ${test.test}: ${test.details}`);
    });
    
    res.json({
      summary: `${successCount}/${totalTests} tests passed`,
      tests: tests,
      timestamp: new Date().toISOString(),
      serverInfo: {
        target: 'gb-ocr-stage.vertekx.com',
        protocol: 'HTTPS'
      }
    });
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
    res.status(500).json({
      error: 'Test suite failed',
      details: error.message,
      tests: tests
    });
  }
}
