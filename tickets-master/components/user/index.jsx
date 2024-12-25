import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth";
import Profile from '@/components/user/Profile'

const index = async () => {
  const session = await getServerSession(authOptions)
  const isVisible = session && (session.user.role === 'staff' || session.user.role === 'admin')

  return (
    <div className="px-20 py-20" style={{ minHeight: '100vh' }}>
      {isVisible ? (
        <>
        <Profile session={session} />
        </>
      ) : (
        <h1>
          Coming Soon
        </h1>
      )}
    </div>
  )
}

export default index
