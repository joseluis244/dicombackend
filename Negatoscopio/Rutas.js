const express = require('express')
const router = express.Router()

router.use("/css",express.static("./Negatoscopio/css/"))
router.use("/IMG",express.static("./Negatoscopio/IMG/"))
router.use("/JS",express.static("./Negatoscopio/JS/"))




router.get("/",(req,res)=>{
    res.sendfile("./Negatoscopio/vistas/negatoscopio.html")
})
router.get("/remoto",(req,res)=>{
    res.sendfile("./Negatoscopio/vistas/remoto.html")
})
module.exports = router