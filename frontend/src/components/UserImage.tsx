type Props = {
  profileImage: string;
  fullname: string;
  width: number;
  height: number;
}

const UserImage = ({ profileImage, fullname }:Props) => {
  return (
    <>
    {
      profileImage ? (
        <img src={profileImage} alt={fullname || 'user photo'} className={`rounded-full object-cover w-[50px] h-[50px]`} referrerPolicy='no-referrer' />
      ) : (
        <div className={`w-[40px] h-[40px] bg-green-400 rounded-full grid place-items-center`}>
            <h2 className='uppercase'>{fullname?.charAt(0) || 'U'}</h2>
        </div>
      )
    }
    </>
  )
}

export default UserImage
