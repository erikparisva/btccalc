const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req,res){
    res.sendFile(__dirname+'/index.html');
});
app.post('/', function(req,res){
    let currency = req.body.currency;
    console.log(currency);
    res.send(`you have selected ${currency}`);
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

        res.write(`${disclaimer}`);
        res.write('<br>');
        res.write(`Current price in ${currency} is ${price}`)
        res.send();
    })
});

app.listen(3000, function(){
    console.log("Server is running on port 3000");
});