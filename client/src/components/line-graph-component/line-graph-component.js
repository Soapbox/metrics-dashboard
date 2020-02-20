import React, { useMemo } from 'react';
import './line-graph-component.css';
import { Chart } from 'react-charts';

const LineGraph = props => {
    const data = useMemo(
        () => [{
            label: 'MRR',
            data: props.metric_line_data
        }],
        [props]
    );

    const series = useMemo(
        () => ({
            showPoints: false
        }),
        [props]
    )

    const axes = useMemo(
        () => [
            { primary: true, type: 'linear', position: 'bottom', show: false },
            { type: 'linear', position: 'left', show: false }
        ],
        [props]
    );

    const deltaIcon = props.metric_delta >= 0 ? 'arrow_drop_up' : 'arrow_drop_down';
    const deltaClass = props.metric_delta >= 0 ? 'positive-delta' : 'negative-delta';

    const metricValueWithCurrency = parseFloat(props.metric_current_value).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

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
                <h1 id="metric-current-value">{metricValueWithCurrency}</h1>
            </div>
            <div style={{ width: 'auto', height: '100px' }}>
                <Chart id="metric-chart" data={data} series={series} axes={axes} />
            </div>
        </div>
    );
}

export default LineGraph;