import LoadingSpinner from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import {  Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { VisuallyHidden } from '@/components/ui/visually-hidden'
import { designVar } from '@/designVar/desighVar'
import { apiClient } from '@/lib/api'
import { watch } from 'fs'

import { LucideEye, LucideEyeOff, Trash2, XIcon } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

 const DeleteAccount = () => {
  
    const [authOpen , setAuthOpen] = useState(false);
    const [isPassVisible, setIsPassVisible] = React.useState(false);
    const [password , setPassword] = useState("");
    
    const {handleSubmit,register , formState: {errors}} = useForm()
    const [passwordLoading,setPasswordLoading] = useState(false);



    const DeletePassword = async (data : any) => {
        // Call backend to reset password with email, password, and resetToken from sessionStorage
        setPasswordLoading(true);
        try {
     
          const res = await apiClient.delete('/auth/customer/account', {
            data: { password: data.password },
          });
          if (res.data && (res.data.error || res.data.success === false)) {
            toast.error(res.data.error || 'Account deletion failed');
            setPasswordLoading(false);
          } else if (res.status === 200 || res.status === 204) {
            toast.success('Account Deleted Successfully.');
            setPasswordLoading(false);
           
          }
        } catch (error: any) {
          let backendError =
            error?.response?.data?.error ||
            error?.response?.data?.message ||
            'Something went wrong. Try again later';
          toast.error(backendError);
          setPasswordLoading(false);
        }
      };



  return (
    <Dialog open={authOpen} onOpenChange={setAuthOpen}>
    <DialogTrigger asChild>
      <Button
        
        className='bg-[#F8F9FA] hover:bg-[#F8F9FA] '
      >
        <Trash2 className='text-red-500 hover:text-red-300'/>
      </Button>
    </DialogTrigger>
       <DialogContent  className="w-[90%] sm:w-[30em] max-w-full h-max min-h-40 flex flex-col px-5 py-6 gap-0 rounded-xl border-0 descriptionModal">
      <DialogHeader>
        <DialogTitle asChild>
          Are you sure to delete your acccount . Enter password to confirm .
        </DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center justify-center">
        <p className='text-center mb-2 mt-4'>Are you sure to delete your acccount . Enter password to confirm .</p>
          <form
            className="flex w-full flex-col items-center justify-center mb-1"
            onSubmit={handleSubmit(DeletePassword)}
          >
            <Label className="w-full rounded-2xl relative ">
              {/* <span className="block mb-2 font-medium">New Password</span> */}
              <Input
                type={isPassVisible ? "text" : "password"}
                disabled={passwordLoading}
                placeholder="Enter password"
                {...register("password", {
                  required: true,
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                  onChange : (e)=>setPassword(e.target.value)
                
                })}
                className="w-full focus-visible:ring-primaryOrange mb-2 "
              />
                {errors.password?.message && (
                  <p className="text-red-500">{`${errors.password.message}`}</p>
                )}

              <Button
                variant="link"
                onClick={(e) => {
                  e.preventDefault();
                  setIsPassVisible(!isPassVisible);
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 focus-visible:ring-primaryOrange focus-visible:ring-offset-0"
              >
                {isPassVisible ? <LucideEyeOff /> : <LucideEye />}
              </Button>
            </Label>
            <Button
              type="submit"
              disabled={passwordLoading || !(password.length > 7)}
              className={`${designVar.widthFullButton.width} ${designVar.widthFullButton.backgroundColor} ${designVar.widthFullButton.borderRadius} ${designVar.widthFullButton.paddingX} ${designVar.widthFullButton.paddingY} ${designVar.widthFullButton.fontSize} ${designVar.widthFullButton.fontWeight} ${designVar.widthFullButton.color} ${designVar.widthFullButton.cursor} ${designVar.widthFullButton.transition} ${designVar.widthFullButton.hover.backgroundColor} ${designVar.widthFullButton.hover.borderRadius} ${designVar.widthFullButton.hover.color} ${designVar.widthFullButton.hover.color} ${designVar.widthFullButton.hover.backgroundColor} mt-[1.5em]`}
            >
              <div className="w-full flex items-center justify-center p-2">
                {passwordLoading ? <LoadingSpinner className="size-6 border-t-white" /> :
                  <span>Confirm Delete Account</span>
                }
              </div>
            </Button>
          </form>
        </div>
      <DialogClose className="bg-black/80 p-1 rounded-xl text-white right-2 top-2 sm:right-2 sm:top-2">
        <XIcon className="w-6 h-6" />
      </DialogClose>
    </DialogContent>
  </Dialog>
  )
}

export default DeleteAccount
