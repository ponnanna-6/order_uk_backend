const express = require('express')

const router = express.Router()

router.get('/', (req, res)=>{
    res.send("HELLO FROM ORDER.UK BACKEND")
})

module.exports = router