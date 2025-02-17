import Link from "next/link";
import { twMerge } from "tailwind-merge";

export type articleElem = {
  id: string;
  content: React.ReactElement;
  link?: string;
};

export const exploreLink = (link: string, orientation?: string) => {
  return (
    <Link
      href={link}
      className={`z-10 block absolute top-0 ${!orientation ? "max-w-[95%]" : ""} w-full h-full bg-black rounded-2xl text-white ${!orientation ? "hover:translate-x-[2%]" : "hover:scale-x-105 hover:translate-x-[2%]  hover:translate-y-[4%]"} transform ease-in-out duration-200`}
    >
      <div className="flex flex-row w-full h-full items-center justify-end ">
        <div className="w-[8%]">&#x27A7;</div>
      </div>
    </Link>
  );
};

export const Article = ({
  id,
  link,
  orientation,
  className,
  children,
}: {
  id: string;
  link?: string;
  orientation?: string;
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="h-fit">
      <article
        className={twMerge(
          `relative z-50 m-0 p-8 text-left ${!orientation ? "max-w-[85%] h-full" : "max-h-[90%] w-full"} ${!link ? "max-w-[100%]" : ""} h-fit rounded-2xl bg-white text-black ${className}`,
        )}
        id={id}
      >
        {children}
      </article>
      {link ? exploreLink(link, orientation) : ""}
    </div>
  );
};

export const SectionContainer = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col flex-grow max-w-[60rem]">{children}</div>
  );
};

export const Section = ({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <section
      className={twMerge(
        `mb-8 mx-[5vw] rounded-[1rem] shadow-[0px_5px_15px_rgba(0,0,0,0.35)] h-fit relative bg-red ${className}`,
      )}
    >
      {children}
    </section>
  );
};

export const MainContainer = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="flex flex-row flex-nowrap justify-center relative">
      {children}
    </div>
  );
};

export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="mx-[5vw]">{children}</div>;
};
