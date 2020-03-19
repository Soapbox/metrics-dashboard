const express = require('express');
const app = express();
const axios = require('./config/AxiosInstance');
const CLIENT_BUILD_PATH = path.join(__dirname, "../../client/build");

require('dotenv').config();

// Static files
app.use(express.static(CLIENT_BUILD_PATH));

// Server React Client
app.get("/", function(req, res) {
  res.sendFile(path.join(CLIENT_BUILD_PATH , "index.html"));
});

app.get("/metrics-api", (req, res) => {
    res.send("Soapbox Pirate Metrics");
});

app.get("/profitwell/monthly", async (req, res) => {
    const response = await axios.ProfitWell.get('/monthly/');
    res.send({
        recurring_revenue: getRecurringRevenue(response),
        churned_customers: getChurnedCustomers(response),
        active_customers: getActiveCustomers(response)
    });
});

getRecurringRevenue = response => {
    const recurringRevenue = response.data.data.recurring_revenue;
    const recurringRevenueLength = recurringRevenue.length;
    const currentRecurringRevenue = recurringRevenue[recurringRevenueLength - 1].value;

    const previousRecurringRevenueLength = response.data.data.existing_recurring_revenue.length;
    const previousRecurringRevenue = response.data.data.existing_recurring_revenue[previousRecurringRevenueLength - 1].value;

    const recurringRevenueDelta = (((currentRecurringRevenue - previousRecurringRevenue) / previousRecurringRevenue) * 100).toFixed(1);
    let quarterlyRecurringRevenue = new Array(4);
    let x = 0;

    for (let i = recurringRevenueLength - 4; i <= recurringRevenueLength - 1; i++) {
        quarterlyRecurringRevenue[x] = [];
        quarterlyRecurringRevenue[x].push(x + 1);
        quarterlyRecurringRevenue[x].push(recurringRevenue[i].value);
        x++;
    }

    return {
        recurring_revenue: currentRecurringRevenue,
        previous_recurring_revenue: previousRecurringRevenue,
        recurring_revenue_delta: recurringRevenueDelta,
        quarterly_recurring_revenue: quarterlyRecurringRevenue
    }
}

getChurnedCustomers = response => {
    const churnedCustomers = response.data.data.churned_customers;
    const churnedCustomersLength = churnedCustomers.length;
    const currentChurnedCustomers = churnedCustomers[churnedCustomersLength - 1].value;
    const prevChurnedCustomers = churnedCustomers[churnedCustomersLength - 2].value;
    const churnedCustomersDelta = (((currentChurnedCustomers - prevChurnedCustomers) / prevChurnedCustomers) * -100).toFixed(1);

    return {
        churned_customers: currentChurnedCustomers,
        prev_churned_customer: prevChurnedCustomers,
        churned_customers_delta: churnedCustomersDelta
    }
}

getActiveCustomers = response => {
    const activeCustomers = response.data.data.active_customers;
    const activeCustomersLength = response.data.data.active_customers.length;
    const currentActiveCustomers = activeCustomers[activeCustomersLength - 1].value;
    const prevActiveCustomers = activeCustomers[activeCustomersLength - 2].value;
    const currentActiveCustomersDelta = (((currentActiveCustomers - prevActiveCustomers) / prevActiveCustomers) * 100).toFixed(1);

    return {
        active_customers: currentActiveCustomers,
        previous_active_customers: prevActiveCustomers,
        active_customers_delta: currentActiveCustomersDelta,
        active_customers_goal: 370
    }
}

app.get("/profitwell/daily", async (req, res) => {
    const date = new Date();
    const currentMonth = formatMonth(date.getMonth());
    const currentMonthResponse = await axios.ProfitWell.get('daily/?month=' + date.getFullYear() + '-' + currentMonth);

    const prevMonthDate = new Date();
    prevMonthDate.setMonth(date.getMonth() - 1);
    const prevMonth = formatMonth(prevMonthDate.getMonth());
    const prevMonthResponse = await axios.ProfitWell.get('/daily/?month=' + prevMonthDate.getFullYear() + '-' + prevMonth);

    res.send({
        daily_customers: getNewCustomersToday(currentMonthResponse, prevMonthResponse),
        new_customers_this_week: getNewWeeklyCustomers(currentMonthResponse, prevMonthResponse)
    })
});

getNewCustomersToday = (currentMonthResponse, prevMonthResponse) => {
    const date = new Date();
    const yesterdaysDate = date.getDate() - 1;
    const yesterday = new Date();
    yesterday.setDate(yesterdaysDate);

    const dailyCustomers = currentMonthResponse.data.data.new_customers;
    const dailyCustomer = dailyCustomers[date.getDate() - 1].value;

    const prevNewCustomers = prevMonthResponse.data.data.new_customers;

    const currentCustomersArray = [...dailyCustomers];
    if (date.getMonth() !== yesterday.getMonth()) {
        currentCustomersArray = [...prevNewCustomers];
    }

    const prevDailyCustomer = currentCustomersArray[yesterday.getDate() - 1].value;
    const dailyCustomerDelta = prevDailyCustomer === 0 ? dailyCustomer * 100 : (((dailyCustomer - prevDailyCustomer) / prevDailyCustomer) * 100).toFixed(1);

    return {
        daily_customer: dailyCustomer,
        prev_daily_customers: prevDailyCustomer,
        daily_cutomers_delta: dailyCustomerDelta
    }
}

