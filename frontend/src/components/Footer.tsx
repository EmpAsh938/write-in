import { GrFacebook, GrTwitter, GrLinkedin, GrYoutube } from 'react-icons/gr'

const Footer = () => {
  return (
    <div className="bg-white text-white border-t border-t-green-200">
      <div className="max-w-2xl text-black mx-auto py-20">
        <div className="flex items-center flex-col space-y-6 sm:space-y-8 px-8 sm:py-0">
          <h6 className="font-semibold text-4xl sm:text-5xl">WriteIn</h6>
          <p className="text-center sm:leading-8 sm:text-lg tracking-wide">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis illum non maiores mollitia nam nulla cum officiis tempore harum amet eligendi, at, eius voluptatem unde ipsum quibusdam, sapiente rem dolore?
          </p>
          <ul className="flex items-center space-x-6">
            <li>
              <a href="#" target="_blank">
                <GrFacebook className="text-3xl" />
              </a>
            </li>
            <li>
              <a href="#" target="_blank">
                <GrTwitter className="text-3xl" />
              </a>
            </li>
            <li>
              <a href="#" target="_blank">
                <GrLinkedin className="text-3xl" />
              </a>
            </li>
            <li>
              <a href="#" target="_blank">
                <GrYoutube className="text-3xl" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="bg-black py-4">
        <div>
          <p className="text-center">
            &copy; 2021 WriteIn. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Footer
