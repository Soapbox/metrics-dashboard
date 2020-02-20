import React from 'react';
import './InfoWidget.css';


const InfoWidget = props => {
    const deltaIcon = props.metric_delta  >= 0 ? 'arrow_drop_up' : 'arrow_drop_down';
    const deltaClass = props.metric_delta >= 0 ? 'positive-delta' : 'negative-delta';

    return (
        <div className="container">
            <div className="metric-container">
                <div className="metric-title-container">
                    <h3 id="metric-name">{props.metric_name}</h3>
                    <div id="metric-delta-container">
                        <i id="metric-delta-icon" className={["material-icons", deltaClass].join(' ')}>{deltaIcon}</i>
                        <h4 id="metric-delta" className={deltaClass}>{Math.abs(props.metric_delta)}%</h4>
                    </div>
                </div>
                <h1 id="metric-current-value-info">{props.metric_current_value}</h1>
            </div>
            <h4>{props.metric_sub_title}</h4>
        </div>
    );
}

export default InfoWidget;