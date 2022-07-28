import { useRouter } from 'next/router'

import fabricApiWrapper from '../lib/befeni-fabric-api-wrapper'

const Fabrics = () => {
  const router = useRouter()
  const { fabric_code } = router.query

  return <p>Fabrics: { fabric_code } </p>
}

export default Fabrics
