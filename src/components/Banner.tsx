export const Banner = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="text-center text-black p-20 row-span-2 row-start-1 row-end-2 flex flex-col flex-nowrap justify-center items-center w-full">
      {children}
    </div>
  );
};
