import {loginService, service} from '@/utils/request';
import * as crypto from 'crypto';

const hashSeed = (secret: string, method: string) =>
  crypto.createHash(method).update(secret).digest('hex');

export const login = async (data: { username: string, password: string }) =>
  loginService({
    url: '/',
    method: 'post',
    data: {
      id: data.username,
      token: hashSeed(data.password, 'md5'),
    },
    responseType: 'json'
  });

export const logout = () =>
  loginService({
    url: '/logout',
    method: 'post',
  });

export const getMyModel = (model: string, params: any = {}) =>
  service({
    url: `/my/${model}`,
    method: 'get',
    params
  });

export const getUsers = (params: any) =>
  service({
    url: '/users',
    method: 'get',
    params
  });

export const getUserInfo = (params: any = {}) =>
  service({
    url: '/user',
    method: 'get',
    params
  });

export const getUserByName = (username: string) =>
  service({
    url: `/users/${username}`,
    method: 'get'
  });

export const updateUser = (username: string, data: any) =>
  service({
    url: `/users/${username}`,
    method: 'put',
    data
  });

export const deleteUser = (username: string) =>
  service({
    url: `/users/${username}`,
    method: 'delete',
  });

// export const register = (data: any) =>
//   request({
//     url: '/users/register',
//     method: 'post',
//     data
//   });
