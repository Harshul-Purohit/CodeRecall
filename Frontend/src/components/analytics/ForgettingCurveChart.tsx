import React, { useState } from 'react';
import { LineChart, ShieldCheck, Zap, Info, Layers } from 'lucide-react';
import { ProblemCardData } from '../../types/problem';
import { calculateForgettingCurvePoints } from '../../utils/analyticsUtils';

interface ForgettingCurveChartProps {
  cards: ProblemCardData[];
}

export const ForgettingCurveChart: React.FC<ForgettingCurveChartProps> = ({ cards }) => {
  const [selectedCurve, setSelectedCurve] = useState<'activeQueue' | 'initial' | 'firstReview' | 'secondReview' | 'mastered' | 'all'>('all');
  const [hoveredPoint, setHoveredPoint] = useState<{
    day: number;
    retention: number;
    x: number;
    y: number;
    stage: string;
  } | null>(null);

  const { timePoints, curves, queueStability } = calculateForgettingCurvePoints(cards);

  // SVG dimensions & padding setup
  const width = 640;
  const height = 280;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Map values to pixel coordinates
  const getX = (day: number) => paddingLeft + (day / 30) * chartWidth;
  const getY = (retention: number) => paddingTop + chartHeight - (retention / 100) * chartHeight;

  // Helper to generate SVG path string d from points array
  const generateSvgPath = (pointValues: number[]) => {
    return pointValues
      .map((ret, idx) => {
        const x = getX(timePoints[idx]);
        const y = getY(ret);
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  };

  // Target threshold line y (85% retention)
  const targetThresholdY = getY(85);

  return (
    <div className="bg-[#4F3B78] border border-[#927FBF] rounded-xl p-5 shadow-xl mb-8">
      {/* Header with Title & Formula */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#927FBF]/30 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <LineChart className="w-5 h-5 text-[#C4BBF0]" />
              Ebbinghaus Forgetting Curve & Stability
            </h2>
            <span className="text-xs px-2 py-0.5 rounded bg-[#363B4E] border border-[#927FBF]/50 text-[#C4BBF0] font-mono">
              R = e^(-t/S)
            </span>
          </div>
          <p className="text-xs font-mono text-[#C4BBF0]/80 mt-0.5">
            Monotonic memory stabilization curve flattens with each successful SM2 review cycle.
          </p>
        </div>

        {/* Stability Callout Badge */}
        <div className="flex items-center gap-2 bg-[#363B4E] border border-[#927FBF]/50 px-3.5 py-1.5 rounded-lg text-xs font-mono text-white">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            Queue Memory Stability (S): <strong className="text-[#C4BBF0]">{queueStability} days</strong>
          </span>
        </div>
      </div>

      {/* Curve Selector Pills */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 text-xs font-mono select-none">
        <span className="text-[#C4BBF0]/70 flex items-center gap-1 mr-1">
          <Layers className="w-3.5 h-3.5 text-[#927FBF]" />
          View Curve:
        </span>
        <button
          onClick={() => setSelectedCurve('all')}
          className={`px-3 py-1 rounded-md transition-all ${
            selectedCurve === 'all'
              ? 'bg-[#C4BBF0] text-[#363B4E] font-bold border border-white'
              : 'bg-[#363B4E] text-slate-300 border border-[#927FBF]/40 hover:border-[#927FBF]'
          }`}
        >
          All Stages Comparison
        </button>
        <button
          onClick={() => setSelectedCurve('activeQueue')}
          className={`px-3 py-1 rounded-md transition-all ${
            selectedCurve === 'activeQueue'
              ? 'bg-[#C4BBF0] text-[#363B4E] font-bold border border-white'
              : 'bg-[#363B4E] text-[#C4BBF0] border border-[#927FBF]/40 hover:border-[#927FBF]'
          }`}
        >
          Current Active Queue (S={queueStability}d)
        </button>
        <button
          onClick={() => setSelectedCurve('mastered')}
          className={`px-3 py-1 rounded-md transition-all ${
            selectedCurve === 'mastered'
              ? 'bg-emerald-400 text-[#363B4E] font-bold border border-white'
              : 'bg-[#363B4E] text-emerald-300 border border-[#927FBF]/40 hover:border-[#927FBF]'
          }`}
        >
          Mastered (S=45d)
        </button>
      </div>

      {/* Interactive SVG Chart Canvas */}
      <div className="relative w-full overflow-x-auto">
        <div className="min-w-[600px] flex justify-center">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[720px] h-auto overflow-visible">
            {/* Defs for Glow Filter */}
            <defs>
              <filter id="glow-lavender" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Horizontal Grid Lines & Y-Axis Labels styled with low opacity #927FBF */}
            {[0, 25, 50, 75, 85, 100].map((val) => {
              const y = getY(val);
              const isThreshold = val === 85;

              return (
                <g key={`y-grid-${val}`}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke={isThreshold ? '#F25912' : '#927FBF'}
                    strokeOpacity={isThreshold ? 0.6 : 0.25}
                    strokeDasharray={isThreshold ? '4 4' : undefined}
                    strokeWidth={isThreshold ? 1.5 : 1}
                  />
                  <text
                    x={paddingLeft - 8}
                    y={y + 4}
                    fill={isThreshold ? '#F25912' : '#927FBF'}
                    fontSize="10"
                    fontFamily="monospace"
                    textAnchor="end"
                    fontWeight={isThreshold ? 'bold' : 'normal'}
                  >
                    {val}%
                  </text>
                </g>
              );
            })}

            {/* Target 85% Retention Recalibration Label */}
            <text
              x={width - paddingRight}
              y={targetThresholdY - 6}
              fill="#F25912"
              fontSize="9"
              fontFamily="monospace"
              textAnchor="end"
              fontWeight="bold"
            >
              85% Target Review Threshold
            </text>

            {/* Vertical Grid Lines & X-Axis Labels */}
            {[0, 5, 10, 15, 20, 25, 30].map((day) => {
              const x = getX(day);
              return (
                <g key={`x-grid-${day}`}>
                  <line
                    x1={x}
                    y1={paddingTop}
                    x2={x}
                    y2={height - paddingBottom}
                    stroke="#927FBF"
                    strokeOpacity="0.25"
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={height - paddingBottom + 16}
                    fill="#927FBF"
                    fontSize="10"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {day}d
                  </text>
                </g>
              );
            })}

            {/* Comparative Lines */}
            {(selectedCurve === 'all' || selectedCurve === 'initial') && (
              <path
                d={generateSvgPath(curves.initial)}
                fill="none"
                stroke="#EF4444"
                strokeWidth="1.5"
                strokeOpacity="0.5"
                strokeDasharray="3 3"
              />
            )}

            {(selectedCurve === 'all' || selectedCurve === 'firstReview') && (
              <path
                d={generateSvgPath(curves.firstReview)}
                fill="none"
                stroke="#EAB308"
                strokeWidth="1.5"
                strokeOpacity="0.6"
              />
            )}

            {(selectedCurve === 'all' || selectedCurve === 'secondReview') && (
              <path
                d={generateSvgPath(curves.secondReview)}
                fill="none"
                stroke="#7A67A8"
                strokeWidth="2"
                strokeOpacity="0.8"
              />
            )}

            {(selectedCurve === 'all' || selectedCurve === 'mastered') && (
              <path
                d={generateSvgPath(curves.mastered)}
                fill="none"
                stroke="#22C55E"
                strokeWidth="2.5"
                strokeOpacity="0.9"
              />
            )}

            {/* Active Retention Main Line plotted in #C4BBF0 strictly matching spec */}
            {(selectedCurve === 'all' || selectedCurve === 'activeQueue') && (
              <>
                {/* Area Gradient Fill under active line */}
                <path
                  d={`${generateSvgPath(curves.activeQueue)} L ${getX(30)} ${getY(0)} L ${getX(0)} ${getY(0)} Z`}
                  fill="#C4BBF0"
                  fillOpacity="0.12"
                />
                <path
                  d={generateSvgPath(curves.activeQueue)}
                  fill="none"
                  stroke="#C4BBF0"
                  strokeWidth="3.5"
                  filter="url(#glow-lavender)"
                />

                {/* Plot Data Dots along the active curve */}
                {curves.activeQueue.map((ret, idx) => {
                  const day = timePoints[idx];
                  const cx = getX(day);
                  const cy = getY(ret);

                  return (
                    <circle
                      key={`dot-${day}`}
                      cx={cx}
                      cy={cy}
                      r="4.5"
                      fill="#C4BBF0"
                      stroke="#363B4E"
                      strokeWidth="2"
                      className="cursor-pointer hover:r-6 transition-all"
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredPoint({
                          day,
                          retention: ret,
                          x: rect.left + rect.width / 2,
                          y: rect.top - 8,
                          stage: `Current Queue (S=${queueStability}d)`
                        });
                      }}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  );
                })}
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Hover Tooltip Popup */}
      {hoveredPoint && (
        <div
          className="fixed z-50 transform -translate-x-1/2 -translate-y-full bg-[#363B4E] border border-[#C4BBF0] text-white text-xs font-mono px-3 py-1.5 rounded-lg shadow-2xl pointer-events-none flex items-center gap-2"
          style={{ top: `${hoveredPoint.y}px`, left: `${hoveredPoint.x}px` }}
        >
          <Zap className="w-3.5 h-3.5 text-[#C4BBF0]" />
          <span>
            Day {hoveredPoint.day}: <strong>{hoveredPoint.retention}% retention</strong> ({hoveredPoint.stage})
          </span>
        </div>
      )}

      {/* Legend & Takeaway Footnote */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#C4BBF0]/80 pt-4 border-t border-[#927FBF]/30 mt-2">
        <div className="flex items-center gap-4 flex-wrap text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#C4BBF0] rounded-full"></span>
            <span>Active Queue (S={queueStability}d)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-emerald-400 rounded-full"></span>
            <span>Mastered (S=45d)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-amber-400 rounded-full"></span>
            <span>1st Review (S=6d)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-red-400 rounded-full"></span>
            <span>Initial (S=2d)</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-[#C4BBF0]/70">
          <Info className="w-3.5 h-3.5 text-[#927FBF]" />
          <span>Monotonic stabilization flattens decay slope</span>
        </div>
      </div>
    </div>
  );
};
