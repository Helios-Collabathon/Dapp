import { Wallet } from '@/repository/types'
import React from 'react'

const CusotmBadgeButton = ({ user }: { user: Wallet }) => {
  return (
    <div className="relative inline-block">
      <div className={`cursor-pointer rounded px-4 py-2 font-bold text-white ${user.verified ? 'bg-lime-500' : 'bg-red-500'}`}>
        {user.verified ? 'Verified' : 'Not Verified'}
      </div>

      {!user.verified && (
        <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-max -translate-x-1/2 transform whitespace-nowrap rounded-md bg-black px-3 py-2 text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          This user is not verified.
          <div className="absolute left-1/2 top-full -translate-x-1/2 transform border-8 border-transparent border-t-black"></div>
        </div>
      )}
    </div>
  )
}

export default CusotmBadgeButton
