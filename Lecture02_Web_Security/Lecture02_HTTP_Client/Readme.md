# Demo: Implement an HTTP client 

• Open a TCP socket
• Send HTTP request text over the socket
• Read the HTTP response text from the socket

### What happens when you type a URL and press enter?

1. Perform a DNS lookup on the hostname (example.com) to get an IP address (1.2.3.4)
2. Open a TCP socket to 1.2.3.4 on port 80 (the HTTP port)
3. Send an HTTP request that includes the desired path (/)
4. Read the HTTP response from the socket
5. Parse the HTML into the DOM
6. Render the page based on the DOM
7. Repeat until all external resources are loaded:
    • If there are pending external resources, make HTTP requests for these (run steps 1-4)
    • Render the resources into the page