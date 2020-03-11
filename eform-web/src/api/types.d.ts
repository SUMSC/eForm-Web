// 统一身份认证返回的数据类型
export interface GeneralError {
  code: number,
  message: string
}

export interface ITokenPayload {
  id: string
  name: string
  usertype: string
  exp: number
}

export interface IUserModel {
  id_tag: string
  name: string
  type: string
  my_qnaire?: IQnaireModel[]
  my_anaire?: IQnaireModel[]
  my_answer?: IAnswerModel[]
}

export interface IQnaireModel {
  id: number
  name: string
  description: string
  active: boolean
  deadline?: string
  create_time?: string
  owner_id: string
  owner: IUserModel
  form: IFormModel[]
  answer?: IAnswerModel[]
}

export interface IAnswerModel {
  id: number
  qnaire_id: number
  qnaire: IQnaireModel
  owner_id?: string
  owner?: IUserModel
  create_time: string
  answer: IFormAnswerModel[]
}

export interface IFormModel {
  id: number
  name: string
  description?: string
  type: string
  required: boolean
  meta?: any
}

export interface IFormAnswerModel {
  id: number
  answer: any
}

