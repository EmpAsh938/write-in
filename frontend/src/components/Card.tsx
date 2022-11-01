import { numberCount } from '../utils/numberCount';
type Props = {
    count: number;
    title: string;
}

const Card:React.FC<Props> = ({ count, title }) => {
  return (
    <div className='bg-white border border-solid border-green-200 rounded p-5 px-10 min-w-[100px]'>
        <h2 className='font-bold text-5xl text-gray-600 text-center'>{numberCount(count)}</h2>
        <p className='text-sm text-gray-700'>{title}</p>
    </div>
  )
}

export default Card
