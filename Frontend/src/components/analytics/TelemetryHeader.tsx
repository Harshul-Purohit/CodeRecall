import React from 'react';
import { TrendingUp, Flame, Clock, Sparkles, Activity, Award } from 'lucide-react';
import { TelemetryOverview } from '../../types/analytics';

interface TelemetryHeaderProps {
  telemetry: TelemetryOverview;
  totalCards: number;
}

export const TelemetryHeader: React.FC<TelemetryHeaderProps> = ({ telemetry, totalCards }) => {
  return (
    <div className="w-full mb-8">
      {/* Top Banner / Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-[#C4BBF0]/15 text-[#C4BBF0] border border-[#927FBF]/40 flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-[#C4BBF0] animate-pulse" />
              TELEMETRY ENGINE V2.4
            </span>
            <span className="text-xs font-mono text-[#927FBF]">SM2-Monotonic Decay</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            Retention Telemetry Dashboard
          </h1>
          <p className="text-xs md:text-sm text-[#C4BBF0]/70 mt-1 max-w-2xl font-mono">
            Real-time visual monitoring of Ebbinghaus memory stability, revision streaks, and pattern mastery curves.
          </p>
        </div>

        {/* Real-time Sync Indicator Badge */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-[#4F3B78] border border-[#927FBF]/60 px-3.5 py-2 rounded-xl text-xs font-mono text-white shadow-lg">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C4BBF0] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C4BBF0]"></span>
          </span>
          <span className="text-[#C4BBF0] font-medium">Live SRS Telemetry</span>
          <span className="text-[#927FBF]">•</span>
          <span className="text-slate-300">Synced</span>
        </div>
      </div>

      {/* 4 Metric Callout Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Monotonic Retention Rate */}
        <div className="bg-[#4F3B78] border border-[#927FBF] rounded-xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-[#C4BBF0] transition-colors duration-200">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#C4BBF0]/5 rounded-full blur-xl group-hover:bg-[#C4BBF0]/10 transition-all"></div>
          <div className="flex items-center justify-between text-xs text-[#C4BBF0]/80 font-mono mb-2">
            <span>MONOTONIC RETENTION</span>
            <div className="p-1.5 rounded-lg bg-[#363B4E] border border-[#927FBF]/40 text-[#C4BBF0]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
              {telemetry.overallRetentionRate.toFixed(1)}%
            </span>
            <span className="text-xs font-medium text-emerald-400 font-mono">+1.4% this wk</span>
          </div>
          <p className="text-[11px] text-[#C4BBF0]/70 mt-2 font-mono">
            Optimized memory retention curve target &gt; 90%
          </p>
        </div>

        {/* Card 2: Due Today vs Total Backlog */}
        <div className="bg-[#4F3B78] border border-[#927FBF] rounded-xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-[#C4BBF0] transition-colors duration-200">
          <div className="flex items-center justify-between text-xs text-[#C4BBF0]/80 font-mono mb-2">
            <span>DUE vs BACKLOG</span>
            <div className="p-1.5 rounded-lg bg-[#363B4E] border border-[#927FBF]/40 text-[#F25912]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#C4BBF0] tracking-tight font-mono">
              {telemetry.dueTodayCount}
            </span>
            <span className="text-sm font-mono text-[#927FBF]">
              / {totalCards} total cards
            </span>
          </div>
          <div className="w-full bg-[#363B4E] h-1.5 rounded-full mt-3 overflow-hidden border border-[#927FBF]/40">
            <div
              className="bg-[#C4BBF0] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (telemetry.dueTodayCount / totalCards) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Card 3: Average Easiness Factor (EF) */}
        <div className="bg-[#4F3B78] border border-[#927FBF] rounded-xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-[#C4BBF0] transition-colors duration-200">
          <div className="flex items-center justify-between text-xs text-[#C4BBF0]/80 font-mono mb-2">
            <span>AVG EASINESS FACTOR</span>
            <div className="p-1.5 rounded-lg bg-[#363B4E] border border-[#927FBF]/40 text-[#C4BBF0]">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
              {telemetry.averageEasinessFactor.toFixed(2)}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#363B4E] text-[#C4BBF0] border border-[#927FBF]/40">
              SM2 Baseline 2.50
            </span>
          </div>
          <p className="text-[11px] text-[#C4BBF0]/70 mt-2 font-mono">
            Higher EF indicates easier recall & longer intervals
          </p>
        </div>

        {/* Card 4: Active Streak & Total Reviews */}
        <div className="bg-[#4F3B78] border border-[#927FBF] rounded-xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-[#C4BBF0] transition-colors duration-200">
          <div className="flex items-center justify-between text-xs text-[#C4BBF0]/80 font-mono mb-2">
            <span>REVISION TELEMETRY</span>
            <div className="p-1.5 rounded-lg bg-[#363B4E] border border-[#927FBF]/40 text-[#F25912]">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#C4BBF0] tracking-tight font-mono">
              {telemetry.currentStreak}
            </span>
            <span className="text-xs font-mono text-amber-300 font-semibold">
              days streak 🔥
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#C4BBF0]/80 font-mono mt-2 pt-2 border-t border-[#927FBF]/30">
            <span className="flex items-center gap-1">
              <Award className="w-3 h-3 text-[#C4BBF0]" />
              Best: {telemetry.longestStreak} days
            </span>
            <span>{telemetry.totalReviewsCompleted} revs total</span>
          </div>
        </div>
      </div>
    </div>
  );
};
