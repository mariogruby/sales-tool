import ResetPasswordForm from "@/components/reset-password";
// import { type SearchParams } from "next";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ResetPassword({ searchParams }: Props) {
  const params = await searchParams; // Resuelve la Promise
  const token = typeof params.token === "string" ? params.token : "";

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}