<template>
  <el-row>
    <el-col :span="19" :lg="20" :xl="21">
      <div class="editor-preview">
        <QuestionEditor
          ref="qnaire-title"
          :name="qnaire.name"
          type="qnaire-title"
          @edit="handleEdit($event)"
          @checked="handleChecked"
        />
        <QuestionEditor
          ref="qnaire-description"
          :name="qnaire.description"
          type="qnaire-description"
          @edit="handleEdit($event)"
          @checked="handleChecked"
        />
        <QuestionEditor
          v-for="form in qnaire.form"
          :key="form.id"
          :ref="form.id"
          :id="form.id"
          :type="form.type"
          @edit="handleEdit($event)"
          @checked="handleChecked"
        />
      </div>
    </el-col>
    <el-col :span="5" :lg="4" :xl="3">
      <Sticky>
        <div class="question-component-list">
          <div class="action-group">
            <el-button-group>
              <el-button
                class="editor-btn"
                type="primary"
                icon="el-icon-upload2"
                @click="handleSave"
                @mouseover.native="hoverSave = true"
                @mouseleave.native="hoverSave = false"
              >{{hoverSave?this.$t('qnaire.save'):''}}</el-button>
              <el-button
                class="editor-btn"
                type="primary"
                icon="el-icon-sort"
                @click="handleSort"
                @mouseover.native="hoverSort = true"
                @mouseleave.native="hoverSort = false"
              >{{hoverSort?this.$t('qnaire.sort'):''}}</el-button>
            </el-button-group>
          </div>
          <el-divider class="list-divider"></el-divider>
          <el-row type="flex" justify="center">
            <el-col :span="22">
              <div class="list-item list-title" ><i class="el-icon-star-on"></i> {{ $t('qnaire.append') }}</div>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="22">
            <div class="list-item" v-for="component in components" @click="handleAppend(component)">{{ $t('question.' + component) }}</div>
            </el-col>
          </el-row>
        </div>
      </Sticky>
    </el-col>
  </el-row>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import {QnaireModule} from "@/store/modules/qnaire";
  import QuestionEditor from '../QuestionEditor/index.vue';
  import Sticky from '@/components/Sticky/index.vue';
  import {IFormModel} from "@/api/types";
  import {Message} from "element-ui";
  import _ from 'lodash';
  import {questionComponents} from "@/utils";

  @Component({
    name: 'QnaireEditor',
    components: {
      QuestionEditor,
      Sticky
    }
  })
  export default class extends Vue {
    private nextEditing: string = '';
    private hoverSave = false;
    private hoverSort = false;
    get qnaireId() {
      return this.$route.query.id;
    }
    get qnaireType() {
      return this.$route.query.type;
    }
    get qnaire() {
      return QnaireModule;
    }
    get components() {
      return questionComponents;
    }
    handleSort() {
      console.log('sort');
    }
    handleEdit(id: string) {
      if (QnaireModule.editing === '')
        QnaireModule.SET_EDITING(id);
      else {
        this.nextEditing = id;
        let el : any;
        if (id !== 'qnaire-title' && id !== 'qnaire-description')
          el = (this.$refs[id] as Vue[])[0];
        else el = this.$refs[id];
        el.check();
      }
    }
    handleChecked() {
      if (QnaireModule.editing === this.nextEditing)
        QnaireModule.SET_EDITING('');
      else
        QnaireModule.SET_EDITING(this.nextEditing);
    }
    handleAppend(component: string) {
      const lastQuestion = _.last(QnaireModule.form);
      const newId = lastQuestion? lastQuestion.id + 1 : 1;
      if (QnaireModule.editing === '') {
        const newForm: IFormModel = {
          id: newId,
          name: '',
          description: '',
          type: component,
          meta: {},
          required: false,
        };
        if (newForm.type === 'qnaire-select' || newForm.type === 'qnaire-checkbox') {
          newForm.meta.selection = [
            { value: 'A' },
            { value: 'B' }
          ]
        }
        QnaireModule.SET_FORM(QnaireModule.form.concat([newForm]));
        QnaireModule.SET_EDITING(String(newId));
      } else {
        Message.warning('请先完成当前问题的编辑。')
      }
    }
    handleSave() {
      QnaireModule.SaveQnaire();
    }
    mounted() {
      if (!this.qnaireId) {
        this.$router.push('/guide');
      } else if (this.qnaireId !== 'new') {
        QnaireModule.SET_TYPE(JSON.parse(<string>this.qnaireType));
        QnaireModule.SET_ID(parseInt(<string>this.qnaireId));
        QnaireModule.GetQnaire();
      } else {
        QnaireModule.SET_TYPE(JSON.parse(<string>this.qnaireType));
        QnaireModule.SET_NAME('问卷标题');
        QnaireModule.SET_DESCRIPTION('这里可以写一些问卷简介。');
        QnaireModule.SET_FORM([]);
        QnaireModule.NewQnaire();
      }
    }
  }
</script>

<style lang="scss">
  .action-group {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .editor-preview {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2vh;
  }
  .editor-item {
    margin: 0;
    max-width: 800px;
  }
  .list-divider {
    margin: 20px 0;
  }
  .question-component-list {
    width: 100%;
    /*min-height: calc(100vh - 91px);*/
    background-color: #fafafa;
    border-left: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
    padding-top: 1em;
    padding-bottom: 1em;
  }
  .list-item {
    border: 1px solid #e0e0e0;
    background-color: white;
    padding: 8px 12px 10px 12px;
    width: 10em;
    max-width: 80%;
    text-wrap: none;
    margin-left: 1.2em;
    margin-bottom: 5px;
    cursor: pointer;
    text-align-last: center;
  }
  .save-btn {
    background-color: #409eff;
    color: white;
  }
  .list-item:hover {
    color: #58a6e7;
  }
  .save-btn:hover {
    background-color: #66b1ff;
    color: white;
  }
  .list-title {
    cursor: default;
    background-color: #ecf5ff;
    margin-bottom: 1.5em;
    text-align-last: center;
    color: #669eff;
    border-radius: 10px;
  }
  .list-title:hover {
    color: #669eff;
  }
  .editor-btn {
    transition: width .2s ease;
    width: 61px;
  }
  .editor-btn:hover {
    width: 89px;
  }
</style>
