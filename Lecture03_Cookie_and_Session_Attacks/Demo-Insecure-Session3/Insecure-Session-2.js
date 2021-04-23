const express = require('express')
const cookieParser = require('cookie-parser')
const { createReadStream } = require('fs')
const bodyParser = require('body-parser')

const COOKIE_SECRET = 'asdasdsfwehninicwecwee';


const app = express()
app.use(cookieParser(COOKIE_SECRET));
app.use(bodyParser.urlencoded({ extended: false}))



const USERS = { alice: 'password', bob: '50505'}
const BALANCES = { alice: 500, bob: 100 }


app.get('/', (req, res)=>{
    const username = req.signedCookies.username;
    if(username){
        res.send(`Hi ${username}. Your balance is $${BALANCES[username]} `);

    }else{
        createReadStream('index.html').pipe(res)
    }
});

app.post('/login', (req, res)=>{
    const username = req.body.username
    const password = USERS[username]
    if(password === req.body.password){
        res.cookie('username', username, {signed: true})
        res.redirect('/')
    }else{
        res.send('fail')
    }

})

app.get('/logout', (req, res) => {
    res.clearCookie('username')
    res.redirect('/')
})




app.listen(4000)