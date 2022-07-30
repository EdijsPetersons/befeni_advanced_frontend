import { useRouter } from 'next/router'
import Image from 'next/image';

import { useQuery } from '@tanstack/react-query'

// @ts-ignore
import ReactStars from "react-rating-stars-component";

import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

import DesignInspirations from '../../components/DesignInspirations';

type ImageData = {
  id: number,
  fabric_id: number,
  type: string,
  image_url: string,
  variant: string,
  created_at: Date,
  updated_at: Date
}

type FabricDetails = {
  id: number,
  name: string,
  pattern: string,
  comfort: number,
  images: ImageData[],
  type: string,
  fiber_1_percentage: number,
  fiber_1: string,
  fiber_2_percentage: number,
  fiber_2: string,
  fiber_3_percentage: number,
  fiber_3: string,
  default_weave: string,
  default_weight: string,
  ironing: number
}

type FabricData = {
  status: string,
  data: {
    collection: [FabricDetails]
  }
}

const getFabrics = async (fabricCode: string | string[] | undefined) : Promise<FabricData> => {
  return typeof fabricCode === 'undefined'
    ? Promise.reject(new Error('Invalid fabric code!'))
    : fetch(`/api/fabrics/${fabricCode}`).then(res => res.json());
}

function getFabricDetails(item:FabricDetails) {
  const fabricMaterial = `${item.fiber_1_percentage}% ${item.fiber_1}, ${item.fiber_2_percentage}% ${item.fiber_2} ${item.fiber_3_percentage}% ${item.fiber_3}`;

  const itemDetails = {
    type: item.type,
    material: fabricMaterial,
    webart: item.default_weave,
    weight: item.default_weight
  }

  return itemDetails;
}

const Fabrics = () => {
  const router = useRouter()
  const { fabric_code } = router.query

  const { isLoading, isError, data, error } = useQuery<FabricData, Error>(['getFabrics', fabric_code], () => getFabrics(fabric_code))

  if (isLoading) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  const mainItem = data.data.collection[0];

  console.log({ ...mainItem });
  
  return (
    <div className='fabric w-full flex justify-center'>
      <div className='container flex flex-col px-4 max-w-screen-xl relative'>
        <section className='fabric-content'>
          <div className='title flex my-6 justify-between'>
            <h2 className='flex justify-between portrait:w-full landscape:space-x-2 landscape:lg:w-full text-2xl lg:text-4xl font-semibold'>
              <span>{mainItem.name}</span>
              <span>{fabric_code}</span>
            </h2>

            <span className='hidden landscape:block landscape:lg:hidden'>
              <a href="#desgin-inspirations">View desgin inspiration</a>
            </span>
          </div>

          <div className='fabric-info flex flex-col landscape:flex-row lg:flex-row'>
            <div className='img-carousel w-full landscape:w-1/2 lg:w-1/2'>
              <Fade>
                {mainItem.images.filter(img => img.variant === 'portrait').map((fadeImage, index) => (
                  <div className="each-fade" key={fadeImage.id}>
                    <div className="image-container h-80 lg:h-full">
                      <Image src={fadeImage.image_url} alt="Fabric image" className='object-cover h-[477px] w-full rounded-md' width={448} height={477} />
                    </div>
                  </div>
                ))}
              </Fade>
            </div>

            <div className={`spacer w-full md:w-8 h-4`} />

            <div className='fabric-details w-full'>
              <table className="table-auto border border-collapse w-full text-left">
                <tbody>
                  {Object.entries(getFabricDetails(mainItem)).map((field) => (
                    <tr key={field[0]} className="border-b even:bg-gray-50 odd:bg-white">
                      <th className="px-4 py-2 capitalize border-r">{field[0]}</th>
                      <td className="px-4 py-2">{field[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className='ratings my-16 w-full'>
                <div className='fabric-ironing px-4 flex space-between items-center'>
                  <div className='ironing-title text-2xl w-44'>
                    <span>Ironing</span>
                  </div>
                  <ReactStars count={5} size={30} value={mainItem.ironing} edit={false} color2='#ffd700' isHalf={true} classNames="text-green-500" />
                </div>
                <div className='fabric-comfort px-4 flex space-between items-center'>
                  <div className='comfort-title text-2xl w-44'>
                    <span>Comfort</span>
                  </div>
                  <ReactStars count={5} size={30} value={mainItem.comfort} edit={false} color2='#ffd700' isHalf={true} />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className='desgin-inspirations' id="desgin-inspirations">
          <hr className='mb-8 lg:mt-8'/>
          <h2 className='text-2xl text-center'>Design Inspirations</h2>
          <DesignInspirations fabric_code={fabric_code} />
        </section>
      </div>
    </div>
  )
}

export default Fabrics
