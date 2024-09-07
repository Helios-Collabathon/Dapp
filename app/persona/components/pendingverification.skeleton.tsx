import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../features/controls/Table";
import { SkeletonText } from "@/app/features/controls/SkeletonText";

export default function PendingLinkedWalletTableSkeleton() {
  return (
    <div className="mt-20">
      <SkeletonText className="h-6 w-1/4 mb-4" />
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
                <SkeletonText className="h-8 w-20" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
