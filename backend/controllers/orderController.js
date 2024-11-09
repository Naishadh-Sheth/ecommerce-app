import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import Stripe from 'stripe'

//Global variables
const currency = 'usd'
const deliveryCharge = 10

//Gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

//Placing orders using Cash on Delivery Method
const placeOrder = async (req, res) => {
    try {

        const { userId, items, amount, address } = req.body

        const newOrder = new orderModel({
            userId,
            items,
            address,
            amount,
            paymentMethod: "Cash On Delivery",
            payment: false, //False as the payment isn't made while placing the order, as its Cash on delivery
            date: Date.now()
        })

        await newOrder.save()

        //Clear the user's cart data after the order is placed
        await userModel.findByIdAndUpdate(userId, { cartData: {} })

        res.json({ success: true, message: "Order Placed" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//Placing orders using Stripe Method
const placeOrderStripe = async (req, res) => {
    try {

        const { userId, items, amount, address } = req.body
        const { origin } = req.headers //origin is the base url from which the user is placing the order, like localhost:5173

        const newOrder = new orderModel({
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false, //False as the payment isn't made yet, will be changed to true when the user pays it through stripe
            date: Date.now()
        })

        await newOrder.save()

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        console.log(line_items)

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment'
        })

        res.json({ success: true, session_url: session.url })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//Verify Stripe
const verifyStripe = async (req, res) => {

    const { orderId, userId, success } = req.body

    try {
        if (success === 'true') {
            await orderModel.findByIdAndUpdate(orderId, { payment: true })
            await userModel.findByIdAndUpdate(userId, { cartData: {} })
            res.json({ success: true })
        }
        else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//Placing orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {

}

//All orders data for admin panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}) //We want all the orders of all the users
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//User order data for frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body

        const orders = await orderModel.find({ userId })
        res.json({ success: true, orders })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//update order status from admin panel
const updateStatus = async (req, res) => {
    try {

        const { orderId, status } = req.body

        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({ success: true, message: "Status Updated" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, verifyStripe }