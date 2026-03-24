export function Flex({ children, ...css }: React.CSSProperties & { children?: React.ReactNode }) {
  return <div css={{ display: 'flex', ...css }}>{children}</div>;
}
