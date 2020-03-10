<template>
  <div class="dashboard-container">
    <el-table
      v-loading="listLoading"
      :data="allQnaire"
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
            :type="scope.row.active? 'success' : 'primary'"
            disable-transitions>{{scope.row.type?'匿名问卷':'实名问卷'}}</el-tag>
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
                <el-button type="text" @click.stop="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
      :title="formTitle"
      :visible.sync="detailDrawer">
    </el-drawer>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {UserModule} from '@/store/modules/user';
  import {deleteQnaire} from "@/api/qnaire";
  import {concat} from 'lodash';
  import {Message} from "element-ui";

  @Component({
    name: 'Dashboard',
  })
  export default class extends Vue {
    private listLoading = false;
    private detailDrawer = false;
    private formTitle = '';
    private updateTable = true;
    get allQnaire() {
      return concat(
        UserModule.myAnaire.map( i => ({...i, type: true})),
        UserModule.myQnaire.map( i => ({...i, type: false}))
      )
    }
    createGuide() {
      this.$router.push({
        path: '/guide',
      });
    }
    openDetailDrawer(row: any, column: any, event: any) {
      this.detailDrawer = true;
      this.formTitle = row.name;
    }
    handleEdit(index: number, row: any) {
      this.$router.push({
        path: '/import/editor',
        query: {
          id: row.id,
          type: row.type,
        }
      })
    }
    handleDelete(index: number, row: any) {
      this.$confirm('确定要删除这个问卷吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteQnaire(row.id, row.type).then(res => {
          Message.success('删除成功');
          UserModule.GetUserQnaire();
        }).catch(err => {
          console.log(err.response.data.message);
        });
      });

    }
    mounted() {
      // console.log(process.env);
      UserModule.GetUserQnaire();
    }
  }
</script>
