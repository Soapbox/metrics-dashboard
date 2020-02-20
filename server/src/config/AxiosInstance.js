const axios = require('axios');
require('dotenv').config();

const profitWell = axios.create({
    baseURL: 'https://api.profitwell.com/v2/metrics/',
    headers: { 'Authorization': process.env.PROFIT_WELL_SECRET}
});

const mixpanelSecret = process.env.MIXPANEL_SECRET;
const base64 = new Buffer.from(mixpanelSecret).toString('base64');
const mixpanel = axios.create({
    baseURL: 'https://mixpanel.com/api/2.0/',
    headers: { 'Authorization': 'Basic ' + base64 }
});

module.exports = {
    ProfitWell: profitWell,
    Mixpanel: mixpanel
}