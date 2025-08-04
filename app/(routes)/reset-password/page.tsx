import ResetPasswordForm from "@/components/reset-password"

interface Props {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function ResetPassword({ searchParams }: Props) {
  const token = typeof searchParams.token === "string" ? searchParams.token : ""

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  )
}
