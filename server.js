const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req,res){
    res.sendFile(__dirname+'/index.html');
});
app.post('/', function(req,res){

    let amount = req.body.amount;
    let currency = req.body.currency;
    let url = `https://api.coindesk.com/v1/bpi/currentprice/${currency}.json`

    request(url, function(error,response,body){
        console.log("Status Message: ", response.statusMessage);
        console.log("Server Status Code: ", response.statusCode);
        console.log(response.body);

        let data = JSON.parse(response.body);
        let price;

        if (currency === "EUR"){
            price = data.bpi.EUR.rate;
            console.log("Price in EUR", price);
        } else {
            price = data.bpi.USD.rate;
            console.log("Price in USD", price);
        }

        let disclaimer = data.disclaimer;

        price = price.replace(",","")
        price = parseFloat(price) * parseFloat(amount)

        res.write(`${disclaimer}`);
        res.write(`<br>`);
        res.write(`The price of ${amount} BitCoin(s) is ${price} ${currency}`)
        res.send();
    })
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running away.");
});