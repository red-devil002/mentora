import Image from 'next/image'
import React from 'react'

export const Logo = () => {
  return (
    <div>
        <Image
            height={130}
            width={130}
            alt = "logo"
            src = "/logo/logo.svg"
        />
    </div>
  )
}
