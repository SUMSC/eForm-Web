<template>
  <div :class="{ 'question-block': true, 'more-action': isNativeType, 'highlight': edit }">
    <component
      ref="question"
      :is="type"
      :name="name"
      :edit="edit"
      :id="id"
      @edit="handleEdit"
      @checked="$emit('checked')"
    />
    <div class="op-menu">
      <span @click="handleEdit"><i :class="{ 'edit-btn': true, 'el-icon-edit-outline': !edit, 'el-icon-check': edit }" /></span>
      <span v-show="isNativeType" @click="handleDuplicate"><i class="copy-btn el-icon-copy-document" /></span>
      <span v-show="isNativeType" @click="handleDelete"><i class="delete-btn el-icon-delete" /></span>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator";
  import Title from '@/components/QnaireTitle/index.vue';
  import Description from '@/components/QnaireDescription/index.vue';
  import {QnaireModule} from "@/store/modules/qnaire";
  import PlainText from '@/components/PlainText/index.vue';
  import QnaireInput from '@/components/QnaireInput/index.vue';
  import QnaireSelect from '@/components/QnaireSelect/index.vue';
  import QnaireCheckbox from '@/components/QnaireCheckbox/index.vue';
  import QnaireTextarea from '@/components/QnaireTextarea/index.vue';
  import AreaPicker from '@/components/AreaPicker/index.vue';
  import DatePicker from '@/components/DatePicker/index.vue';
  import FileUploader from '@/components/FileUploader/index.vue';
  import _ from 'lodash';
  import {Message} from "element-ui";

  @Component({
    name: 'QuestionEditor',
    components: {
      'qnaire-title': Title,
      'qnaire-description': Description,
      'plain-text': PlainText,
      'qnaire-input': QnaireInput,
      'qnaire-select': QnaireSelect,
      'qnaire-checkbox': QnaireCheckbox,
      'qnaire-textarea': QnaireTextarea,
      'area-picker': AreaPicker,
      'date-picker': DatePicker,
      'file-uploader': FileUploader,
    },
  })
  export default class extends Vue {
    @Prop(String) readonly name!: string;
    @Prop(String) readonly type!: string;
    @Prop(Number) readonly id!: number;

    get isNativeType() {
      return this.type !== 'qnaire-title' && this.type !== 'qnaire-description';
    }

    get edit() {
      if (this.isNativeType) return parseInt(QnaireModule.editing) === this.id;
      else return QnaireModule.editing === this.type;
    }

    handleEdit() {
      if (this.isNativeType) {
        this.$emit('edit', String(this.id));
      } else {
        this.$emit('edit', this.type);
      }
    }

    handleDelete() {
      QnaireModule.SET_FORM(QnaireModule.form.filter(i => i.id !== this.id));
      if (QnaireModule.editing === String(this.id))
        QnaireModule.SET_EDITING('');
    }

    handleDuplicate() {
      if (QnaireModule.editing !== '') {
        Message.warning('请先完成当前问题的编辑。');
        return
      }
      const copy = _.cloneDeep(QnaireModule.form[this.id - 1]);
      copy.id = QnaireModule.form.length + 1;
      QnaireModule.SET_FORM(QnaireModule.form.concat([copy]));
    }

    check() {
      const qel : any = this.$refs.question;
      qel.check();
    }

    mounted() {
      console.log(this.name, this.type, this.id);
    }
  }
</script>

<style scoped lang="scss">
  .question-block {
    padding: 1px calc(1em + 1px);
    max-width: 1000px;
    min-width: 50em;
    width: 60vw;
    display: flex;
    position: relative;
    min-height: 50px;
  }
  .more-action {
    min-height: 100px
  }
  .op-menu {
    visibility: hidden;
    border-left: 1px solid #e0e0e0;
    background-color: #f5f5f5;
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    opacity: .8;
    span {
      position: relative;
      padding: 4px 12px;
      font-size: 20px;
      color: #999999;
    }
    span:hover {
      color: white;
      background-color: #479de6;
      opacity: 1;
      transition-duration: .2s;
    }
  }

  .question-block:hover {
    padding: 0 1em;
    border: 1px solid #e0e0e0;
    background-color: #fafafa;
    .op-menu {
      visibility: visible;
    }
  }

  .highlight {
    padding: 0 1em;
    border: 1px solid #e0e0e0;
    background-color: #fafafa;
    .op-menu {
      visibility: visible;
    }
  }


</style>
