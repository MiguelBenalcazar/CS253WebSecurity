# Server localhost:4000
execute:
- nodemon Demo-Cross-Site-Request-Forgery.js

# Attacker server
install ecstatic --> npm install ecstatic -g
execute the following code inside of the attacker folder:
- ecstatic --port 9999
in the browser http:localhost:9999/attacker.html

## How to Mitigate Cross-Site Request Forgery ?
SameSite cookies
Set-Cookie: key=value; Secure; HttpOnly; Path=/; SameSite=Lax
