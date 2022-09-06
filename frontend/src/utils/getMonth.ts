const month= ["January","February","March","April","May","June","July",
"August","September","October","November","December"];

export const getMonth = (date:string):string => {
    const newdate = new Date(date);
    return month[newdate.getMonth()].slice(0,3);
}