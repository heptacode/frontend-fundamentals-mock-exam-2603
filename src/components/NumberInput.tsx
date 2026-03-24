import type { CSSObject } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';

export function NumberInput({
  css,
  children,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { css?: CSSObject; children?: React.ReactNode }) {
  return (
    <input
      type="number"
      {...rest}
      css={{
        boxSizing: 'border-box',
        fontSize: '16px',
        fontWeight: '500',
        lineHeight: '1.5',
        height: '48px',
        backgroundColor: colors.grey50,
        borderRadius: '12px',
        color: colors.grey800,
        width: '100%',
        border: `1px solid ${colors.grey200}`,
        padding: '0 16px',
        outline: 'none',
        transition: 'border-color 0.15s',
        '&:focus': {
          borderColor: colors.blue500,
        },
        ...css,
      }}
    />
  );
}
