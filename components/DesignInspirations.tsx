import Image from 'next/future/image';
import { useQuery } from '@tanstack/react-query'
import { ClipLoader } from 'react-spinners';

import useBefeniClient from '../contexts/befeniContext'

type DesignInspiration = {
  fabric_code: string
}

type InspirationImageData = {
  variant: number,
  size: string,
  image_url: string,
}

type InspirationData = {
  id: number,
  shirt_title: string,
  fabric_composition_label: string,
  shirtImages: InspirationImageData[],
}

const getDesignInspirations = async (fabricCode: string, client: any) : Promise<InspirationData[]> => {
  if (typeof fabricCode === 'undefined') {
    return Promise.reject(new Error('Invalid fabric code!'))
  }

  const filters = {
		fabricIds: [fabricCode],
		familyIds: [],
		contrastFamilyIds: [],
		patterns: [],
		types: [],
		weaves: [],
		compositionIds: [],
		designs: [],
		collarStyles: [],
		cuffStyles: [],
		myShirtOnly: false,
		sotwOnly: false
	};

	const shirts = await client.getShirtGalleryShirts(filters, 'gallery_added_date', 'desc');

	const shirtValues = shirts.getValues();

  console.log(shirtValues );
  
  
  return shirtValues
}

const DesignInspirations = ({ fabric_code }: DesignInspiration) => {
  const client = useBefeniClient()

  const { data, error, isLoading, isError } = useQuery<InspirationData[], Error>(['getDesignInspirations', fabric_code], () => getDesignInspirations(fabric_code, client))
  
  if (isLoading) { 
    return (
      <div className='flex justify-center my-16'>
        <ClipLoader />
      </div>
    )
  }

  if (isError) {
    return (
      <div className='flex justify-center my-24 text-red-500 text-2xl'>
        <p className='max-w-2xl'>⚠ {error.message}</p>
      </div>
    )
  }
  
  return (
    <section className='desgin-inspirations' id="desgin-inspirations">
      <hr className='mb-8 lg:mt-8'/>
      <h2 className='text-2xl text-center'>Design Inspirations</h2> 
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 my-8 gap-8'>
        {data.map((item, index) => (
          <div key={item.id} className="w-full text-center">
            <Image src={item.shirtImages.find(variant => variant.size === 'mobile')!.image_url} alt={item.shirt_title} className='rounded-md' width={448} height={477}/>
            <p className='mt-4 text-xl font-semibold'>{item.shirt_title}</p>
            <p className='mt-2'>{item.fabric_composition_label}</p>
            <button className='px-10 py-3.5 bg-slate-200 hover:bg-slate-300 rounded-full mt-4 text-slate-700'>Buy shirt</button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default DesignInspirations