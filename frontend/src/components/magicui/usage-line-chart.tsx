'use client';

import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { month: 'January', Users: 105 },
  { month: 'February', Users: 174 },
  { month: 'March', Users: 134 },
  { month: 'April', Users: 104 },
  { month: 'May', Users: 192 },
  { month: 'June', Users: 230 },
];

const chartConfig = {
  Users: {
    label: 'Users',
  },
} satisfies ChartConfig;

export function UsageLineChart() {
  return (
    <ChartContainer config={chartConfig}>
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{ left: 12, right: 12 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              className="text-teal-700 dark:text-teal-400"
              hideLabel
            />
          }
        />
        <Line
          dataKey="Users"
          type="natural"
          stroke="currentColor"
          strokeWidth={2}
          className="text-teal-800 dark:text-teal-400"
          dot={{ className: 'fill-teal-700 dark:fill-teal-500' }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
