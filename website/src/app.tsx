import { Bridge } from "components/bridge";
import { HeartIcon } from "components/icons/heart";
import { Notice } from "components/notice";

export const App = () => (
  <div className="flex h-screen flex-col">
    <main className="my-auto justify-self-center">
      <Notice />
      <Bridge />
    </main>
    <footer className="justify-self-end pb-4">
      <p className="flex flex-wrap items-center justify-center gap-x-1 text-center text-sm text-neutral-500">
        Made with <HeartIcon /> by Gonzalo. Source code on{" "}
        <a
          className="text-orange-500 hover:text-orange-700"
          href="https://github.com/gndelia/bsc-hemi-bridge"
          rel="noopener noreferrer"
          target="_blank"
        >
          GitHub
        </a>
      </p>
    </footer>
  </div>
);
