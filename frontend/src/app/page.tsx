import Navbar from "./components/navbar"

export default function Page(){
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Navbar />
      <h1 className="text-4xl font-bold text-gray-800">
        Welcome to the Next.js App with Geist UI!
      </h1>
    </div>
  )
}