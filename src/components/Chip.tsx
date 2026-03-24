import type { CSSObject } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';

export function Chip({
  selected,
  children,
  css,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
  css?: CSSObject;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      {...rest}
      css={{
        padding: '8px 16px',
        borderRadius: '20px',
        border: `1px solid ${selected ? colors.blue500 : colors.grey200}`,
        background: selected ? colors.blue50 : colors.grey50,
        color: selected ? colors.blue600 : colors.grey700,
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.15s',
        '&:hover': {
          borderColor: selected ? colors.blue500 : colors.grey400,
        },
        ...css,
      }}
    >
      {children}
    </button>
  );
}
