import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../features/controls/Table'
import { SkeletonText } from '@/app/features/controls/SkeletonText'
import { SkeletonButton } from '@/app/features/controls/SkeletonButton'

export default function LinkedWalletTableSkeleton() {
  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>
              <SkeletonText className="h-4 w-full" />
            </TableHeader>
            <TableHeader>
              <SkeletonText className="h-4 w-full" />
            </TableHeader>
            <TableHeader>
              <SkeletonText className="h-4 w-full" />
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: 3 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <SkeletonText className="h-4 w-full" />
              </TableCell>
              <TableCell>
                <SkeletonText className="h-4 w-full" />
              </TableCell>
              <TableCell>
                <SkeletonText className="h-4 w-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
