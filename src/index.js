const express = require('express')
 const app = express()
 const port = 4545
 app.use('/', express.static('dist')) //public is a folder in the directory where your index.html and other content go
 app.get('/', function (req, res) {
 res.redirect("/index.html")
    })
 app.listen(port, () => console.log("Example app listening on port"+port+"!"))