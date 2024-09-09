import React from 'react'
import classNames from 'classnames'

interface SkeletonButtonProps {
  className?: string
  width?: string
  height?: string
}

export const SkeletonButton: React.FC<SkeletonButtonProps> = ({ className, width = '100px', height = '2.5em' }) => {
  return <div className={classNames('animate-pulse rounded-md bg-gray-300', className)} style={{ width, height }}></div>
}
