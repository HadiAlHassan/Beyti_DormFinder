"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

export function DashBoardHeader() {
  return (
    <div className="grid grid-cols-1 gap-4 px-2 sm:grid-cols-2 xl:grid-cols-4">
      {/* Total Rent Earned */}
      <Card>
        <CardHeader>
          <CardDescription>Total Rent Earned</CardDescription>
          {/*API Call to render this info here*/}
          <CardTitle className="text-2xl font-semibold tabular-nums">
            $12,500
          </CardTitle>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Across all properties this month
        </CardFooter>
      </Card>

      {/* Apartments Rented */}
      <Card>
        <CardHeader>
          <CardDescription>Apartments Rented</CardDescription>
          {/*API Call to render this info here*/}
          <CardTitle className="text-2xl font-semibold tabular-nums">
            8 / 10
          </CardTitle>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Occupancy rate: 80%
        </CardFooter>
      </Card>

      {/* Tenants Paid */}
      <Card>
        <CardHeader>
          <CardDescription>Tenants Paid</CardDescription>
          {/*API Call to render this info here*/}
          <CardTitle className="text-2xl font-semibold tabular-nums">
            6 / 8
          </CardTitle>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Payments confirmed for March
        </CardFooter>
      </Card>

      {/* Pending Payments */}
      <Card>
        <CardHeader>
          <CardDescription>Pending Payments</CardDescription>
          {/*API Call to render this info here*/}
          <CardTitle className="text-2xl font-semibold tabular-nums">
            2
          </CardTitle>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Awaiting confirmation
        </CardFooter>
      </Card>
    </div>
  );
}
