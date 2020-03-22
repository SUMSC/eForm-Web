<template>
  <div class="dashboard-container">
    <el-table
      v-loading="listLoading"
      :data="qnaire"
      style="width: 100%"
      @row-click="openDetailDrawer"
      v-if="updateTable"
    >
      <el-table-column
        :label="$t('qnaire.name')"
        prop="name"
        align="center"
      ></el-table-column>
      <el-table-column
        :label="$t('qnaire.type')"
        prop="active"
        align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.a? 'success' : 'primary'"
            disable-transitions>{{scope.row.a?'匿名问卷':'实名问卷'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('qnaire.active')"
        prop="active"
        align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <el-tag
            effect="dark"
            :type="scope.row.active? 'success' : 'primary'"
            disable-transitions>{{scope.row.active?'回收中':'未发布'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('qnaire.create_time')"
        prop="create_time"
        align="center"
        min-width="180px"
        width="200px"
      >
        <template slot-scope="scope">
          <span>
            {{scope.row.create_time | dateNormalFormat}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('qnaire.answer')"
        prop="answer"
        align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <span>
            {{scope.row.answer.length}} 份
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="180px"
      >
        <template slot="header" slot-scope="scope">
          <el-button type="primary" @click="createGuide">
            创建问卷
          </el-button>
        </template>
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <el-button icon="el-icon-more" circle @click.stop></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button type="text" v-if="!scope.row.active" @click.stop="handleOpen(scope.row)">开始回收</el-button>
                <el-button type="text" v-else @click.stop="handleClose(scope.row)">暂停回收</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="text" @click.stop="handleEdit(scope.row)">编辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="text" @click.stop="handleDelete(scope.$index, scope.row)">删除</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
      :title="currentQnaire.name"
      :visible.sync="detailDrawer">
      <el-row class="drawer-row" type="flex" justify="space-around">
        <el-col :md="12" :lg="8">
          <span class="drawer-header">问卷 ID</span>
        </el-col>
        <el-col :md="6" :lg="4">
          <span class="drawer-data">{{formID}}</span>
        </el-col>
      </el-row>
      <el-row class="drawer-row" type="flex" justify="space-around">
        <el-col :md="12" :lg="8">
          <span class="drawer-header">题目数量</span>
        </el-col>
        <el-col :md="6" :lg="4">
          <span class="drawer-data">{{currentQnaire.form.length}}</span>
        </el-col>
      </el-row>
      <el-row class="drawer-row" type="flex" justify="space-around">
        <el-col :md="12" :lg="8">
          <span class="drawer-header">问卷状态</span>
        </el-col>
        <el-col :md="6" :lg="4">
          <span class="drawer-data">
            {{currentQnaire.active?'回收中':'未发布'}}
          </span>
        </el-col>
      </el-row>
      <el-row class="drawer-row" type="flex" justify="space-around">
        <el-col :md="12" :lg="8" style="display: flex; align-items: center">
          <span class="drawer-header">问卷链接</span>
        </el-col>
        <el-col :md="6" :lg="4">
          <span class="drawer-data">
            <el-button type="text" @click="handleOpenLink(getWjUrl)">预览</el-button>
            <el-button type="text" @click="handleCopyLink(getWjUrl)">复制链接</el-button>
          </span>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-around">
        <el-col :span="24">
          <div class="drawer-actions">
            <el-button-group>
              <el-button type="primary">统计</el-button>
              <el-button type="primary" @click="handleEdit({id: formID, type: formType})">编辑</el-button>
              <el-button v-if="!currentQnaire.active" type="primary" @click="handleOpen({id: formID, type: formType})">开始回收</el-button>
              <el-button v-else type="primary" @click="handleClose({id: formID, type: formType})">暂停回收</el-button>
            </el-button-group>
          </div>
        </el-col>
      </el-row>

    </el-drawer>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {UserModule} from '@/store/modules/user';
  import {deleteQnaire, updateQnaire} from "@/api/qnaire";
  import _ from 'lodash';
  import {Message} from "element-ui";
  import {copyToClipBoard} from '@/utils'

  @Component({
    name: 'Dashboard',
  })
  export default class extends Vue {
    private listLoading = false;
    private detailDrawer = false;
    private formType = false;
    private formID = 0;
    private updateTable = true;
    get currentQnaire() {
      if (this.formID !== 0)
        return _.find(this.qnaire, { id: this.formID });
      else
        return { name: null, form: [] };
    }
    get qnaire() {
      return UserModule.myQnaire;
    }
    get getWjUrl() {
      return process.env['VUE_APP_BASE_API'] + '/wj/' + this.formID + '?a=' + (this.formType ? '1' : '0')
    }
    createGuide() {
      this.$router.push({
        path: '/guide',
      });
    }
    openDetailDrawer(row: any, column: any, event: any) {
      this.detailDrawer = true;
      this.formID = row.id;
      this.formType = row.type;
    }
    handleEdit({ id }: any) {
      this.$router.push({
        path: '/import/editor',
        query: {
          id
        }
      })
    }
    handleDelete(index: number, row: any) {
      this.$confirm('确定要删除这个问卷吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteQnaire(row.id).then(res => {
          Message.success('删除成功');
          UserModule.GetUserQnaire();
        }).catch(err => {
          console.log(err.response.data.message);
        });
      });
    }
    // TODO: GetUserQnaire 改为直接修改 UserModule 中的问卷数据
    handleOpen({ id }: any) {
      updateQnaire({ id, active: true }).then(res => {
        Message.success('问卷已经开始回收了');
        UserModule.GetUserQnaire();
      });
    }
    handleClose({ id }: any) {
      updateQnaire({ id, active: false }).then(res => {
        Message.success('问卷已经停止回收了');
        UserModule.GetUserQnaire();
      });
    }
    handleCopyLink(link: string) {
      copyToClipBoard(link)
    }
    handleOpenLink(link: string) {
      window.open(link)
    }
    mounted() {
      // console.log(process.env);
      UserModule.GetUserQnaire()
    }
  }
</script>

<style scoped lang="scss">
  .drawer-header {
    color: #909399;
  }
  .drawer-data {
    color: #303133;
    display: flex;
    justify-content: center;
  }
  .drawer-row {
    margin: 0 20px 15px 20px;
    border-bottom: 1px solid #e1e7f2;
    padding-bottom: 15px;
  }
  .drawer-actions {
    display: flex;
    justify-content: center;
  }
</style>
