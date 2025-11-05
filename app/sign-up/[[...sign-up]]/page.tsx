import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-slate-900 shadow-xl",
            headerTitle: "text-white",
            headerSubtitle: "text-slate-300",
            socialButtonsBlockButton: "bg-slate-800 border-slate-700 text-white hover:bg-slate-700",
            formButtonPrimary: "bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700",
            formFieldLabel: "text-slate-200",
            formFieldInput: "bg-slate-800 border-slate-700 text-white",
            footerActionLink: "text-teal-400 hover:text-teal-300",
            identityPreviewText: "text-white",
            identityPreviewEditButton: "text-teal-400",
            formFieldInputShowPasswordButton: "text-slate-400 hover:text-slate-200",
            otpCodeFieldInput: "bg-slate-800 border-slate-700 text-white",
          }
        }}
      />
    </div>
  )
}
