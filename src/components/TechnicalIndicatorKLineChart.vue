<template>
  <Layout title="">
    <div class="top-bar">
      <span
        class="top-bar-item"
        @click="changeTime(bar.value)"
        :class="{select: currentBar}"
        v-for="bar in barList"
        :key="bar.value"
      >{{bar.label}}</span>
    </div>
    <div id="technical-indicator-k-line" class="k-line-chart" />
  </Layout>
</template>

<script>
import { dispose, init } from "klinecharts";
import generatedKLineDataList from "../generatedKLineDataList";
import Layout from "@/Layout";
import {mapGetters} from 'vuex';
import {getThemeOptions, getTooltipOptions} from '@/constant/chart';
const fruits = [
  "🍏",
  "🍎",
  "🍐",
  "🍊",
  "🍋",
  "🍌",
  "🍉",
  "🍇",
  "🍓",
  "🍈",
  "🍒",
  "🍑",
  "🍍",
  "🥥",
  "🥝",
  "🥭",
  "🥑",
  "🍏"
];

// 自定义指标
const emojiTechnicalIndicator = {
  name: "EMOJI",
  plots: [{ key: "emoji" }],
  calcTechnicalIndicator: kLineDataList => {
    const result = [];
    kLineDataList.forEach(kLineData => {
      result.push({
        emoji: kLineData.close,
        text: fruits[Math.floor(Math.random() * 17)]
      });
    });
    return result;
  },
  render: (
    ctx,
    { from, to, technicalIndicatorDataList },
    { barSpace },
    options,
    xAxis,
    yAxis
  ) => {
    ctx.font = `${barSpace}px Helvetica Neue`;
    ctx.textAlign = "center";
    for (let i = from; i < to; i++) {
      const data = technicalIndicatorDataList[i];
      const x = xAxis.convertToPixel(i);
      const y = yAxis.convertToPixel(data.emoji);
      ctx.fillText(data.text, x, y);
    }
  }
};

export default {
  name: "TechnicalIndicatorKLineChart",
  components: { Layout },
  data: function() {
    return {
      current: "",
      barList: [
        { label: "Line", value: "line" },
        { label: "1m", value: "1m" },
        { label: "15m", value: "15m" },
        { label: "1H", value: "1H" },
        { label: "4H", value: "4H" },
        { label: "1D", value: "1D" },
        { label: "1W", value: "1W" }
      ],
      mainTechnicalIndicatorTypes: ["MA", "EMA", "SAR"],
      subTechnicalIndicatorTypes: ["VOL", "MACD", "KDJ"]
    };
  },
  watch: {
    getLocaleLang(val) {
      console.log(val);
      // this.kLineChart.setStyleOptions(val);
    }
  },
  computed: {
    ...mapGetters({
      getLocaleLang: 'getLocaleLang'
    }),
    currentBar() {
      if (this.current === "") {
        return "line";
      }
      return this.barList.filter(item => item.value === this.current)[0].value;
    }
  },
  mounted: function() {
    this.kLineChart = init("technical-indicator-k-line");
    this.kLineChart.addCustomTechnicalIndicator(emojiTechnicalIndicator);
    this.paneId = this.kLineChart.createTechnicalIndicator("VOL", false);
    this.setCandleTechnicalIndicator('MA');
    this.kLineChart.setStyleOptions(getTooltipOptions(
      'rect', 'follow_cross', 'none'
    ));
    this.$nextTick(() => {
      this.kLineChart.setStyleOptions(getThemeOptions('dark'))
      this.kLineChart.applyNewData(generatedKLineDataList());
    });
    console.log(this.kLineChart.getStyleOptions(), getThemeOptions('dark'));
  },
  methods: {
    setTimezone(timezone) {
      this.kLineChart.setTimezone(timezone);
    },
    changeTime(time) {
      this.current = time;
      if (time === 'line') {
        this.kLineChart.setStyleOptions({
          candle: {
            type: 'area'
          }
        })
      } else {
        this.kLineChart.setStyleOptions({
          candle: {
            type: 'candle_solid'
          }
        })
        this.kLineChart.applyNewData(generatedKLineDataList());
      }
    },
    setCandleTechnicalIndicator: function(type) {
      this.kLineChart.createTechnicalIndicator(type, false, {
        id: "candle_pane"
      });
    },
    setSubTechnicalIndicator: function(type) {
      this.kLineChart.createTechnicalIndicator(type, false, {
        id: this.paneId
      });
    }
  },
  destroyed: function() {
    dispose("technical-indicator-k-line");
  }
};
</script>
<style lang="stylus" scoped>
.top-bar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  .top-bar-item {
    flex: 1;
    color: #929AA5;
    cursor: pointer;
    font-size: 0.48rem;
  }
}
</style>
<style>
.k-line-chart-container {
  display: flex;
  flex-direction: column;
  margin: 0;
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  background-color: #1f2126;
  width: 100%;
  /* height: 800px; */
  height: calc(100vh - 1rem);
  padding: 16px 6px 16px 16px;
}

.k-line-chart-title {
  margin: 0;
  color: #252525;
  padding-bottom: 10px;
}

.k-line-chart {
  display: flex;
  flex: 1;
  background-color: #1f2126;
}
.k-line-chart-menu-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  font-size: 12px;
  color: #606060;
}
.k-line-chart-menu-container button {
  cursor: pointer;
  background-color: #2196f3;
  border-radius: 2px;
  margin-right: 8px;
  height: 24px;
  line-height: 26px;
  padding: 0 6px;
  font-size: 12px;
  color: #fff;
  border: none;
  outline: none;
}
</style>
