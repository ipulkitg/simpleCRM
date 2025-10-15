import { useId } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';

const KpiSparkline = ({ data, color, valueFormatter }) => {
  const gradientId = useId();

  if (!data?.length) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-xs font-medium text-slate-400">
        No trend yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 6, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="90%" stopColor={color} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <Tooltip
          cursor={false}
          formatter={(value) => [valueFormatter(value), '']}
          labelFormatter={(label) => label}
          contentStyle={{
            borderRadius: 12,
            borderColor: '#E2E8F0',
            fontSize: 12,
            color: '#0F172A',
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2.5}
          fill={`url(#${gradientId})`}
          dot={{ r: 2 }}
          activeDot={{ r: 4 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

KpiSparkline.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, value: PropTypes.number })).isRequired,
  color: PropTypes.string,
  valueFormatter: PropTypes.func,
};

KpiSparkline.defaultProps = {
  color: '#3B82F6',
  valueFormatter: (value) => value,
};

export default KpiSparkline;
