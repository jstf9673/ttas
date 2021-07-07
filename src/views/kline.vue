<template>
  <div class="app">
    <TechnicalIndicatorKLineChart />
  </div>
</template>

<script>
import TechnicalIndicatorKLineChart from "@/components/TechnicalIndicatorKLineChart";

export default {
  components: {
    TechnicalIndicatorKLineChart
  }
};
</script>

<style lang="stylus" scoped>
.app {
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  padding: 0;
}
</style>
