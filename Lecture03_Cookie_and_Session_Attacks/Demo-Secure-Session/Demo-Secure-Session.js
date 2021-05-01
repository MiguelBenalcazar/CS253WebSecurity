const express = require('express')
const cookieParser = require('cookie-parser')
const { createReadStream } = require('fs')
const {randomBytes} = require('crypto')

const COOKIE_SECRET = 'asdasdsfwehninicwecwee';


const app = express()
app.use(cookieParser(COOKIE_SECRET));
app.use(express.urlencoded({ extended: false }))



const USERS = { alice: 'password', bob: '50505' }
const BALANCES = { alice: 500, bob: 100 }


const SESSIONS = {} //disctionary for sessionid =>{ username }



app.get('/', (req, res) => {
    const sessionId = req.cookies.sessionId
    const username = SESSIONS[sessionId]

    if (username) {
        res.send(`Hi ${username}. Your balance is $${BALANCES[username]} `);
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
        res.cookie("sessionId", nextSessionId);
        res.redirect('/')
    } else {
        res.send('fail')
    }

})

app.get('/logout', (req, res) => {
    const sessionId = req.cookies.sessionId;
    delete SESSIONS[sessionId];
    res.clearCookie('sessionId');
    res.redirect('/');
})




app.listen(4000)