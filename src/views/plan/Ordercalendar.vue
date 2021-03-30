<template>
  <div>
    <el-calendar>
      <!--<template slot="dateCell" slot-scope="{ date, data }">-->
      <template v-slot:dateCell="{ date, data }">
        <div class="calendar-day">
          <p style="margin-block-start: 0em;margin-block-end:0em">
            {{
              data.day
                .split('-')
                .slice(1)
                .join('-')
            }}
          </p>

          <span v-for="(item, index) in medata(data)" :key="index" style="display:block;">
            {{ item.content }}<br>
          </span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: new Date(),
      schedule: [
        { date: '2021-03-20', content: '陈小姐订单' },
        { date: '2021-03-20', content: '李先生订单' },
        { date: '2021-03-25', content: '进货' }
      ],
      resDate: [{ date: '2021-03-12', content: '上课' }]
    }
  },

  methods: {
    /* 

    async getTimeConfig() {
      // 根据日期分类
      this.groupedItems = _(this.resDate)
        .groupBy(item => item.date)
        .map((items, day) => {
          return {
            day: day,
            likes: items
          }
        })
        .reverse() // 为了反转数组排序
        .value()
    } */
  },

  computed: {
    medata() {
      return data => {
        return this.schedule.filter(ele => {
          //let time = this.$moment(Number(ele.start_time * 1000)).format('YYYY-MM-DD')   // 将时间戳转格式
          //console.log(ele)
          //return this.$moment(Number(ele.date)).isSame(data.day)
          //console.log(data.day)
          if (ele.date === data.day) {
            return ele.date
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.is-selected {
  color: #1989fa;
}

/*.el-calendar-table .el-calendar-day {
    box-sizing: border-box;
    padding: 8px;
    height: 100%;
}
*/

</style>

<style>


.calendar-day {
  text-align: center;
  font-size: 14px;
/*   padding-top: 2px;
  border-top: 0px; */
}
</style>
