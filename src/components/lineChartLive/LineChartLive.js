import { Component } from 'react'
import last from 'lodash/last'
import { timeFormat } from 'd3-time-format'
import { Line } from '@nivo/line'
import 'bootstrap/dist/css/bootstrap.min.css';
import { API_BASE_URL, API_HISTORICAL_URL, HEADERS } from "../../config";

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
        this.getHistoricalPrices()
        this.timer = setInterval(this.next, this.props.fetchInterval)
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    componentWillReceiveProps(nextProps) {
        //console.log(`componentWillReceiveProps nextProps data: ${nextProps?.data}, currencyPair: ${nextProps?.currencyPair}`)
        if(nextProps?.currencyPair !== this.props.currencyPair) {
            this.setState({data:[], maxValue: 0, overMaxValue: 0}, () => this.getHistoricalPrices())
        }

        if(nextProps?.fetchInterval !== this.props.fetchInterval) {
            clearInterval(this.timer)
            this.timer = setInterval(this.next, nextProps.fetchInterval)
        }
    }

    setMaxPrice = (price) => {
        if(price > this.state.maxValue) {
            let overMax = price * 1.2
            this.setState({ maxValue: price, overMaxValue: overMax })
        }
    }

    getHistoricalPrices = () => {
        const url = `${API_HISTORICAL_URL}${this.props.currencyPair}`

        fetch(url, HEADERS)
            .then(res => res.json())
            .then(json => {
                //console.log(`getHistoricalPrices response data: ${JSON.stringify(json)}`)
                let dataHistorical = []

                for(let i=0; i<json.history.length; i++) {
                    dataHistorical.push({
                        x: new Date(json.history[i].datetime),
                        y: json.history[i].price,
                    })

                    this.setMaxPrice(json.history[i].price)
                }

                this.setState({ data: dataHistorical })
            }).catch((error) => {
        });

    }

    next = () => {

        const url = `${API_BASE_URL}${this.props.currencyPair}`

        fetch(url, HEADERS)
            .then(res => res.json())
            .then(json => {

                let dataLatest
                if(this.state.data.length >= 12) {
                    dataLatest = this.state.data.slice(1)   //remove oldest price so you can add new price
                } else {
                    dataLatest = this.state.data.slice(0)
                }

                dataLatest.push({
                    x: new Date(),
                    y: json.price,
                })

                this.setMaxPrice(json.price)
                this.setState({ data: dataLatest })
            }).catch((error) => {
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
                                data={[{ id: '1', data: this.state.data },]}
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