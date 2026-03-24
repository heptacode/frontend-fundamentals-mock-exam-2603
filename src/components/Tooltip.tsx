import type { CSSObject } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';

export function Tooltip({
  css,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { css?: CSSObject; children?: React.ReactNode }) {
  return (
    <div
      role="tooltip"
      {...rest}
      css={{
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginTop: '6px',
        background: colors.grey900,
        color: colors.white,
        padding: '8px 12px',
        borderRadius: '8px',
        fontSize: '12px',
        whiteSpace: 'nowrap',
        zIndex: 10,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
        lineHeight: '1.6',
        ...css,
      }}
    >
      {children}
    </div>
  );
}
