import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { WeightEntry } from "@/services/weightApi";
import { format, parseISO } from "date-fns";

interface WeightChartProps {
  entries: WeightEntry[];
}

const WeightChart = ({ entries }: WeightChartProps) => {
  const chartData = [...entries]
    .reverse()
    .map(entry => ({
      date: format(parseISO(entry.date), "dd"),
      weight: entry.weight.value,
      fullDate: format(parseISO(entry.date), "MMM dd"),
    }));

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(230, 80%, 60%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(230, 80%, 60%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 12 }}
            dy={10}
          />
          <YAxis
            domain={['dataMin - 1', 'dataMax + 1']}
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 12 }}
            tickFormatter={(value) => `${value.toFixed(2)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(220, 18%, 10%)',
              border: '1px solid hsl(220, 15%, 20%)',
              borderRadius: '8px',
              color: 'hsl(0, 0%, 98%)',
            }}
            labelFormatter={(_, payload) => payload[0]?.payload?.fullDate || ''}
            formatter={(value: number) => [`${value.toFixed(2)} kg`, 'Weight']}
          />
          <Area
            type="monotone"
            dataKey="weight"
            stroke="hsl(230, 80%, 60%)"
            strokeWidth={2}
            fill="url(#weightGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightChart;
