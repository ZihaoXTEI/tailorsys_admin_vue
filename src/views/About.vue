<template>
  <div>
    <el-card>
      <div class="parent">
        <div class="div1">
          <img src="@/assets/logo.png" />
        </div>
        <div class="div2">
          <span>制衣店信息管理系统</span>
        </div>
        <div class="div3">
          <table border="1" style="margin: 20px auto;">
            <tr>
              <td>前端框架：</td>
              <td>Vue.js</td>
            </tr>
            <tr>
              <td>UI组件：</td>
              <td>Element UI</td>
            </tr>
            <tr>
              <td>后端框架：</td>
              <td>Spring Boot</td>
            </tr>
          </table>
        </div>
        <div class="div4">
          <el-link
            href="https://gitee.com/cikao/tailorsys"
            target="_blank"
            type="info"
            >
            <!--码云图标-->
            <svg
            width="1rem"
            height="1rem"
            xmlns="http://www.w3.org/2000/svg"
            name="zi_tmGitee"
            viewBox="0 0 2000 2000"
          >
            <path
              d="M898 1992q183 0 344-69.5t283-191.5q122-122 191.5-283t69.5-344q0-183-69.5-344T1525 477q-122-122-283-191.5T898 216q-184 0-345 69.5T270 477Q148 599 78.5 760T9 1104q0 183 69.5 344T270 1731q122 122 283 191.5t345 69.5zm199-400H448q-17 0-30.5-14t-13.5-30V932q0-89 43.5-163.5T565 649q74-45 166-45h616q17 0 30.5 14t13.5 31v111q0 16-13.5 30t-30.5 14H731q-54 0-93.5 39.5T598 937v422q0 17 14 30.5t30 13.5h416q55 0 94.5-39.5t39.5-93.5v-22q0-17-14-30.5t-31-13.5H842q-17 0-30.5-14t-13.5-31v-111q0-16 13.5-30t30.5-14h505q17 0 30.5 14t13.5 30v250q0 121-86.5 207.5T1097 1592z"
            />
          </svg></el-link
          >
          
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style lang="less" scoped>

.parent {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr) repeat(3, 0.5fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;

  width: 400px;
  margin: 10px auto;
  height: auto;
}

.div1 {
  grid-area: 1 / 1 / 3 / 3;
  text-align: center;
}
.div2 {
  grid-area: 3 / 1 / 4 / 3;
  font-size: 35px;
  font-family: '等线';
  text-align: center;
}
.div3 {
  grid-area: 4 / 1 / 5 / 3;
  font-family: '等线 Light';
  font-size: 24px;
}
.div4 {
  grid-area: 5 / 1 / 6 / 3;
  font-size: 12px;
  text-align: center;
}
</style>
