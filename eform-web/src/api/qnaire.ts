import {service} from "@/utils/request";

export const newQnaire = async (type: boolean, data: any) =>
  service({
    url: '/qnaire',
    method: 'POST',
    params: {
      a: type,
    },
    data
  });

export const getQnaireById = async (id: number, type: boolean) =>
  service({
    url: '/qnaire',
    method: 'GET',
    params: {
      id,
      a: type
    }
  });

export const updateQnaire = async (type: boolean, data: any) =>
  service({
    url: '/qnaire',
    method: 'PUT',
    params: {
      a: type,
    },
    data
  });

export const deleteQnaire = async (id: number, type: boolean) =>
  service({
    url: '/qnaire',
    method: 'DELETE',
    params: {
      a: type,
    },
    data: {id}
  });

export const getQnaireExcelTemplate = () => {
  window.open('/files/qnaire_excel_template.xlsx');
};

export const uploadURL = '/api/import/excel';


export const getChinaArea = () =>
  service({
    url: '/china_area',
  });
