export const numberCount = (param:number) => {
    let finalString:string = "";
    let comparerValue = param.toString().length; 
    if(comparerValue > 2 && comparerValue < 7) {
        finalString = (param / 1000) + "k";
    } else if (comparerValue > 6 && comparerValue < 10){
        finalString = (param / 1000000) + "m";
    } else {
        finalString += param;
    }
    return finalString;
}

