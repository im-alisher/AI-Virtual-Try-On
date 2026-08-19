export default function UploadPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Images</h1>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500">Drop your photo here</p>
          <p className="text-sm text-gray-400 mt-2">Person image</p>
        </div>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500">Drop clothing image here</p>
          <p className="text-sm text-gray-400 mt-2">Clothing image</p>
        </div>
      </div>
    </div>
  )
}
