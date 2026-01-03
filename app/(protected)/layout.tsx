import BottomNav from '../components/BottomNav'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 max-w-md mx-auto relative overflow-hidden">
      {children}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50">
        <BottomNav />
      </div>
    </div>
  )
}

