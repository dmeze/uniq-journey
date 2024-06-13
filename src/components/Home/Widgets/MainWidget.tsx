'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

const MainWidget = () => {
  const router = useRouter()
  return (
    <div className="relative h-screen-wo-header">
      <Image
        src="https://3uxukexibnvkkn2h.public.blob.vercel-storage.com/images/home-nRQlxvL8pSxb6s8fU12GdcIYzsajUH.png"
        alt="Home"
        priority
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bottom-40 left-4 flex items-center justify-center">
        <button
          type="submit"
          onClick={() => router.push('/catalog')}
          className="rounded-2xl border-4 border-white-yellow px-4 py-2 text-2xl transition-all duration-300 hover:bg-white-yellow"
        >
          Explore catalog
        </button>
      </div>
    </div>
  )
}

export default MainWidget
