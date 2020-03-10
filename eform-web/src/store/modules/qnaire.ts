import {IFormModel} from "@/api/types";
import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import store from '@/store';
import {getQnaireById, newQnaire, updateQnaire} from "@/api/qnaire";
import {GeneralResponse} from "@/utils/request";
import {UserModule} from "@/store/modules/user";

export interface IQnaireState {
  id: number,
  name: string,
  description: string,
  form: IFormModel[],
  type: boolean,
}

@Module({ dynamic: true,  store, name: 'qnaire'})
class Qnaire extends VuexModule implements IQnaireState {
  public id = 0;
  public name = '';
  public description = '';
  public form: IFormModel[] = [];
  public type: boolean = false;
  public editing: string = '';

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

  @Action
  public async GetQnaire() {
    const res = (<GeneralResponse>await getQnaireById(this.id, this.type)).message[0];
    this.SET_NAME(res.name);
    this.SET_DESCRIPTION(res.description);
    this.SET_FORM(res.form);
  }

  @Action
  public async NewQnaire() {
    const res = <GeneralResponse>await newQnaire(this.type, {
      name: this.name,
      description: this.description,
      active: false,
      owner_id: UserModule.id_tag,
      form: this.form,
    });
    this.SET_ID(res.message);
  }

  @Action
  public async SaveQnaire() {
    const res = <GeneralResponse>await updateQnaire(this.type, {
      id: this.id,
      name: this.name,
      description: this.description,
      form: this.form,
    });
  }
}

export const QnaireModule = getModule(Qnaire);
