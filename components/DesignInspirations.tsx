import Image from 'next/image';
import { useQuery } from '@tanstack/react-query'

type DesignInspiration = {
  fabric_code: string | string[] | undefined
}

type InspirationImageData = {
  variant: number,
  size: string,
  image_url: string,
}

type InspirationDetails = {
  id: number,
  shirt_title: string,
  fabric_composition_label: string,
  image_variants: InspirationImageData[],
}

type InspirationData = {
  status: string,
  data: {
    collection: [InspirationDetails]
  }
}

const getDesignInspirations = async (fabricCode: string | string[] | undefined) : Promise<InspirationData> => {
  return typeof fabricCode === 'undefined'
    ? Promise.reject(new Error('Invalid fabric code!'))
    : fetch(`/api/galery/${fabricCode}`).then(res => res.json());
}

const DesignInspirations = ({ fabric_code }: DesignInspiration) => {
  const { data, error, isLoading, isError } = useQuery<InspirationData, Error>(['getDesignInspirations', fabric_code], () => getDesignInspirations(fabric_code))
  if (isLoading) {
    return <div>Loading inspirations...</div>
  }

  if (isError) {
    return <div>erra inspirations...</div>
  }

  console.log(data);
  
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 my-8 gap-8'>
      {data.data.collection.map((item, index) => (
        <div key={item.id} className="w-full text-center">
          <Image src={item.image_variants.find(variant => variant.size === 'mobile')!.image_url} alt="design inspiration" className='rounded-md' width={448} height={477}/>
          <p className='mt-4 text-xl font-semibold'>{item.shirt_title}</p>
          <p className='mt-2'>{item.fabric_composition_label}</p>
          <button className='px-10 py-3.5 bg-slate-200 hover:bg-slate-300 rounded-full mt-4 text-slate-700'>Buy shirt</button>
        </div>
      ))}
    </div>
  )
}

export default DesignInspirations