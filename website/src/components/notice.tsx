export const Notice = () => (
  <div className="flex w-full items-center justify-center py-3 text-center text-base lg:text-xl">
    <p className="w-full lg:w-3/4">
      NOTE: This site was an alpha app that allowed users to bridge Hemi to
      Binance Smart chain post TGE. There are now official providers, such as{" "}
      <a
        className="text-orange-500 hover:text-orange-700"
        href="https://stargate.finance/"
        rel="noopener noreferrer"
        target="_blank"
      >
        Stargate
      </a>{" "}
      (See this{" "}
      <a
        className="text-orange-500 hover:text-orange-700"
        href="https://x.com/hemi_xyz/status/1962945758006550876"
        rel="noopener noreferrer"
        target="_blank"
      >
        official announcement tweet
      </a>
      ) , and it's recommended you use those instead of this app. This app is
      kept for historical reasons only. It may work, but is no longer
      maintained. Use it under your own risk.
    </p>
  </div>
);
