import React, { Component } from 'react';
import LineGraph from './components/line-graph-component/line-graph-component';
import PieChart from './components/PieChart/PieChart';
import InfoWidget from './components/InfoWidget/InfoWidget';
import axios from 'axios';
import 'material-design-icons/iconfont/material-icons.css';
import 'react-circular-progressbar/dist/styles.css';
import './App.css';

class App extends Component {
  state = {
    monthly_recurring_revenue: {
      recurring_revenue: 0,
      previous_recurring_revenue: 0,
      recurring_revenue_delta: 0,
      quarterly_recurring_revenue: []
    },
    active_customers: {
      active_customers: 0,
      previous_active_customers: 0,
      active_customers_delta: 0,
      active_customers_goal: 370
    },
    new_customers_this_week: {
      new_customers_this_week: 0,
      new_customers_last_week: 0,
      new_customers_this_week_delta: 0,
      new_customers_this_week_goal: 13
    },
    daily_customers: {
      daily_customers: 0,
      prev_daily_customers: 0,
      daily_cutomers_delta: 0
    },
    churned_customers: {
      churned_customers: 0,
      prev_churned_customer: 0,
      churned_customers_delta: 0
    },
    soapboxes_created: {
      soapboxes_created: 0,
      prev_soapboxes_created: 0,
      soapboxes_created_delta: 0
    }
  }

  componentDidMount() {
    this.getMonthlyStats();
    this.getDailyStats();
    this.getMixpanelStats();
    setInterval(() => {
      this.getMonthlyStats();
      this.getDailyStats();
      this.getMixpanelStats();
    }, 300000);
  }

  getMonthlyStats = async () => {
    const response = await axios.get('/profitwell/monthly');
    this.setState({ monthly_recurring_revenue: response.data.recurring_revenue });
    this.setState({ churned_customers: response.data.churned_customers });
    this.setState({ active_customers: response.data.active_customers });
  }

  getDailyStats = async () => {
    const response = await axios.get('/profitwell/daily');
    this.setState({ daily_customers: response.data.daily_customers });
    this.setState({ new_customers_this_week: response.data.new_customers_this_week });
  }

  getMixpanelStats = async () => {
    const response = await axios.get('/mixpanel/soapboxes_created');
    this.setState({ soapboxes_created: response.data.soapboxes_created });
  }

  render() {
    return (
      <React.Fragment>
        <div className="app-title">
          <h1>Soapbox Pirate Metrics</h1>
        </div>
        <div className="App">
          <LineGraph
            metric_name="MRR"
            metric_delta={this.state.monthly_recurring_revenue.recurring_revenue_delta}
            metric_current_value={this.state.monthly_recurring_revenue.recurring_revenue}
            metric_line_data={this.state.monthly_recurring_revenue.quarterly_recurring_revenue}
            metric_goal="13000" />
          <PieChart
            metric_name="Active Customers"
            metric_delta={this.state.active_customers.active_customers_delta}
            metric_current_value={this.state.active_customers.active_customers}
            metric_goal={this.state.active_customers.active_customers_goal} />
          <PieChart
            metric_name="New Customers This Week"
            metric_delta={this.state.new_customers_this_week.new_customers_this_week_delta}
            metric_current_value={this.state.new_customers_this_week.new_customers_this_week}
            metric_goal={this.state.new_customers_this_week.new_customers_this_week_goal} />
          <InfoWidget
            metric_name="New Customers Today"
            metric_delta={this.state.daily_customers.daily_cutomers_delta}
            metric_current_value={this.state.daily_customers.daily_customer} />
          <InfoWidget
            metric_name="Churns This Month"
            metric_delta={this.state.churned_customers.churned_customers_delta}
            metric_current_value={this.state.churned_customers.churned_customers} />
          <InfoWidget
            metric_name="Soapboxes Created This Week"
            metric_delta={this.state.soapboxes_created.soapboxes_created_delta}
            metric_current_value={this.state.soapboxes_created.soapboxes_created} />
        </div>
      </React.Fragment>
    );
  }
}

export default App;
