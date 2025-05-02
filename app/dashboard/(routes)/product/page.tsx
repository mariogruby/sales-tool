// page.tsx

"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreateProduct } from "@/components/create-product"
import { AllProducts } from "@/components/all-products"

const Page = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>add</Button>
      <CreateProduct open={open} setOpen={setOpen} />
      <AllProducts />
    </>
  )
}

export default Page
