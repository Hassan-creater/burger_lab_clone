import React from 'react'

const ProductDescriptionSkelton = () => {
  return (
    <article className="flex w-[45em] flex-col lg:flex-col shadow-lg rounded-2xl overflow-scroll overflow-x-hidden productdetail animate-pulse">
  {/* Left - Product Image & Variants */}
  <div className="w-full flex flex-col">
    {/* Product Image Skeleton */}
    <div className="relative w-full h-[25em] overflow-hidden rounded-xl bg-gray-300" />

    {/* Product Name & Description Skeleton */}
    <div className="w-full p-4 mt-[1em]">
      <div className="bg-white p-2 rounded-md shadow-lg">
        <div className="h-5 w-3/4 bg-gray-300 rounded mb-2" />
        <div className="h-3 w-full bg-gray-200 rounded" />
        <div className="h-3 w-5/6 bg-gray-200 rounded mt-1" />
      </div>
    </div>

    {/* Variant Selector Skeleton */}
    <div className="mt-6 px-4">
      <div className="inline-flex items-center text-sm font-bold text-gray-700 mb-3">
        <div className="bg-black w-20 h-6 rounded-l-lg" />
        <div className="bg-orange-500 w-32 h-6 rounded-r-lg ml-1" />
      </div>

      <div className="flex space-x-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
        {Array(3).fill(0).map((_, idx) => (
          <div key={idx} className="flex flex-col items-center w-[8em] h-[10em] bg-white border-2 border-gray-200 rounded-xl p-2">
            <div className="w-full h-20 bg-gray-300 rounded mb-2" />
            <div className="h-3 w-3/4 bg-gray-300 rounded mb-1" />
            <div className="h-4 w-1/2 bg-gray-400 rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Right - Addons & Extras */}
  <div className="w-full flex flex-col mt-6 space-y-8">
    <div className="border p-5 bg-white">
      {/* Addons Section */}
      <div className="mb-6">
        <div className="inline-flex mb-4">
          <div className="bg-black w-20 h-6 rounded-l-lg" />
          <div className="bg-orange-500 w-32 h-6 rounded-r-lg ml-1" />
        </div>
        <div className="flex flex-col gap-3 mt-3 bg-gray-100 p-2 rounded-md">
          {Array(2).fill(0).map((_, idx) => (
            <div key={idx} className="bg-white border border-gray-300 p-3 rounded-xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gray-300 mr-3" />
                  <div className="h-3 w-24 bg-gray-300 rounded" />
                </div>
                <div className="h-3 w-12 bg-green-300 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Extras Section */}
      <div className="mt-6">
        <div className="inline-flex mb-4">
          <div className="bg-black w-20 h-6 rounded-l-lg" />
          <div className="bg-orange-500 w-32 h-6 rounded-r-lg ml-1" />
        </div>
        <div className="flex flex-col gap-3 mt-3 bg-gray-100 p-2 rounded-md">
          {Array(2).fill(0).map((_, idx) => (
            <div key={idx} className="bg-white border border-gray-300 p-3 rounded-xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gray-300 mr-3" />
                  <div className="h-3 w-24 bg-gray-300 rounded" />
                </div>
                <div className="h-3 w-12 bg-green-300 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Total Price & Add to Cart */}
    <div className="mt-6 bg-white pt-5 border-t border-gray-200">
      <div className="flex justify-between items-center mb-4 px-4">
        <div className="h-4 w-24 bg-gray-300 rounded" />
        <div className="h-4 w-16 bg-orange-300 rounded" />
      </div>

      <div className="w-full absolute bottom-0 rounded-xl left-0 p-4 bg-white shadow-lg flex flex-row-reverse justify-between items-center">
        <div className="h-10 w-[17em] bg-orange-400 rounded-xl" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-400 rounded-full" />
          <div className="w-8 h-6 bg-gray-300 rounded" />
          <div className="w-8 h-8 bg-orange-400 rounded-full" />
        </div>
      </div>
    </div>
  </div>
</article>

  )
}

export default ProductDescriptionSkelton
