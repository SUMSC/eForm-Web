import {Action, getModule, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {getMyModel, getUserInfo, login} from '@/api/users';
import {IAnswerModel, IQnaireModel} from '@/api/types';
import {getToken, removeToken, setToken} from '@/utils/cookies';
import router, {resetRouter} from '@/router';
import {PermissionModule} from './permission';
import store from '@/store';
import {GeneralResponse} from '@/utils/request';

// UserModule
export interface IUserState {
  token: string
  name: string
  avatar: string
  roles: string[]
  myQnaire: IQnaireModel[]
  myAnaire: IQnaireModel[]
  myAnswer: IAnswerModel[]
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = getToken() || '';
  public id_tag = '';
  public name = '';
  public usertype = '';
  public avatar = 'https://pic2.zhimg.com/v2-54e6163ce5132707169d316a2b77b48c_xl.jpg';
  public roles: string[] = [];
  public myAnaire: IQnaireModel[] = [];
  public myQnaire: IQnaireModel[] = [];
  public myAnswer: IAnswerModel[] = [];

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  private SET_ID_TAG(id_tag: string) {
    this.id_tag = id_tag
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_USERTYPE(usertype: string) {
    this.usertype = usertype
  }

  @Mutation
  private SET_MY_QNAIRE(myQnaire: any[]) {
    this.myQnaire = myQnaire
  }

  @Mutation
  private SET_MY_ANAIRE(myAnaire: any[]) {
    this.myAnaire = myAnaire
  }

  @Mutation
  private SET_MY_ANSWER(myAnswer: any[]) {
    this.myAnswer = myAnswer
  }

  @Mutation
  private SET_AVATAR(avatar: string) {
    this.avatar = avatar
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
  }

  @Action
  public async Login(userInfo: { username: string, password: string}) {
    let { username, password } = userInfo;
    username = username.trim();
    return login({ username, password }).then(({ message }: any) => {
      setToken(message);
      this.SET_TOKEN(message);
    })
  }

  @Action
  public ResetToken() {
    removeToken();
    this.SET_TOKEN('');
    this.SET_ROLES([])
  }

  @Action
  public async GetUserInfo() {
    if (this.token === '') {
      throw Error('GetUserInfo: token is undefined!')
    }
    const { message } = <GeneralResponse>await getUserInfo();
    if (!message) {
      throw Error('Verification failed, please Login again.')
    }
    const { id_tag, name, type, my_answer } = message;
    // roles must be a non-empty array
    // if (!roles || roles.length <= 0) {
    //   throw Error('GetUserInfo: roles must be a non-null array!')
    // }
    this.SET_ROLES(['admin']);
    this.SET_ID_TAG(id_tag);
    this.SET_NAME(name);
    this.SET_USERTYPE(type);
    this.SET_MY_ANSWER(my_answer);
    // this.SET_AVATAR(avatar);
  }

  @Action
  public async GetUserQnaire() {
    if (this.token === '') {
      throw Error('GetUserInfo: token is undefined!')
    }
    return getMyModel('all').then(({ message }: any) => {
      if (!message) {
        throw Error('Verification failed, please Login again.')
      }
      this.SET_MY_ANAIRE(message.anaire);
      this.SET_MY_QNAIRE(message.qnaire);
    })
  }

  @Action
  public async ChangeRoles(role: string) {
    // Dynamically modify permissions
    const token = role + '-token';
    this.SET_TOKEN(token);
    setToken(token);
    await this.GetUserInfo();
    resetRouter();
    // Generate dynamic accessible routes based on roles
    PermissionModule.GenerateRoutes(this.roles);
    // Add generated routes
    router.addRoutes(PermissionModule.dynamicRoutes);
    // Reset visited views and cached views
    // TagsViewModule.delAllViews()
  }

  @Action
  public async LogOut() {
    if (this.token === '') {
      throw Error('LogOut: token is undefined!')
    }
    removeToken();
    resetRouter();

    // Reset visited views and cached views
    // TagsViewModule.delAllViews();
    this.SET_TOKEN('');
    this.SET_ROLES([])
  }
}

export const UserModule = getModule(User);
