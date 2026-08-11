import {
  User,
  Settings,
  LogOut,
  Search,
  Bell
} from 'lucide-react'

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#080316] text-white">

      <aside
        className="
          fixed
          inset-y-0
          left-0
          flex
          w-64
          flex-col
          border-r
          border-white/10
          bg-[#0D0620]
        "
      >

        {/* Logo */}

        <div className="p-6">
          <h1 className="text-xl font-semibold">
            NEO
          </h1>
        </div>


        {/* Navigation */}

        <nav className="flex-1 px-4">

          <button
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              bg-gradient-to-r
              from-violet-600/80
              to-purple-600/80
              px-4
              py-3
              text-sm
              font-medium
              text-white
              shadow-lg
              shadow-violet-900/20
            "
          >
            <User size={18} />
            Profile
          </button>

        </nav>


        {/* Bottom navigation */}

        <div className="space-y-2 border-t border-white/10 p-4">

          <button
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-sm
              text-white/60
              transition
              hover:bg-white/5
              hover:text-white
            "
          >
            <Settings size={18} />
            Settings
          </button>


          <button
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-sm
              text-white/60
              transition
              hover:bg-white/5
              hover:text-white
            "
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </aside>


      {/* Main area */}

      <div className="min-h-screen pl-64">

        {/* Header */}

        <header
          className="
            flex
            h-16
            items-center
            justify-between
            border-b
            border-white/10
            bg-[#080316]/80
            px-8
            backdrop-blur-xl
          "
        >

          {/* Search */}

          <div
            className="
              flex
              w-72
              items-center
              gap-3
              rounded-xl
              border
              border-white/10
              bg-white/5
              px-4
              py-2
            "
          >
            <Search
              size={17}
              className="text-white/40"
            />

            <input
              type="text"
              placeholder="Search..."
              className="
                w-full
                bg-transparent
                text-sm
                text-white
                outline-none
                placeholder:text-white/30
              "
            />
          </div>


          {/* Header actions */}

          <div className="flex items-center gap-4">

            <button
              className="
                rounded-lg
                p-2
                text-white/50
                transition
                hover:bg-white/5
                hover:text-white
              "
            >
              <Bell size={18} />
            </button>


            <div
              className="
                flex
                items-center
                gap-3
                rounded-xl
                border
                border-white/10
                bg-white/5
                px-3
                py-2
              "
            >

              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-gradient-to-br
                  from-violet-500
                  to-blue-500
                  text-xs
                  font-semibold
                "
              >
                P
              </div>

              <span className="text-sm text-white/80">
                Pablo
              </span>

            </div>

          </div>

        </header>


        {/* Page content */}

        <main className="p-8">
          {children}
        </main>

      </div>

    </div>
  )
}

export default AppLayout