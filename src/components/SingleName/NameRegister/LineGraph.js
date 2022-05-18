import Chart from 'chart.js'
import styled from '@emotion/styled/macro'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import priceCalculator from './PriceCalculator'

const LineGraphContainer = styled('div')`
  background-color: white;
  color: #d8d8d8;
  padding: 1em;
  #myChart {
    cursor: pointer;
  }
`

const Legend = styled('div')`
  display: flex;
  justify-content: space-between;
  span {
    margin: 1em;
  }
`

const Canvas = styled('canvas')`
  background-color: #e9eef6;
`

const Title = styled('span')`
  font-weight: bold;
  font-size: large;
`

export default function LineGraph({
  startDate,
  currentDate,
  targetDate,
  endDate,
  now,
  ethUsdPrice,
  handleTooltip,
  oracle,
  premiumOnlyPrice,
  price
}) {
  const c = priceCalculator({
    price, // in ETH, BN
    premium: premiumOnlyPrice, // in ETH
    ethUsdPrice
  })

  const daysRemaining = oracle.getDaysRemaining(now)
  const hoursRemaining = oracle.getHoursRemaining(now)
  const totalDays = oracle.totalDays
  const chartRef = React.createRef()
  const labels = []
  const dates = []
  const data = []
  const pointRadius = []
  const supportLine = []
  const { t } = useTranslation()
  const [chart, setChart] = useState(false)
  let chartStartDate, maxTicksLimit
  if (daysRemaining > 7) {
    chartStartDate = now
    maxTicksLimit = daysRemaining
  } else if (daysRemaining > 1) {
    chartStartDate = endDate.clone().subtract(7, 'day')
    maxTicksLimit = 7
  } else {
    chartStartDate = endDate.clone().subtract(24, 'hour')
    maxTicksLimit = 24
  }
  const chartstartPremium = oracle.getAmountByDateRange(
    startDate,
    chartStartDate
  )

  for (
    let i = chartStartDate.clone();
    endDate.diff(i) > 0;
    i = i.add(1, 'hour')
  ) {
    const premium = oracle.getAmountByDateRange(startDate, i)
    let label = i.format('YYYY-MM-DD:HH:00')
    dates.push(label)
    labels.push(premium)
    if (
      currentDate.diff(i) >= 0 ||
      currentDate.format('YYYY-MM-DD:HH:00') === label
    ) {
      data.push(premium)
    } else {
      data.push(null)
    }
    if (
      currentDate.format('YYYY-MM-DD:HH:00') === label ||
      startDate.format('YYYY-MM-DD:HH:00') === label ||
      targetDate.format('YYYY-MM-DD:HH:00') === label ||
      targetDate === label
    ) {
      pointRadius.push(3)
    } else {
      pointRadius.push(null)
    }
    if (targetDate === label) {
      supportLine.push(2000)
    } else {
      supportLine.push(null)
    }
  }
  useEffect(() => {
    const ctx = chartRef.current.getContext('2d')
    Chart.defaults.global.tooltips.yAlign = 'bottom'
    let _chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        //Bring in data
        datasets: [
          {
            label: 'Passed',
            borderWidth: 3,
            data,
            borderColor: '#2C46A6',
            backgroundColor: '#2C46A6',
            pointRadius,
            fill: false
          },
          {
            label: 'Estimate',
            borderWidth: 2,
            data: labels,
            borderColor: '#D8D8D8',
            pointBackgroundColor: '#2C46A6',
            pointBorderColor: '#2C46A6',
            fill: false,
            pointRadius
          }
        ]
      },
      options: {
        events: ['click'],
        animation: {
          duration: 0
        },
        tooltips: {
          enabled: true,
          mode: 'nearest',
          intersect: false,
          titleAlign: 'center',
          multiKeyBackground: '#2C46A6',
          callbacks: {
            label: function(tooltipItem, data) {
              handleTooltip(tooltipItem)
              let label = `Premium: $${tooltipItem.yLabel.toFixed(2)}`
              if (tooltipItem.datasetIndex === 1) {
                return label
              }
            }
          }
        },
        responsive: true,
        aspectRatio: 5,
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {
              afterFit: scale => {
                scale.height = 0
              },
              ticks: {
                maxTicksLimit,
                callback: function() {
                  return ''
                }
              },
              gridLines: {
                zeroLineColor: '#e9eef6',
                zeroLineWidth: 3,
                color: 'white',
                lineWidth: 3,
                offsetGridLines: false,
                drawBorder: false
              }
            }
          ],
          yAxes: [
            {
              ticks: { display: false, max: chartstartPremium * 1.5 },
              gridLines: {
                display: false,
                drawBorder: false
              }
            }
          ]
        },
        layout: {
          padding: { bottom: 5, top: 5 }
        }
      }
    })
    setChart(_chart)
  }, [])
  if (chart) {
    chart.data.datasets[0].pointRadius = pointRadius
    chart.data.datasets[1].pointRadius = pointRadius
    chart.update()
  }

  return (
    <LineGraphContainer>
      <Legend>
        <Title>
          {t('linegraph.title', {
            premiumInEth: c.premium
          })}{' '}
          ETH($
          {c.premiumInUsd})
        </Title>
        <span>
          {daysRemaining > 1
            ? t('linegraph.daysRemaining', { daysRemaining, totalDays })
            : `${hoursRemaining} hours remaining`}
        </span>
      </Legend>
      <Canvas id="myChart" ref={chartRef} />
      <Legend>
        <span>${parseInt(chartstartPremium)} </span>
        <span>$0</span>
      </Legend>
    </LineGraphContainer>
  )
}
