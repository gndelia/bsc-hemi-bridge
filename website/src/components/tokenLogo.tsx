import { Token } from "types/token";

const sizes = {
  medium: "size-8",
  small: "size-5",
} as const;

type Size = keyof typeof sizes;

type Props = {
  size: Size;
  token: Token;
  version?: "default" | "L1";
};

// for hemi tokens, we add a hemi logo at the bottom right
export function TokenLogo({ size, token, version = "default" }: Props) {
  const logoURI =
    version === "L1" && token.extensions?.l1LogoURI
      ? token.extensions.l1LogoURI
      : token.logoURI;

  return (
    <div className={`${sizes[size]}`}>
      <img
        alt={`${token.symbol} Logo`}
        className="w-full"
        height={20}
        src={logoURI}
        width={20}
      />
    </div>
  );
}
