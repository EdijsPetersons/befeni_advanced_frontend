import { useRouter } from 'next/router'
import Image from 'next/future/image';

import { useQuery } from '@tanstack/react-query'

// @ts-ignore
import ReactStars from "react-rating-stars-component";
import { ClipLoader } from 'react-spinners';

import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

import DesignInspirations from '@/components/DesignInspirations';

import useBefeniClient from '../../contexts/befeniContext'

import { useEffect, useState } from 'react';

type ImageData = {
  id: number,
  fabric_id: number,
  type: string,
  image_url: string,
  variant: string,
  created_at: Date,
  updated_at: Date
}

type FabricData = {
  id: number,
  name: string,
  pattern: string,
  comfort: number,
  fabricImages: ImageData[],
  type: string,
  compositionLabel: {
    fiber_1_percentage: number,
    fiber_1: string,
    fiber_2_percentage: number,
    fiber_2: string,
    fiber_3_percentage: number,
    fiber_3: string,
  }
  default_weave: string,
  default_weight: string,
  ironing: number
}

const getFabrics = async (fabricCode: string, client: any) : Promise<FabricData> => {
  if (typeof fabricCode === 'undefined') {
    return Promise.reject(new Error('Invalid fabric code!'))
  }
  // Retrieve the 'Boston' fabric
  const fabric = await client.getFabric(fabricCode);

  return fabric

}

function shortenFabricID(fabricId:string) {
  const fabricIdNum = parseInt(fabricId);
	if(fabricIdNum > 10000) {
		const firstDigit = fabricId.toString()[0];
		if(firstDigit === '1') {
			return fabricIdNum % 10000;
		}
		if(firstDigit === '2') {
			return 'T' + (fabricIdNum % 20000);
		}
		if(firstDigit === '3') {
			return 'K' + (fabricIdNum % 30000);
		}
	}
	return fabricId;
};

function getFabricDetails(item:FabricData) {
  let fabricCompositionLabelString = '';

  // @ts-ignore
	const fabricCompositionLabel = item.getFabricCompositionLabel();

	if(fabricCompositionLabel) {
		fabricCompositionLabelString = fabricCompositionLabel.generateCompositionLabelString();
	}
  
  let fabricWeight: number | string = parseInt(item.default_weight);

	if(!isNaN(fabricWeight)) {
		fabricWeight = `${fabricWeight} g/sqm`
  }

  const itemDetails = {
    type: item.type,
    material: fabricCompositionLabelString,
    webart: item.default_weave,
    weight: fabricWeight
  }

  return itemDetails;
}

const getCarouselImages = (images: ImageData[]) => {
  return images.filter((image) => {
    // @ts-ignore
		const type = image.getType();
    // @ts-ignore
		const variant = image.getVariant();
		return (type === 'client_shop')
      || (type === 'konfigurator_base')
      || ((variant === 'portrait') && (type === 'into_collar' || type === 'fabric_on_roll' || type === 'mannequin'));
	});
}

const Fabrics = () => {
  const router = useRouter()
  const [fabricCode, setFabricCode] = useState('')
  const client = useBefeniClient()

  useEffect(() => {
    if (router.isReady) {
      setFabricCode(router.query.fabric_code as string)
    }
  }, [router.isReady, router.query]);

  const { isLoading, isError, data, error } = useQuery<FabricData, Error>(['getFabrics', fabricCode], () => getFabrics(fabricCode, client))

  if (isLoading) {
    return (
      <div className='w-full flex justify-center my-16'>
        <ClipLoader />
      </div>
    )
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  console.log({ data });
  
  return (
    <main className='fabric w-full flex justify-center px-4'>
      <div className='container flex flex-col px-4 max-w-screen-lg relative'>
        <section className='fabric-content'>
          <div className='title flex my-2 lg:my-6 justify-between'>
            <h2 className='flex justify-between portrait:w-full landscape:space-x-2 landscape:lg:w-full text-3xl lg:text-4xl font-semibold'>
              <span>{data.name}</span>
              <span>{shortenFabricID(fabricCode)}</span>
            </h2>

            <span className='hidden landscape:flex items-center landscape:lg:hidden'>
              <a href="#desgin-inspirations">View desgin inspiration</a>
            </span>
          </div>

          <div className='fabric-info flex flex-col landscape:flex-row lg:flex-row'>
            <div className='img-carousel w-full landscape:w-2/5 lg:w-2/5'>
              <Slide>
                {getCarouselImages(data.fabricImages).map((fadeImage) => (
                  <div className="image-container each-slide max-h-max" key={fadeImage.id}>
                    <Image src={fadeImage.image_url} alt="Fabric image" className='object-cover h-full aspect-square w-full rounded-md' width={624} height={624} />
                  </div>
                ))}
              </Slide>
            </div>

            <div className={`spacer w-full md:w-8 h-4`} />

            <div className='fabric-details w-full'>
              <table className="table-auto border border-collapse w-full text-left">
                <tbody>
                  {Object.entries(getFabricDetails(data)).map((field) => (
                    <tr key={field[0]} className="border-b even:bg-gray-50 odd:bg-white">
                      <th className="px-4 py-2 capitalize border-r">{field[0]}</th>
                      <td className="px-4 py-2">{field[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className='ratings my-16 w-full'>
                <div className='fabric-ironing px-4 flex space-between items-center'>
                  <div className='ironing-title text-xl lg:text-2xl w-32 lg:w-44'>
                    <span>Ironing</span>
                  </div>
                  <ReactStars count={5} size={30} value={data.ironing} edit={false} color2='#ffd700' isHalf={true} classNames="text-green-500" />
                </div>
                <div className='fabric-comfort px-4 flex space-between items-center'>
                  <div className='comfort-title text-xl lg:text-2xl w-32 lg:w-44'>
                    <span>Comfort</span>
                  </div>
                  <ReactStars count={5} size={30} value={data.comfort} edit={false} color2='#ffd700' isHalf={true} />
                </div>
              </div>
            </div>
          </div>
        </section>
        <DesignInspirations fabric_code={fabricCode} />
      </div>
    </main>
  )
}

export default Fabrics
