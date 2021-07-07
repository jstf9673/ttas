const textColorDark = '#929AA5'
const gridColorDark = '#292929'
const axisLineColorDark = '#333333'
const crossTextBackgroundColorDark = '#373a40'

const textColorLight = '#76808F'
const gridColorLight = '#ededed'
const axisLineColorLight = '#DDDDDD'
const crossTextBackgroundColorLight = '#686d76'
export function getThemeOptions (theme) {
    const textColor = theme === 'dark' ? textColorDark : textColorLight
    const gridColor = theme === 'dark' ? gridColorDark : gridColorLight
    const axisLineColor = theme === 'dark' ? axisLineColorDark : axisLineColorLight
    const crossLineColor = theme === 'dark' ? axisLineColorDark : axisLineColorLight
    const crossTextBackgroundColor = theme === 'dark' ? crossTextBackgroundColorDark : crossTextBackgroundColorLight
    return {
      grid: {
        horizontal: {
          color: gridColor
        },
        vertical: {
          color: gridColor
        }
      },
      candle: {
        priceMark: {
          high: {
            color: textColor
          },
          low: {
            color: textColor
          }
        },
        tooltip: {
          text: {
            color: textColor
          }
        }
      },
      technicalIndicator: {
        tooltip: {
          text: {
            color: textColor
          }
        }
      },
      xAxis: {
        axisLine: {
          color: axisLineColor
        },
        tickLine: {
          color: axisLineColor
        },
        tickText: {
          color: textColor
        }
      },
      yAxis: {
        axisLine: {
          color: axisLineColor
        },
        tickLine: {
          color: axisLineColor
        },
        tickText: {
          color: textColor
        }
      },
      separator: {
        color: axisLineColor
      },
      crosshair: {
        horizontal: {
          line: {
            color: crossLineColor
          },
          text: {
            backgroundColor: crossTextBackgroundColor
          }
        },
        vertical: {
          line: {
            color: crossLineColor
          },
          text: {
            backgroundColor: crossTextBackgroundColor
          }
        }
      }
    }
  }

  export function getTooltipOptions (candleShowType, candleShowRule, technicalIndicatorShowRule) {
    return {
      candle: {
        tooltip: {
          showType: candleShowType,
          showRule: candleShowRule,
          labels: ['开盘价', '收盘价', '涨跌幅'],
          values: kLineData => {
            const change = (kLineData.close - kLineData.open) / kLineData.open * 100
            return [
              { value: kLineData.open.toFixed(2) },
              { value: kLineData.close.toFixed(2) },
              {
                value: `${change.toFixed(2)}%`,
                color: change < 0 ? '#EF5350' : '#26A69A'
              }
            ]
          }
        }
      },
      technicalIndicator: {
        tooltip: {
          showRule: technicalIndicatorShowRule
        }
      }
    }
  }