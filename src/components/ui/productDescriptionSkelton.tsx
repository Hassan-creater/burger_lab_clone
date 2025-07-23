import React from 'react'

const ProductDescriptionSkelton = () => {
  return (
    <article className="flex w-full h-full flex-col rounded-2xl overflow-y-scroll overflow-x-hidden bg-white shadow-lg pb-[3em] animate-pulse">
    {/* Header Info */}
    <div className="w-full p-4 mt-[1em]">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
    {/* Image Placeholder */}
    <div className="relative w-[95%] mx-auto h-[20em] bg-gray-200 rounded-xl"></div>

    {/* Variant Selector Placeholder */}
    <div className="mt-8 px-4">
      <div className="h-6 w-32 bg-gray-200 rounded mb-3"></div>
      <div className="flex gap-3 overflow-x-scroll no-scrollbar p-2 bg-gray-100 rounded-lg">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[8em] h-[10em] bg-white border border-gray-200 rounded-xl p-2 flex flex-col">
            <div className="h-20 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mt-auto"></div>
          </div>
        ))}
      </div>
    </div>

    {/* Details Section */}
    <div className="w-full flex flex-col p-4 mt-6">
      <div className="space-y-8 overflow-y-auto flex-1">
        {/* Addons Placeholder */}
        <div className="py-5">
          <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="flex flex-col gap-3 p-2 bg-gray-100 rounded-lg">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-3">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-gray-200 rounded-full mr-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-40"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Extras Placeholder */}
        <div className="py-5">
          <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="flex flex-col gap-3 p-2 bg-gray-100 rounded-lg">
            {[...Array(3)].map((_, k) => (
              <div key={k} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-3">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-gray-200 rounded-full mr-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-40"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Footer Actions */}
      <div className="w-full fixed bottom-0 left-0 p-4 bg-white shadow-xl flex justify-between items-center rounded-t-xl">
        <div className="h-10 bg-gray-200 rounded w-32"></div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="h-6 bg-gray-200 rounded w-8"></div>
          <div className="h-6 bg-gray-200 rounded w-8"></div>
        </div>
      </div>
    </div>
  </article>

  )
}

export default ProductDescriptionSkelton
