import React from 'react';
import './PieChart.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

const PieChart = props => {
    const percentage = props.metric_current_value;
    const deltaIcon = props.metric_delta  >= 0 ? 'arrow_drop_up' : 'arrow_drop_down';
    const deltaClass = props.metric_delta >= 0 ? 'positive-delta' : 'negative-delta';

    return (
        <div id="pie-chart-container" className="container">
            <div className="metric-title-container">
                <h3 id="metric-name">{props.metric_name}</h3>
                <div id="metric-delta-container">
                    <i id="metric-delta-icon" className={["material-icons", deltaClass].join(' ')}>{deltaIcon}</i>
                    <h4 id="metric-delta" className={deltaClass}>{Math.abs(props.metric_delta)}%</h4>
                </div>
            </div>
            <div id='circular-progress-bar-container'>
                <CircularProgressbar id="circular-progress-bar" value={percentage} maxValue={props.metric_goal} text={percentage} strokeWidth='2'
                    styles={buildStyles({
                        pathColor: '#2790F8',
                        textColor: '#2790F8',
                    })} />
            </div>
            <div id="metric-legend-current-value-container" className="metric-legend-container">
                <div className="metric-legend-description-conatiner">
                    <div id="metric-legend-current-color" className="metric-legend-color" />
                    <h4 className="metric-legend-title-label">{props.metric_name}</h4>
                </div>
                <h4 className="metric-legend-value-label">{props.metric_current_value}</h4>
            </div>
            <div className="metric-legend-container">
                <div className="metric-legend-description-conatiner">
                    <div id="metric-legend-goal-color" className="metric-legend-color" />
                    <h4 className="metric-legend-title-label">Goal</h4>
                </div>
                <h4 className="metric-legend-value-label">{props.metric_goal}</h4>
            </div>
        </div>
    );
}

export default PieChart;