getNewCustomersThisWeek = (currentMonthResponse, prevMonthResponse) => {
    let newCustomersThisWeek = 0;
    const currentDate = new Date();

    const lastWeekDate = currentDate.getDate() - currentDate.getDay();
    const lastWeek = new Date();
    lastWeek.setDate(lastWeekDate);
    lastWeek.setHours(0,0,0,0);

    const newCustomersThisMonth = currentMonthResponse.data.data.new_customers;
    const newCustomersLastMonth = prevMonthResponse.data.data.new_customers;

    let currentIndex = lastWeek.getDate();
    const currentIndexLength = currentDate.getDate();
    if (currentDate.getMonth() !== lastWeek.getMonth()) {
        currentIndex = 0;
        const prevMonthIndex = lastWeek.getDate()
        for (let i = prevMonthIndex; i <= newCustomersLastMonth.length - 1; i++) {
            newCustomersThisWeek = newCustomersThisWeek + newCustomersLastMonth[i].value;
        }
    }

    for (let i = currentIndex; i <= currentIndexLength; i++) {
        newCustomersThisWeek = newCustomersThisWeek + newCustomersThisMonth[i].value;
    }

    return newCustomersThisWeek;
}

getNewCustomersLastWeek = (currentMonthResponse, prevMonthResponse) => {
    let newCustomersLastWeek = 0;
    const currentDate = new Date();

    const lastWeekDate = currentDate.getDate() - currentDate.getDay();
    const lastWeek = new Date();
    lastWeek.setDate(lastWeekDate);
    lastWeek.setHours(0,0,0,0);

    const twoWeeksAgoDate = lastWeek.getDate() - 7;
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgoDate);

    const newCustomersThisMonth = currentMonthResponse.data.data.new_customers;
    const newCustomersLastMonth = prevMonthResponse.data.data.new_customers;

    let currentIndex = twoWeeksAgo.getDate();
    let currentIndexLength = currentDate.getDate();
    let currentMonth = [...newCustomersThisMonth];

    if (currentDate.getMonth() == lastWeek.getMonth() &&
        currentDate.getMonth() != twoWeeksAgo.getMonth()) {
        currentIndex = 0;
        const prevMonthIndex = twoWeeksAgo.getDate();
        for (let i = prevMonthIndex; i <= newCustomersLastMonth.length - 1; i++) {
            newCustomersLastWeek = newCustomersLastWeek + newCustomersLastMonth[i].value;
        }
    } else if (currentDate.getMonth() != lastWeek.getMonth()) {
        currentIndexLength = lastWeek.getDate();
        currentMonth = [...newCustomersLastMonth];
    }

    for (let i = currentIndex; i <= currentIndexLength; i++) {
        newCustomersLastWeek = newCustomersLastWeek + currentMonth[i].value;
    }

    return newCustomersLastWeek;
}

getNewWeeklyCustomers = (currentMonthResponse, previousMonthResponse) => {
    const newCustomersThisWeek = getNewCustomersThisWeek(currentMonthResponse, previousMonthResponse);
    const newCustomersLastWeek = getNewCustomersLastWeek(currentMonthResponse, previousMonthResponse);
    const newCustomersDelta = (((newCustomersThisWeek - newCustomersLastWeek) / newCustomersLastWeek) * 100).toFixed(1);

    return {
        new_customers_this_week: newCustomersThisWeek,
        new_customers_last_week: newCustomersLastWeek,
        new_customers_this_week_delta: newCustomersDelta,
        new_customers_this_week_goal: 13
    }
}

formatMonth = month => {
    return ("0" + (month + 1)).slice(-2);
}

app.get("/mixpanel/soapboxes_created", async (req, res) => {
    const event = ['SoapBox Created'];
    const encodedEvent = encodeURIComponent(JSON.stringify(event));
    const soapboxesCreated = await axios.Mixpanel.get("events/?event=" + encodedEvent + "&type=unique&unit=week");

    const soapboxesCreatedThisWeek = soapboxesCreated.data.data.values[event[0]][Object.keys(soapboxesCreated.data.data.values[event[0]])[0]];
    const prevSoapboxesCreatedThisWeek = soapboxesCreated.data.data.values[event[0]][Object.keys(soapboxesCreated.data.data.values[event[0]])[1]];
    const soapboxesCreatedDelta = (((soapboxesCreatedThisWeek - prevSoapboxesCreatedThisWeek) / prevSoapboxesCreatedThisWeek) * 100).toFixed(1);

    const soapboxesCreatedObject = {
        soapboxes_created: soapboxesCreatedThisWeek,
        prev_soapboxes_created: prevSoapboxesCreatedThisWeek,
        soapboxes_created_delta: soapboxesCreatedDelta
    }

    res.send({ soapboxes_created: soapboxesCreatedObject })
});

const port = process.env.PORT || 8080;
app.listen(port);