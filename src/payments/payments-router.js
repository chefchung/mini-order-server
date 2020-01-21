const express = require('express')
const PaymentsService = require('./payments-service')

const paymentsRouter = express.Router()
const jsonBodyParser = express.json()

paymentsRouter
    .route('/authorize')
    .get((req, res, next) => res.send('hey hey hey its fat albert'))
    .post(jsonBodyParser, async (req, res, next) => {
        const order = req.body

        const example = {
            "merchid": "800000000245",
            "orderid": "AB-11-9876",
            "account": "4788250000121443",
            "expiry": "1236",
            "amount": "42069",
            "currency": "USD",
            "name": "Harry Chung",
            "address": "8321 Beverly Blvd",
            "city": "Los Angeles",
            "region": "LA",
            "country": "US",
            "postal": "90038",
            "profile": "Y",
            "ecomind": "E",
            "cvv2": "112",
            "track": null,
            "capture": "Y",
            "bin": "Y"
        }

        const authorization = await PaymentsService.authorize2(order)
        res.json(authorization)
    })

paymentsRouter.route('/order')
    .post(jsonBodyParser, (req, res, next) => {
        const order = req.body

        PaymentsService.generateOrder(req.app.get('db'), order)
            .then(resp => {
                res.json(resp)
            })
    })


paymentsRouter.route('/close')
    .post(jsonBodyParser, (req, res, next) => {
        const order = req.body

        PaymentsService.closePayment(order.user.id, order.orderId)
            .then(resp => res.json(resp))
    })
module.exports = paymentsRouter