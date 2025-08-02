import LoadingSpinner from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import {  Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { VisuallyHidden } from '@/components/ui/visually-hidden'
import { useCartContext } from '@/context/context'
import { designVar } from '@/designVar/desighVar'
import { apiClient } from '@/lib/api'
import { formatDateByPattern } from '@/lib/utils'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useQueryClient } from '@tanstack/react-query'


import { LockIcon, XIcon } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'



interface PasswordForm {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }

 const UpdatePassword = ({data} : {data : any}) => {
  

    // const [isPassVisible, setIsPassVisible] = React.useState(false);
    // const [password , setPassword] = useState("");
    const {dateFormat} = useCartContext()
    
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
      } = useForm<PasswordForm>({
        defaultValues: {
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        },
      })

    const queryclient = useQueryClient();
    const [open, setOpen] = useState(false);


    const onSubmit = async (data: PasswordForm) => {
        if (data.newPassword !== data.confirmPassword) {
          toast.error("New password and confirm password do not match.")
          return
        }
        await toast.promise(
          apiClient.put("/auth/customer/password/update", {
            oldPassword: data.currentPassword,
            newPassword: data.newPassword,
          }),
          {
            loading: "Updating password...",
            success: () => {
              reset();
              setOpen(false);
              return "Password updated successfully!";
            },
            error: (err) =>
              err?.response?.data?.error ||
              err?.response?.data?.message ||
              "Failed to update password.",
          }
        );
        queryclient.invalidateQueries({ queryKey: ['profile'] })
      }


      const allFieldsFilled =
      !!watch("currentPassword") && !!watch("newPassword") && !!watch("confirmPassword")
    const passwordsMatch = watch("newPassword") === watch("confirmPassword")



  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button
        
        className='bg-[#F8F9FA] hover:bg-[#F8F9FA] '
      >
        <LockIcon className='text-green-500 hover:text-green-300'/>
      </Button>
    </DialogTrigger>
       <DialogContent  className="w-[90%] sm:w-[30em] max-w-full h-max min-h-40 flex flex-col px-5 py-6 gap-0 rounded-xl border-0 descriptionModal">
      <DialogHeader>
        <DialogTitle asChild>
          Update Password
        </DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center justify-center">
        <p className='text-center mb-4 mt-4 font-bold text-[1.2em]'>Update Password <span className='ml-[1em] font-normal text-[0.8em]'>(Last Updated : {formatDateByPattern(data,dateFormat)})</span></p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
            <div>
              <Label htmlFor="currentPassword" className="block text-slate-700 mb-1">
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Current password"
                {...register("currentPassword", {
                  required: "Current password is required",
                  minLength: { value: 8, message: "Password must be at least 8 characters" },
                })}
                disabled={isSubmitting}
              />
              {errors.currentPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>
  
            <div>
              <Label htmlFor="newPassword" className="block text-slate-700 mb-1">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="New password"
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: { value: 8, message: "Password must be at least 8 characters" },
                })}
                disabled={isSubmitting}
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
  
            <div>
              <Label htmlFor="confirmPassword" className="block text-slate-700 mb-1">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  minLength: { value: 8, message: "Password must be at least 8 characters" },
                })}
                disabled={isSubmitting}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
              {!passwordsMatch && watch("confirmPassword") && (
                <p className="text-red-500 text-sm mt-1">New password and confirm password must be same.</p>
              )}
            </div>
  
            <div className="flex justify-end space-x-2 pt-2">
           
                <Button type='button' onClick={()=> {reset() , setOpen(false)}} className="dark_blue_color flex-1" variant="outline" disabled={isSubmitting}>Cancel</Button>
            
              <Button className="orange_color flex-1" type="submit" disabled={!allFieldsFilled || isSubmitting || !passwordsMatch}>
                {
                    isSubmitting ? <LoadingSpinner className='animate-spin' /> : "Update"
                }
              </Button>
            </div>
          </form>
        </div>
      <DialogClose className="bg-black/80 p-1 rounded-xl text-white right-2 top-2 sm:right-2 sm:top-2">
        <XIcon className="w-6 h-6" />
      </DialogClose>
    </DialogContent>
  </Dialog>
  )
}

export default UpdatePassword
