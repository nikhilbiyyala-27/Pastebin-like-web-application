import CreateForm from '@/components/create-form'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10" />

      <div className="text-center mb-12 space-y-4">
        <h1 className="text-5xl font-bold bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
          Pastebin
        </h1>
        <p className="text-zinc-400 max-w-md mx-auto">
          Share code and text securely. Set expiration timers or burn-after-reading limits.
        </p>
      </div>

      <CreateForm />
    </main>
  )
}
