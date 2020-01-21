
const rp = require('request-promise');

function capturePayment(db, captureCode) {
    const url = "https://boltgw.cardconnect.com:6443/cardconnect/rest/capture"

    request.post({
        headers: {
            "Authorization": "Basic dGVzdGluZzp0ZXN0aW5nMTIz",
            "Content-Type": "application/json"
        },
        url,
        body: JSON.stringify({
            "merchid": "800000000245",
            "retref": captureCode
        })
    }, function (error, response, body) {
        const captureResponse = JSON.parse(body)
        if (captureResponse.respstat === "A") {
            console.log('capture successful we should order out')
        }
        console.log('CAPTURe mE', body)
    });
}

function capture2(captureCode) {
    const options = {
        method: 'POST',
        uri: 'https://boltgw.cardconnect.com:6443/cardconnect/rest/capture',
        headers: {
            "Authorization": "Basic dGVzdGluZzp0ZXN0aW5nMTIz",
            "Content-Type": "application/json"
        },
        body: {
            "merchid": "800000000245",
            "retref": captureCode
        },
        json: true // Automatically stringifies the body to JSON
    };

    return rp(options)
        .then(function (parsedBody) {
            // POST succeeded...
            console.log('CAPTUReD', parsedBody)
            if (parsedBody['respstat'] === 'A') {
                console.log('Approved')
                return parsedBody
            }
        })
        .catch(function (err) {
            // POST failed...
            console.log('failure')
            console.log(err)
        });
}

PaymentsService = {
    authorize2(order) {
        const options = {
            method: 'POST',
            uri: 'https://boltgw.cardconnect.com:6443/cardconnect/rest/auth',
            headers: {
                "Authorization": "Basic dGVzdGluZzp0ZXN0aW5nMTIz",
                "Content-Type": "application/json"
            },
            body: order,
            json: true // Automatically stringifies the body to JSON
        };

        return rp(options)
            .then(function (parsedBody) {
                // POST succeeded...
                if (parsedBody['respstat'] === 'A') {
                    console.log('retref', parsedBody['retref'])
                    return capture2(parsedBody['retref'])
                } else {
                    return parsedBody
                }
            })
            .catch(function (err) {
                // POST failed...
                console.log('failure')
                console.log(err)
            });
    },
    authorizePayment(db, order) {
        const url = "https://boltgw.cardconnect.com:6443/cardconnect/rest/auth"
        let ans = {}
        request.post({
            headers: {
                "Authorization": "Basic dGVzdGluZzp0ZXN0aW5nMTIz",
                "Content-Type": "application/json"
            },
            url,
            body: JSON.stringify(order)
        }, function (error, response, body) {
            const paymentResponse = JSON.parse(body)
            if (paymentResponse["respstat"] === "A") {
                console.log('approved', paymentResponse)
                return capturePayment(db, paymentResponse["retref"])
            } else {
                console.log('wrong card details')
                return 'wrong card details'
            }
            return ans
        });
    },
    generateOrder(db, order) {
        const url = "https://d.browserapi.eatos.co/order/generate"

        request.post({
            headers: {
                "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDVmZTEzOTA5YTM2MDAwMWRmNzE2MmMiLCJtZXJjaGFudElkIjoiNWQ1ZmUxMzhmMGVjOGMwMDFkZmVhNTBjIiwic3RvcmVJZCI6IjVkNWZlMTM4ZjBlYzhjMDAxZGZlYTUwZCIsImdlbmVyYXRpb25UeXBlIjoibG9naW4iLCJpYXQiOjE1NzYwMjA1NzJ9.j0J4Tchxthicab7ScTCfmYVWs7ZA3BMn-njpR_oTmE8",
                "Content-Type": "application/json"
            },
            url,
            body: JSON.stringify(order)
        }, function (error, response, body) {
            const captureResponse = JSON.parse(body)
            if (captureResponse.respstat === "A") {
                console.log('capture successful we should order out')
            }
            console.log('CAPTURe mE', body)
        });
    },
    closePayment(userId, orderId) {
        const url = "https://d.browserapi.eatos.co/payment/initiate"
        console.log(orderId)
        const options = {
            method: 'POST',
            uri: 'https://d.browserapi.eatos.co/payment/initiate',
            headers: {
                "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDVmZTEzOTA5YTM2MDAwMWRmNzE2MmMiLCJtZXJjaGFudElkIjoiNWQ1ZmUxMzhmMGVjOGMwMDFkZmVhNTBjIiwic3RvcmVJZCI6IjVkNWZlMTM4ZjBlYzhjMDAxZGZlYTUwZCIsImdlbmVyYXRpb25UeXBlIjoibG9naW4iLCJpYXQiOjE1NzYwMjA1NzJ9.j0J4Tchxthicab7ScTCfmYVWs7ZA3BMn-njpR_oTmE8",
                "Content-Type": "application/json"
            },
            body: {
                "orderId": orderId
            },
            json: true // Automatically stringifies the body to JSON
        };
    
        return rp(options)
            .then(function (parsedBody) {
                // POST succeeded...
                console.log('iniated payment', parsedBody)
            })
            .catch(function (err) {
                // POST failed...
                console.log('failure')
                console.log(err)
            });
    }
}

module.exports = PaymentsService