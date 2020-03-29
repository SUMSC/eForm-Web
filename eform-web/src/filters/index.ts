import moment from 'moment';

// Set utils function parseTime to filter
export { parseTime } from '@/utils';

// Filter for article status
export const articleStatusFilter = (status: string) => {
  const statusMap: { [key: string]: string } = {
    published: 'success',
    draft: 'info',
    deleted: 'danger'
  };
  return statusMap[status]
};

// Filter to uppercase the first character
export const uppercaseFirstChar = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
};


export const dateNormalFormat = (str: string) => {
  return moment(str).format('YYYY-MM-DD')
};

export const radioValue = (i: number) => {
  return String.fromCharCode(65+i);
};

export const headerPrefix = (content: string) => {
  return `ID：${content}`;
};

export const stripLongText = (content: string) => {
  if (content.length > 20) {
    return content.substr(0, 20) + '……）';
  }
};
