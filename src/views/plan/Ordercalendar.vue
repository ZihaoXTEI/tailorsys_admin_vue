<template>
  <div>
    <el-calendar>
      <!--<template slot="dateCell" slot-scope="{ date, data }">-->
      <template #dateCell="{ data }">
        <div class="calendar-day" :class="data.isSelected ? 'is-selected' : ''">
          <div
            style="margin-block-start: 0em;margin-block-end:0em"
            @click="addEventM(data.day)"
          >
            {{
              data.day
                .split('-')
                .slice(1)
                .join('-')
            }}
          </div>

<!--           <template v-for="(item, index) in orderListFilter(data)">
            <div class="div-order" :key="index + 'o'">{{ item.orderName }}</div>
          </template> -->
          <template v-for="(item, index) in orderListFilter(data)">
            <el-popover
              ref="popover"
              placement="right"
              :title="item.orderName"
              :width="250"
              trigger="hover"
              :content="'订单编号：' + item.orderId"
              :key="index + 'o'"
            >
              <template #reference>
                <div class="div-order">{{ item.orderName }}</div>
              </template>
            </el-popover>
          </template>

          <!--           <span
            v-for="(item, index) in dataFilter(data)"
            :key="index"
            style="display:block;"
          >
            {{ item.content }}<br />
          </span> -->

          <template v-for="(item, index) in eventListFilter(data)">
            <!--             <el-tooltip
              :content="item.content"
              placement="bottom"
              effect="light"
              :key="index"
            >
              <div class="isSelected">{{ item.content }}</div>
            </el-tooltip> -->

            <el-popconfirm
              confirmButtonText="好的"
              cancelButtonText="不用了"
              icon="el-icon-info"
              iconColor="red"
              title="确定删除该事件吗？"
              @confirm="deleteEventM(item.id)"
              :key="index + 'e'"
            >
              <template #reference>
                <div class="div-event">{{ item.content }}</div>
              </template>
            </el-popconfirm>
          </template>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
import {
  getEventList,
  addEvent,
  updateEvent,
  deleteEvent,
  getOrderList
} from '@/api/plan'
import { changeDateFormat } from '@/utils/moment'
export default {
  data() {
    return {
      value: new Date(),

      counts: 0,
      time: '',

      eventForm: {
        id: null,
        date: '',
        content: ''
      },

      eventList: [],
      orderList: []
    }
  },

  computed: {
    orderListFilter() {
      return data => {
        return this.orderList.filter(item => {
          if (item.deadline === data.day) {
            console.log(item.deadline)
            return item.deadline
          }
        })
      }
    },

    eventListFilter() {
      return data => {
        return this.eventList.filter(item => {
          //let time = this.$moment(Number(ele.start_time * 1000)).format('YYYY-MM-DD')   // 将时间戳转格式
          //console.log(ele)
          //return this.$moment(Number(ele.date)).isSame(data.day)
          /*           if(this.time === data.day){
            this.counts ++
            console.log(this.counts)
          }else{
            this.counts = 0
            this.time = data.day
            console.log(this.counts)
          } */
          if (item.date === data.day) {
            return item.date
          }
        })
      }
    }
  },

  created() {
    this.getList()
  },

  methods: {
    getList() {
      getEventList().then(res => {
        this.eventList = res.data
        changeDateFormat(this.eventList, 'date')
        console.log(this.eventList)
      })

      getOrderList().then(res => {
        this.orderList = res.data
        changeDateFormat(this.orderList, 'deadline')
        console.log(this.orderList)
      })
    },

    addEventM(day) {
      this.eventForm.date = day

      this.$prompt('请输入事件', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern:/^.{2,8}$/,
        inputErrorMessage: '输入字符限制在2-9个'
      })
        .then(({ value }) => {
          this.eventForm.content = value
          addEvent(this.eventForm).then(res => {
            this.getList()
          })
          this.$message({
            type: 'success',
            message: '保存成功'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
    },

    deleteEventM(id) {
      console.log(id)
      deleteEvent(id)
        .then(res => {
          this.getList()
        })
        .catch(err => {})
    }
  }
}
</script>

<style>
.calendar-day {
  text-align: center;
  line-height: 16px;
  font-size: 12px;

  /*   padding-top: 2px;
  border-top: 0px; */
}

.el-calendar-table .el-calendar-day {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  height: 150px;
}

.el-calendar-table .el-calendar-click {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 8px;
  height: 100px;
}
.el-calendar-table thead th {
  padding: 6px 0;
  color: #606266;
  font-weight: normal;
  text-align: center;
}

.is-selected {
  color: #1989fa;
  font-size: 10px;
}

.div-order {
  box-sizing: border-box;
  border-radius: 8px;
  border-style: 4px solid;
  margin-bottom: 2px;
  padding: auto;
  background-color: blanchedalmond;
}

.div-event {
  box-sizing: border-box;
  border-radius: 8px;
  border-style: 4px solid;
  margin-bottom: 2px;
  padding: auto;
  background-color: rgb(159, 221, 240);
}
</style>
