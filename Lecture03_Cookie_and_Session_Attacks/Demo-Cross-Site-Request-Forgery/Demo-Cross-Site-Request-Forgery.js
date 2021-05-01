const express = require('express')
const cookieParser = require('cookie-parser')
const { createReadStream } = require('fs')
const { randomBytes } = require('crypto')

const COOKIE_SECRET = 'asdasdsfwehninicwecwee';

const app = express()
app.use(cookieParser(COOKIE_SECRET));
app.use(express.urlencoded({ extended: false }))

const USERS = { alice: 'password', bob: 'bob' }
const BALANCES = { alice: 500, bob: 200 }

const SESSIONS = {} //disctionary for sessionid =>{ username }

app.get('/', (req, res) => {
    const sessionId = req.cookies.sessionId
    const username = SESSIONS[sessionId]

    if (username) {
        res.send(`
            Hi ${username}. Your balance is $${BALANCES[username]}.
            <form method='POST' action='http://localhost:4000/transfer'>
                Send amount:
                <input name='amount' />
                To user:
                <input name='to' />
                <input type='submit' value='Send' />
            </form>
         `);
    } else {
        createReadStream('index.html').pipe(res)
    }
});


//from server to web-browser
app.post('/login', (req, res) => {
    const username = req.body.username
    const password = USERS[username]
    if (password === req.body.password) {
        const nextSessionId = randomBytes(16).toString('hex');
        SESSIONS[nextSessionId] = username;

        res.cookie('sessionId', nextSessionId, {
            secure: true,
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        })

        res.redirect('/')
    } else {
        res.send('fail')
    }

})


app.post('/transfer', (req, res) => {
    const sessionId = req.cookies.sessionId;
    const username = SESSIONS[sessionId];
    if (!username) {
        res.send('fail!');
        return
    }
    const amount = Number(req.body.amount);
    const to = req.body.to;
    BALANCES[username] -= amount;
    BALANCES[to] += amount;
    res.redirect('/');
})


app.get('/logout', (req, res) => {
    const sessionId = req.cookies.sessionId;
    delete SESSIONS[sessionId];
    res.clearCookie('sessionId', {
        secure: true,
        httpOnly: true,
        sameSite: 'lax'
    })
    res.redirect('/');
})


app.listen(4000)