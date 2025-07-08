'use client'

import DealCard from '@/components/DealCard'
import { useCartContext } from '@/context/context'
import { apiClientCustomer } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton';

const DealSection = ({ deals , favorites }: { deals?: any[] , favorites : any }) => {
  const { setDeals } = useCartContext()

  

  const getAllDeals = async () => {
    const res = await apiClientCustomer.get(`/deal/view/customer`);
    return res.data.data
  }

  // Only fetch if deals prop is not provided
  const { data , isLoading } = useQuery({
    queryKey: ['deals'],
    queryFn: getAllDeals,
    enabled: !deals,
  })

  const dealList = deals || data;

  useEffect(() => {
    if (dealList) {
      setDeals(dealList)
    }
  }, [dealList, setDeals])

  console.log(favorites)

  return (
    <>
    {
      dealList?.length > 0 && (
    <div id='deals' className='w-[92%] mx-auto'>
      <h2 className="text-2xl font-bold mb-2 border-b-[1.5px] border-gray-300">Deals</h2>
      <div className="w-full flex flex-wrap gap-4 mb-[1em]">
        {
          isLoading
            ? Array.from({ length: 3 }).map((_, idx) => <ProductCardSkeleton key={idx} />)
            : dealList?.map((deal: any) => (
                <DealCard favorite={favorites} key={deal.id} deal={deal} />
              ))
        }
        
      </div>
    </div>
      )
    }
    </>
  )
}

export default DealSection
