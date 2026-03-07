function MapLoader() {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white">

      {/* animated road */}
      <div className="relative w-48 h-2 bg-slate-200 rounded-full overflow-hidden mb-6">

        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

        <div className="absolute -top-4 left-0 animate-[drive_2s_linear_infinite] text-xl">
          🚌
        </div>

      </div>

      <p className="text-sm text-slate-500 animate-pulse">
        Loading live bus map...
      </p>

      <style>
        {`
        @keyframes drive {
          0% { transform: translateX(-20px); }
          100% { transform: translateX(200px); }
        }
        `}
      </style>

    </div>
  );
}

export default MapLoader;