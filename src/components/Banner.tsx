import type { CSSObject } from '@emotion/react';
import { Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

export function Banner({
  variant,
  css,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  variant: 'success' | 'error';
  css?: CSSObject;
  children?: React.ReactNode;
}) {
  return (
    <div css={{ padding: '0 24px' }}>
      <div
        {...rest}
        css={{
          padding: '10px 14px',
          borderRadius: '10px',
          background: variant === 'success' ? colors.blue50 : colors.red50,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          ...css,
        }}
      >
        <Text typography="t7" fontWeight="medium" color={variant === 'success' ? colors.blue600 : colors.red500}>
          {children}
        </Text>
      </div>
      <Spacing size={12} />
    </div>
  );
}
