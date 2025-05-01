// page.tsx

"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreateProduct } from "@/components/create-product"

const AddProduct = () => {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setOpen(true)}>add</Button>
      <CreateProduct open={open} setOpen={setOpen} />
    </div>
  )
}

export default AddProduct
