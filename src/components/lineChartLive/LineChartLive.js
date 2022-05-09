import { Component } from 'react'
import last from 'lodash/last'
import { timeFormat } from 'd3-time-format'
import { Line } from '@nivo/line'
import 'bootstrap/dist/css/bootstrap.min.css';
import { API_BASE_URL, HEADERS } from "../../config";

class LineChartLive extends Component {

    constructor(props) {
        super(props)

       this.state = {
            data: [],
            maxValue: 0,
            overMaxValue: 0
        }

        this.formatTime = timeFormat('%Y %b %d')
        this.formatTooltipTime = timeFormat('%b %d %H:%M:%S')
    }

    componentDidMount() {
        this.timer = setInterval(this.next, this.props.fetchInterval)
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    componentWillReceiveProps(nextProps) {
        //console.log(`componentWillReceiveProps nextProps data: ${nextProps?.data}, currencyPair: ${nextProps?.currencyPair}`)
        if(nextProps?.currencyPair !== this.props.currencyPair) {
            this.setState({data:[], maxValue: 0, overMaxValue: 0})
        }

        //console.log(`this.props.fetchInterval: ${this.props.fetchInterval}, nextProps.fetchInterval: ${nextProps?.fetchInterval}`)
        if(nextProps?.fetchInterval !== this.props.fetchInterval) {
            clearInterval(this.timer)
            this.timer = setInterval(this.next, nextProps.fetchInterval)
        }
    }

    next = () => {

        const url = `${API_BASE_URL}${this.props.currencyPair}`

        fetch(url, HEADERS)
            .then(res => res.json())
            .then(json => {
                //console.log(`response data: ${JSON.stringify(json)}`)

                let dataLatest
                if(this.state.data.length >= 12) {
                    //remove oldest price and add newest price
                    dataLatest = this.state.data.slice(1)
                } else {
                    dataLatest = this.state.data.slice(0)
                }

                const now = new Date();
                dataLatest.push({
                    x: now,
                    y: json.ask,
                })

                if(json.ask > this.state.maxValue) {
                    let overMax = json.ask * 1.2
                    this.setState({ maxValue: json.ask, overMaxValue: overMax })
                }

                this.setState({ data: dataLatest })
            }).catch((error) => {
            console.error(`fetch currencyPair: ${this.props.currencyPair} Error:`, error);
        });

    }


    render() {

        return ((this.state.data.length > 0) &&
                    <div className="container">
                        <div className="row">
                            <Line
                                width={900}
                                height={400}

                                markers={[
                                    {
                                        axis: 'y',
                                        value: this.props.thresholdPrice,
                                        lineStyle: { stroke: '#b0413e', strokeWidth: 1 },
                                        legend: 'price threshold',
                                        legendPosition: 'top-left',
                                    },
                                ]}

                                margin={{ top: 30, right: 50, bottom: 60, left: 50 }}
                                data={[
                                    { id: '1', data: this.state.data },
                                ]}
                                xScale={{ type: 'time', format: 'native' }}
                                yScale={{ type: 'linear', max: this.state.overMaxValue}}

                                axisBottom={{
                                    format: '%H:%M:%S',
                                    tickValues: 5,
                                    legend: `${this.formatTime(this.state.data[0].x)} — ${this.formatTime(last(this.state.data).x)}`,
                                    legendPosition: 'middle',
                                    legendOffset: 46,
                                }}
                                axisLeft={{
                                }}
                                axisRight={{
                                }}
                                enablePoints={true}
                                pointLabelYOffset={0}
                                yFormat={value => (Math.round(value * 100) / 100).toFixed(2)}
                                xFormat={date => this.formatTooltipTime(date)}
                                enableGridX={false}
                                curve="monotoneX"
                                animate={false}
                                motionStiffness={120}
                                motionDamping={50}
                                isInteractive={true}
                                enableSlices={false}
                                useMesh={true}
                                theme={{
                                    axis: { ticks: { text: { fontSize: 14 } } },
                                    grid: { line: { stroke: '#ddd', strokeDasharray: '1 2' } },
                                }}
                            />
                        </div>
                    </div>

        )
    }
}

export default LineChartLive