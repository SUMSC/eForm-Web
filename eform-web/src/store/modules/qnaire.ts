import {IFormModel, IQnaireSettingsModel} from "@/api/types";
import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import store from '@/store';
import {getChinaArea, getQnaireById, newQnaire, updateQnaire} from "@/api/qnaire";
import {UserModule} from "@/store/modules/user";
import {Vue} from "vue-property-decorator";

export interface IQnaireState {
  id: number,
  name: string,
  description: string,
  form: IFormModel[],
  type: boolean,
  settings: IQnaireSettingsModel
  deadline: string | null
}

@Module({ dynamic: true,  store, name: 'qnaire'})
class Qnaire extends VuexModule implements IQnaireState {
  public id = 0;
  public name = '';
  public description = '';
  public form: IFormModel[] = [];
  public type: boolean = false;
  public editing: string = '';
  public chinaArea: any[] = [];
  public settings: IQnaireSettingsModel = {
    only_once: false,
    shuffle_selections: false,
    allow_edit: false
  }
  public deadline: string = ''

  @Mutation
  public SET_ID(value: number) {
    this.id = value;
  }

  @Mutation
  public SET_NAME(value: string) {
    this.name = value;
  }

  @Mutation
  public SET_DESCRIPTION(value: string) {
    this.description = value;
  }

  @Mutation
  public SET_FORM(value: IFormModel[]) {
    this.form = value;
  }

  @Mutation
  public SET_TYPE(value: boolean) {
    this.type = value;
  }

  @Mutation
  public SET_EDITING(value: string) {
    this.editing = value;
  }

  @Mutation
  public SET_CHINA_AREA(value: any) {
    this.chinaArea = value;
  }

  @Mutation
  public SET_SETTINGS(value: IQnaireSettingsModel) {
    this.settings = value
  }

  @Mutation
  public UPDATE_SETTINGS({ key, value }: { key: string, value: boolean }) {
    Vue.set(this.settings, key, value)
  }

  @Mutation
  public INIT_SETTINGS() {
    this.settings = {
      only_once: true,
      shuffle_selections: false,
      allow_edit: false
    }
  }

  @Mutation
  public SET_DEADLINE(value: any) {
    this.deadline = value
  }

  @Action
  public async GetQnaire() {
    return getQnaireById(this.id).then(({ message } : any) => {
      const res = message[0]
      this.SET_TYPE(res.a)
      this.SET_DEADLINE(res.deadline)
      this.SET_NAME(res.name);
      this.SET_DESCRIPTION(res.description);
      this.SET_FORM(res.form);
      this.SET_SETTINGS(res.settings)
    });
  }

  @Action
  public async NewQnaire() {
    return newQnaire({
      name: this.name,
      description: this.description,
      active: false,
      owner_id: UserModule.id_tag,
      form: this.form,
      settings: this.settings,
      a: this.type
    }).then(({ message }: any) => {
      this.SET_ID(message)
    });
  }

  @Action
  public async SaveQnaire() {
    return updateQnaire({
      id: this.id,
      name: this.name,
      description: this.description,
      form: this.form,
    });
  }

  @Action
  public async SaveSetting() {
    return updateQnaire({
      id: this.id,
      settings: this.settings
    })
  }

  @Action
  public SaveDeadline() {
    return updateQnaire({
      id: this.id,
      deadline: this.deadline
    })
  }

  @Action
  public async GetChinaArea() {
    if (this.chinaArea.length > 0) return;
    return getChinaArea().then(res => {
      // console.log(res);
      this.SET_CHINA_AREA(res);
    })
  }

  @Action
  public async ChangeType() {
    return updateQnaire({
      id: this.id,
      a: this.type
    })
  }
}

export const QnaireModule = getModule(Qnaire);
