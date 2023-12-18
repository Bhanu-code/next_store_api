const express = require('express')
const cookieParser = require('cookie-parser');

const app = express();

//using json with express
app.use(express.json());
app.use(cookieParser());


const cors = require('cors')

const mongoose = require('mongoose');

//importing environmental files
const dotenv = require('dotenv')
dotenv.config();

//establishing DB connections
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("DB connected.")
}).catch((err)=>{
    console.log(err)
})

// enabling cors
app.use(cors());



//importing routes
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const productRoute = require("./routes/product")
const cartRoute = require("./routes/cart")
const orderRoute = require("./routes/order")
const paymentRoute = require("./routes/stripe")


//specifying routes
app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/products", productRoute)
app.use("/api/cart", cartRoute)
app.use("/api/order", orderRoute)
app.use("/api/payment", paymentRoute)



//app is listeing at PORT
app.listen(process.env.PORT, ()=>{
    console.log('server is up and running ' + process.env.PORT);
})

