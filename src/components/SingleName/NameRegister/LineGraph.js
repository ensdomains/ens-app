import Chart from 'chart.js'
import styled from '@emotion/styled/macro'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { formatDate } from 'utils/dates'
import debounce from 'lodash/debounce'
const DAY = 60 * 60 * 24
const HOUR = 60 * 60

const LineGraphContainer = styled('div')`
  background-color: white;
  color: #d8d8d8;
  padding: 1em;
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
  now,
  releasedDate,
  timeUntilZeroPremium,
  premiumInEth,
  ethUsdPremiumPrice,
  startingPremiumInDai,
  handleTooltip
}) {
  const debouncedHandleTooltip = debounce(handleTooltip, 100)
  const daysPast = parseInt(now.diff(releasedDate) / DAY / 1000)
  const totalDays = parseInt(
    timeUntilZeroPremium.diff(releasedDate) / DAY / 1000
  )
  const daysRemaining = totalDays - daysPast
  const totalHr = parseInt(
    timeUntilZeroPremium.diff(releasedDate) / HOUR / 1000
  )

  const chartRef = React.createRef()
  const labels = []
  const dates = []
  const data = []
  const pointRadius = []
  const { t } = useTranslation()
  useEffect(() => {
    for (
      let i = releasedDate.clone();
      timeUntilZeroPremium.diff(i) > 0;
      i = i.add(1, 'hour')
    ) {
      let diff = timeUntilZeroPremium.diff(i) / HOUR / 1000
      let rate = diff / totalHr
      let premium = startingPremiumInDai * rate
      let label = `${formatDate(i.unix() * 1000)}`
      dates.push(label)
      labels.push(premium)
      if (now.diff(i) >= 0) {
        data.push(premium)
      } else {
        data.push(null)
      }
      if (
        now.format('YYYY-MM-DD:HH:00') === i.format('YYYY-MM-DD:HH:00') ||
        releasedDate.format('YYYY-MM-DD:HH:00') ===
          i.format('YYYY-MM-DD:HH:00') ||
        timeUntilZeroPremium.format('YYYY-MM-DD:HH:00') ===
          i.format('YYYY-MM-DD:HH:00')
      ) {
        pointRadius.push(3)
      } else {
        pointRadius.push(null)
      }
    }
    const ctx = chartRef.current.getContext('2d')
    Chart.defaults.global.tooltips.yAlign = 'top'
    Chart.defaults.global.tooltips.xAlign = 'center'
    new Chart(ctx, {
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
            pointBackgroundColor: '#D8D8D8',
            fill: false,
            pointRadius
          }
        ]
      },
      options: {
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
              debouncedHandleTooltip(tooltipItem.yLabel)
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
              ticks: {
                maxTicksLimit: totalDays,
                callback: function() {
                  return ''
                }
              },
              gridLines: {
                zeroLineColor: 'white',
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
              ticks: { display: false, max: 2100 },
              gridLines: {
                display: false,
                drawBorder: false
              }
            }
          ]
        },
        layout: {
          padding: {
            right: 10
          }
        }
      }
    })
  }, [])

  return (
    <LineGraphContainer>
      <Legend>
        <Title>
          {t('linegraph.title', {
            premiumInEth: premiumInEth && premiumInEth.toFixed(2)
          })}{' '}
          ETH($
          {ethUsdPremiumPrice.toFixed(2)})
        </Title>
        <span>
          {t('linegraph.daysRemaining', { daysRemaining, totalDays })}
        </span>
      </Legend>
      <Canvas id="myChart" ref={chartRef} />
      <Legend>
        <span>
          {t('linegraph.startingPrice')}: ${startingPremiumInDai}{' '}
        </span>
        <span>{t('linegraph.endPrice')}: $0</span>
      </Legend>
    </LineGraphContainer>
  )
}
