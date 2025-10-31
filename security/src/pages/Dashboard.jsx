function Dashboard() {
  return (
    <div className="h-full w-full">
      <div className="grid grid-cols-2 grid-rows-[1fr_1fr] h-full w-full gap-4 p-4">
        <div className="bg-blue-500 flex items-center justify-center text-white text-xl font-semibold">
          Box 1
        </div>
        <div className="bg-green-500 flex items-center justify-center text-white text-xl font-semibold">
          Box 2
        </div>
        <div className="bg-purple-500 col-span-2 flex items-center justify-center text-white text-xl font-semibold">
          Box 3
        </div>
      </div>
    </div>
  );
}

export default Dashboard