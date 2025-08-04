import React, { useState } from 'react'
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { DialogDescription } from '@radix-ui/react-dialog';
import { designVar } from '@/designVar/desighVar';
import { Trash2 } from 'lucide-react';
import { useCartContext } from '@/context/context';


const ClearCartModel = () => {
    const [open, setOpen] = useState(false);
    const {ClearCart} = useCartContext()
   

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      <Button
              variant="link"
          
              className={`text-[#fabf2c] !p-2 underline font-bold text-md ${designVar.fontFamily}`}
            >
              Clear Cart
            </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px] descriptionModal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Clear Cart
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to clear the cart.? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
           
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
          
            onClick={()=>{ClearCart() , setOpen(false)}}
            className="flex-1 sm:flex-none"
          >
            Clear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ClearCartModel
