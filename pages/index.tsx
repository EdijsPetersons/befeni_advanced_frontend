import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <div className='flex justify-center'>
      <Head>
        <title>Befeni — frontend test</title>
        <meta name="description" content="Advanced frontend test for Befeni.com" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className=''>
        <h1 className='text-3xl'>
          Welcome to Befeni
        </h1>
        <div className='flex flex-col mt-16 space-y-8 text-blue-500 underline'>
          <Link href='/fabrics/10124'>
            <a className='hover:text-blue-900'>
              View fabrics example 124
            </a>
          </Link>
          <Link href='/fabrics/10022'>
            <a className='hover:text-blue-900'>
              View fabrics example 22
            </a>
          </Link>
          <Link href='/fabrics/30010'>
            <a className='hover:text-blue-900'>
              View fabrics example 30010
            </a>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Home
