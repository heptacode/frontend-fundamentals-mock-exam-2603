import { createContext, useContext } from 'react';
import { css } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';
import { Text } from '_tosslib/components';
import { TIME_SLOTS } from 'utils/constants';

const HOUR_LABELS = TIME_SLOTS.filter(t => t.endsWith(':00'));

const TimelineContext = createContext<{ start: number; totalMinutes: number }>({ start: 0, totalMinutes: 0 });

export function Root({ start, end, children }: { start: number; end: number; children: React.ReactNode }) {
  const totalMinutes = (end - start) * 60;

  return (
    <TimelineContext.Provider value={{ start, totalMinutes }}>
      <div
        css={css`
          background: ${colors.grey50};
          border-radius: 14px;
          padding: 16px;
        `}
      >
        {children}
      </div>
    </TimelineContext.Provider>
  );
}

export function Header() {
  const { start, totalMinutes } = useContext(TimelineContext);

  return (
    <div
      css={css`
        display: flex;
        align-items: flex-end;
        margin-bottom: 8px;
      `}
    >
      <div
        css={css`
          width: 80px;
          flex-shrink: 0;
          padding-right: 8px;
        `}
      />
      <div
        css={css`
          flex: 1;
          position: relative;
          height: 18px;
        `}
      >
        {HOUR_LABELS.map(t => {
          const left = (timeToMinutes(t, start) / totalMinutes) * 100;
          return (
            <Text
              key={t}
              typography="t7"
              fontWeight="regular"
              color={colors.grey400}
              css={css`
                position: absolute;
                left: ${left}%;
                transform: translateX(-50%);
                font-size: 10px;
                letter-spacing: -0.3px;
              `}
            >
              {t.slice(0, 2)}
            </Text>
          );
        })}
      </div>
    </div>
  );
}

export function Row({ index, label, children }: { index: number; label: string; children: React.ReactNode }) {
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        height: 32px;
        ${index > 0 ? 'margin-top: 4px;' : ''}
      `}
    >
      <div
        css={css`
          width: 80px;
          flex-shrink: 0;
          padding-right: 8px;
        `}
      >
        <Text
          typography="t7"
          fontWeight="medium"
          color={colors.grey700}
          ellipsisAfterLines={1}
          css={css`
            font-size: 12px;
          `}
        >
          {label}
        </Text>
      </div>
      <div
        css={css`
          flex: 1;
          height: 24px;
          background: ${colors.white};
          border-radius: 6px;
          position: relative;
          overflow: visible;
        `}
      >
        {children}
      </div>
    </div>
  );
}

export function Block({
  isActive,
  start,
  end,
  children,
  ...props
}: {
  isActive: boolean;
  start: string;
  end: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { start: timelineStart, totalMinutes } = useContext(TimelineContext);
  const left = (timeToMinutes(start, timelineStart) / totalMinutes) * 100;
  const width = ((timeToMinutes(end, timelineStart) - timeToMinutes(start, timelineStart)) / totalMinutes) * 100;

  return (
    <div
      css={css`
        position: absolute;
        left: ${left}%;
        width: ${width}%;
        height: 100%;
      `}
    >
      <div
        role="button"
        css={css`
          width: 100%;
          height: 100%;
          background: ${colors.blue400};
          border-radius: 4px;
          opacity: ${isActive ? 1 : 0.75};
          cursor: pointer;
          transition: opacity 0.15s;
          &:hover {
            opacity: 1;
          }
        `}
        {...props}
      />
      {children}
    </div>
  );
}

function timeToMinutes(time: string, start: number): number {
  const [h, m] = time.split(':').map(Number);
  return (h - start) * 60 + m;
}
