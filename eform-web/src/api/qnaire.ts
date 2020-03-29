import {service} from "@/utils/request";

export const newQnaire = async (data: any) =>
  service({
    url: '/qnaire',
    method: 'POST',
    data
  });

export const getQnaireById = async (id: number) =>
  service({
    url: '/qnaire',
    method: 'GET',
    params: {
      id,
    }
  });

export const updateQnaire = async (data: any) =>
  service({
    url: '/qnaire',
    method: 'PUT',
    data
  });

export const deleteQnaire = async (id: number) =>
  service({
    url: '/qnaire',
    method: 'DELETE',
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

export const getAnswers = (qnaire_id: number) =>
  service({
    url: '/answer',
    method: 'GET',
    params: {
      qnaire_id
    }
  });

export const getAnalysis = (id: number) =>
  service({
    url: '/analysis',
    method: 'GET',
    params: {
      id
    }
  });
