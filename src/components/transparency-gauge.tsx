'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface TransparencyGaugeProps {
  score: number;
}

export function TransparencyGauge({ score }: TransparencyGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const animation = requestAnimationFrame(() => {
        setDisplayScore(score);
    });
    return () => cancelAnimationFrame(animation);
  }, [score]);

  const radius = 60;
  const strokeWidth = 12;
  const innerRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * innerRadius;
  const offset = circumference - (displayScore / 100) * circumference;

  const scoreColor =
    score < 40
      ? 'text-red-600'
      : score < 70
      ? 'text-yellow-600'
      : 'text-green-600';

  return (
    <div className="relative flex items-center justify-center" style={{ width: radius * 2, height: radius * 2 }}>
      <svg className="absolute w-full h-full transform -rotate-90" viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
        <circle
          className="text-gray-200 dark:text-gray-700"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={innerRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className={cn('transition-all duration-1000 ease-out', scoreColor)}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={innerRadius}
          cx={radius}
          cy={radius}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <span className={cn('text-4xl font-bold', scoreColor)}>
        {Math.round(displayScore)}
      </span>
    </div>
  );
}
