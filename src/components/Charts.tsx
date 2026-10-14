import React, { useState } from 'react';

// Custom lightweight SVG Donut Chart
interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({ data, size = 220 }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const total = data.reduce((acc, item) => acc + item.value, 0);

  if (total === 0) {
    return <div className="text-slate-500 text-sm py-10 text-center">No data available</div>;
  }

  const radius = 70;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;
  let accumulatedAngle = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
          {data.map((item, idx) => {
            const strokeDasharray = `${(item.value / total) * circumference} ${circumference}`;
            const strokeDashoffset = -accumulatedAngle;
            accumulatedAngle += (item.value / total) * circumference;
            const isHovered = hoveredIdx === idx;

            return (
              <circle
                key={item.label}
                cx="100"
                cy="100"
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer opacity-90 hover:opacity-100"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {hoveredIdx !== null ? (
            <>
              <span className="text-2xl font-extrabold text-white">
                {data[hoveredIdx].value}
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: data[hoveredIdx].color }}>
                {data[hoveredIdx].label}
              </span>
              <span className="text-[10px] text-slate-400">
                {Math.round((data[hoveredIdx].value / total) * 100)}%
              </span>
            </>
          ) : (
            <>
              <span className="text-3xl font-extrabold text-white">{total}</span>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total Herd</span>
            </>
          )}
        </div>
      </div>

      {/* Legend list */}
      <div className="space-y-3 min-w-[140px]">
        {data.map((item, idx) => (
          <div
            key={item.label}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className={`flex items-center justify-between gap-3 p-2 rounded-xl transition-all cursor-pointer ${
              hoveredIdx === idx ? 'bg-white/10 scale-105' : 'hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
              <span className="text-sm font-medium text-slate-300">{item.label}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-white">{item.value}</span>
              <span className="text-xs text-slate-500 ml-1.5">({Math.round((item.value / total) * 100)}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Custom interactive SVG Line Chart
interface LineChartProps {
  data: number[];
  labels: string[];
  baseline?: number;
  minY?: number;
  maxY?: number;
  valueSuffix?: string;
  lineColor?: string;
  fillColor?: string;
  height?: number;
}

export const SmoothLineChart: React.FC<LineChartProps> = ({
  data,
  labels,
  baseline = 101.5,
  minY,
  maxY,
  valueSuffix = '°F',
  lineColor = '#6366f1',
  fillColor = 'rgba(99, 102, 241, 0.15)',
  height = 240
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return <div className="text-slate-500 text-sm py-12 text-center">No telemetry readings</div>;
  }

  const computedMin = minY !== undefined ? minY : Math.floor(Math.min(...data, baseline) - 0.5);
  const computedMax = maxY !== undefined ? maxY : Math.ceil(Math.max(...data, baseline) + 0.5);
  const range = computedMax - computedMin || 1;

  const width = 600;
  const paddingX = 40;
  const paddingY = 30;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Calculate points
  const points = data.map((val, idx) => {
    const x = paddingX + (idx / (data.length - 1)) * chartWidth;
    const y = paddingY + chartHeight - ((val - computedMin) / range) * chartHeight;
    return { x, y, val, label: labels[idx] || `Pt ${idx + 1}` };
  });

  const baselineY = paddingY + chartHeight - ((baseline - computedMin) / range) * chartHeight;

  // SVG path generation
  const pathD = points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[i - 1];
    const cpX = (prev.x + pt.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${pt.y}, ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingY + chartHeight} L ${points[0].x} ${paddingY + chartHeight} Z`;

  // Horizontal guide lines (4 lines)
  const ticks = [0, 0.33, 0.66, 1].map((pct) => {
    const val = (computedMin + pct * range).toFixed(1);
    const y = paddingY + chartHeight - pct * chartHeight;
    return { val, y };
  });

  return (
    <div className="relative w-full overflow-hidden select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        style={{ maxHeight: height }}
      >
        <defs>
          <linearGradient id={`gradient-${lineColor}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.35" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal gridlines and Y-axis text */}
        {ticks.map((tick, i) => (
          <g key={i}>
            <line
              x1={paddingX}
              y1={tick.y}
              x2={width - paddingX}
              y2={tick.y}
              stroke="rgba(35, 78, 56, 0.12)"
              strokeDasharray="4 4"
            />
            <text
              x={paddingX - 8}
              y={tick.y + 4}
              textAnchor="end"
              fill="#6c7b70"
              fontSize="10"
              fontFamily="monospace"
            >
              {tick.val}{valueSuffix}
            </text>
          </g>
        ))}

        {/* Normal Baseline Dashed Line */}
        {baseline !== undefined && (
          <g>
            <line
              x1={paddingX}
              y1={baselineY}
              x2={width - paddingX}
              y2={baselineY}
              stroke="#234e38"
              strokeDasharray="5 4"
              strokeWidth="1.5"
              strokeOpacity="0.8"
            />
            <text
              x={width - paddingX + 6}
              y={baselineY + 3}
              fill="#234e38"
              fontSize="9"
              fontWeight="bold"
            >
              Base ({baseline}{valueSuffix})
            </text>
          </g>
        )}

        {/* Filled gradient area */}
        <path d={areaD} fill={`url(#gradient-${lineColor})`} />

        {/* Line curve */}
        <path d={pathD} fill="none" stroke={lineColor} strokeWidth="3" strokeLinecap="round" />

        {/* Data points */}
        {points.map((pt, i) => {
          const isFever = pt.val >= (valueSuffix.includes('C') ? 39.8 : 103.5);
          const isHovered = hoveredIndex === i;
          return (
            <g
              key={i}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 6 : isFever ? 4.5 : 3.5}
                fill={isFever ? '#dc2626' : lineColor}
                stroke="#fbf8f2"
                strokeWidth={2}
                className="transition-all duration-150"
              />
              <circle cx={pt.x} cy={pt.y} r={16} fill="transparent" />
            </g>
          );
        })}

        {/* X axis labels */}
        {points.map((pt, i) => (
          (points.length <= 12 || i % Math.ceil(points.length / 8) === 0) && (
            <text
              key={i}
              x={pt.x}
              y={height - 6}
              textAnchor="middle"
              fill="#6c7b70"
              fontSize="10"
              fontWeight="500"
            >
              {pt.label}
            </text>
          )
        ))}
      </svg>

      {/* Hover Tooltip Box */}
      {hoveredIndex !== null && (
        <div
          className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full bg-slate-900 border border-indigo-500/40 shadow-xl px-3 py-1.5 rounded-lg text-xs"
          style={{
            left: `${(points[hoveredIndex].x / width) * 100}%`,
            top: `${(points[hoveredIndex].y / height) * 100}%`,
            marginTop: '-12px'
          }}
        >
          <div className="font-semibold text-slate-300">{points[hoveredIndex].label}</div>
          <div className="text-sm font-bold text-indigo-400">
            {points[hoveredIndex].val.toFixed(1)}{valueSuffix}
          </div>
          {baseline && (
            <div className={`text-[10px] ${points[hoveredIndex].val > baseline ? 'text-rose-400' : 'text-emerald-400'}`}>
              {points[hoveredIndex].val > baseline ? '+' : ''}
              {(points[hoveredIndex].val - baseline).toFixed(1)}{valueSuffix} vs base
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Activity Bar Chart
interface BarChartProps {
  data: { label: string; count: number; color: string }[];
}

export const StatusBarChart: React.FC<BarChartProps> = ({ data }) => {
  const max = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="space-y-4 py-2">
      {data.map((item) => {
        const percentage = Math.round((item.count / max) * 100);
        return (
          <div key={item.label} className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-300">{item.label}</span>
              <span className="font-bold text-white">{item.count} animals</span>
            </div>
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(percentage, 6)}%`, backgroundColor: item.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
