export type DateType = Date | string;

export const convertDate = (date: DateType): number=>{
  if(date instanceof Date){
    return date.getTime();
  }

  return Date.parse(date);
}