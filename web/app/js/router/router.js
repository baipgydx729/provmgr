var pbcRouter = require("./pbc-router");
var depositoryBankRouter = require("./depository-bank-router");
var cooperativeBankRouter = require("./cooperative-bank-router");

pbcRouter.init();
depositoryBankRouter.init();
cooperativeBankRouter.init();