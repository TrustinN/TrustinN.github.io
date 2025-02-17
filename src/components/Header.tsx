import { twMerge } from "tailwind-merge";

const subSections: Record<string, string> = {
  Home: "/",
  Projects: "/projects/",
  Education: "/education/",
  Hobbies: "/hobbies/",
  Github: "https://github.com/TrustinN",
};

export const Header = () => {
  return (
    <header className="items-stretch shadow-[0_5px_15px_rgba(0,0,0,0.35)]">
      <div className="md:hidden flex flex-row justify-between bg-black text-white relative z-50">
        <button type="button"></button>
      </div>
      <nav>
        <ul className="flex justify-end bg-black text-center list-none ">
          {Object.entries(subSections).map(([content, href]) => {
            let inner = (
              <div className="flex justify-evenly items-center p-4">
                {content}
              </div>
            );
            if (content == "Github") {
              inner = (
                <div className="flex justify-center items-center w-full h-full">
                  <div className="flex-grow bg-[url(/media/github.png)] bg-contain bg-no-repeat pl-[3.5rem] w-auto h-[70%] bg-center">
                    {" "}
                  </div>
                  <div className="pr-4 pl-2">{content}</div>
                </div>
              );
            }
            return (
              <li key={content}>
                <a
                  className={twMerge(
                    `block p-0 transform scale-90 transition-transform duration-250 ease-in-out text-[1.1rem] hover:scale-100 focus:scale-100 hover:text-gray-300 focus:text-gray-300 hover:bg-gray-800 w-full h-full`,
                  )}
                  href={href}
                >
                  {inner}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};
