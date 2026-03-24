import { css } from '@emotion/react';
import { Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

interface SectionProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}

export function Section({ title, subtitle, children }: SectionProps) {
  return (
    <section
      css={css`
        padding: 0 24px;
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: baseline;
          gap: 6px;
        `}
      >
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          {title}
        </Text>
        {subtitle}
      </div>
      <Spacing size={16} />
      {children}
    </section>
  );
}
