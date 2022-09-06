const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const emailValidator = (email:string) => {
    return regex.test(email);
}