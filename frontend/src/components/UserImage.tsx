type Props = {
  profileImage: string;
  fullname: string;
  width?: number;
  height?: number;
}

const UserImage = ({ profileImage, fullname, width, height }:Props) => {
  return (
    <>
    {
      profileImage ? (
        <img src={profileImage} alt={fullname || 'user photo'} className={`rounded-full object-contain w-[${width ? width : '45'}px] h-[${height ? height : '45'}px]`} referrerPolicy='no-referrer' />
      ) : (
        <h2 className='w-[45px] h-[45px] rounded-full text-lg font-medium text-center bg-green-600 pt-2 text-white uppercase'>{fullname?.charAt((0)) || 'U'}</h2>
      )
    }
    </>
  )
}

export default UserImage
