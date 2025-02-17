export const Sidebar = ({
  ids,
  children,
}: {
  ids?: string[];
  children?: React.ReactNode;
}) => {
  return (
    <div className="block flex-grow max-w-[25%]">
      <div className="max-w-[80%] mx-auto h-full">
        {children}
        {ids ? (
          <div className="sticky top-[20%] p-4 pl-6 border-1 border-black border-solid rounded-[1rem] bg-black shadow-[0px_5px_15px_rgba(0,0,0,0.35)] h-auto  max-h-[60vh] overflow-y-auto ">
            <nav>
              {ids.map((id) => (
                <ul key={id}>
                  <a
                    className="block scale-90 hover:text-slate-300 transition-transform  duration-100 ease-in-out text-[1.1rem] hover:scale-100 focus:scale-100 "
                    href={`#${id}`}
                  >
                    {id}
                  </a>
                </ul>
              ))}
            </nav>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};
