'use client'

import { signOut } from "next-auth/react"
import Link from "next/link"

const Profile = ({ session }) => {

  return (
    <>
    <h1>
      You are logged in as {session.user?.username}
    </h1>
    <div className="d-flex">
      <Link
        href="/flights"
        className="button border-dark-1 border-width-2 mt-10 px-20 py-10 rounded-8 mr-15"
      >
        Flights
      </Link>
      <button
        className="button border-dark-1 border-width-2 mt-10 px-20 py-10 rounded-8"
        onClick={() => signOut()}
      >
        Log out
      </button>
    </div>
    </>
  )
}

export default Profile
