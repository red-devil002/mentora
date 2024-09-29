import { HomeNavbar } from '@/components/HomeNavbar'
import React from 'react'
import HomePage from './_components/HomePage'

export default function page() {
  return (
    <div>
      <div className="w-full">
        <HomeNavbar />
        <HomePage />
      </div>
    </div>
  )
}
