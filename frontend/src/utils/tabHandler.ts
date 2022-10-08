export const tabHandler = (event:React.MouseEvent<HTMLButtonElement>,classType:string) => {
    document.querySelectorAll(`.${classType}`).forEach(tab => tab.classList.remove('active'));
    (event.target as Element).classList.add('active');
}