export default function LoadingOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600"></div>
        <p className="mt-2 text-sm font-medium text-gray-700">Loading...</p>
      </div>
    </div>
  )
}
