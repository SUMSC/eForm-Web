<template>
  <div class="dashboard-editor-container">
    <el-row>
      <el-col :span="8">
        <div class="grid-content bg-purple">

        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple-light">

        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">

        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {UserModule} from '@/store/modules/user'

  @Component({
    name: 'DashboardEditor',
  })
  export default class extends Vue {
    private emptyGif = 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3';

    get name() {
      return UserModule.name
    }

    get avatar() {
      return UserModule.avatar
    }

    get roles() {
      return UserModule.roles
    }
  }
</script>

<style lang="scss" scoped>
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }


  .emptyGif {
    display: block;
    width: 45%;
    margin: 0 auto;
  }

  .dashboard-editor-container {
    background-color: #e3e3e3;
    min-height: 100vh;
    padding: 50px 60px 0px;

    .info-roles {
      font-size: 12px;
      font-weight: 700;
      color: #333;
      display: block;
    }

    .info-container {
      position: relative;
      margin-left: 190px;
      height: 150px;
      line-height: 200px;

      .display_name {
        font-size: 48px;
        line-height: 48px;
        color: #212121;
        position: absolute;
        top: 25px;
      }
    }
  }
</style>
