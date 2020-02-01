const express = require("express");
const keys = require('./config/keys');
const stripe = require("stripe")(keys.stripeSecretKey);
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

const app = express();

//Handlebars Middleware
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));

app.set('view engine', 'handlebars');

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

//Set Static Folder
app.use(express.static(`${__dirname}/public`));

//Index Route
app.get('/', (request, response) => {
    response.render("index", {
        stripePublishableKey: keys.stripePublishableKey
    });
});

//Charge Route
app.post('/charge', (request, response) => {
    const amount = 2500;

    stripe.customers.create({
            email: request.body.stripeEmail,
            source: request.body.stripeToken
        })
        .then(customer => stripe.charges.create({
            amount,
            description: "Lashed With Kayy",
            currency: "usd",
            customer: customer.id
        }))
        .then(charge => response.render('success'));
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})