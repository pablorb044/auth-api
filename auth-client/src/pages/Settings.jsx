import { useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import Card from '../components/ui/Card'

function Settings() {
    const [isLight, setIsLight] = useState(
    localStorage.getItem('theme') === 'light'
    )

  const toggleTheme = () => {
    const nextTheme = !isLight

    setIsLight(nextTheme)

    if (nextTheme) {
        document.documentElement.classList.add('light')
        localStorage.setItem('theme', 'light')
    } else {
        document.documentElement.classList.remove('light')
        localStorage.setItem('theme', 'dark')
    }
    }

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="mb-2 text-3xl font-semibold text-[var(--text-primary)]">
          Settings
        </h1>

        <p className="mb-8 text-sm text-[var(--text-secondary)]">
          Manage your application preferences.
        </p>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-[var(--text-primary)]">
                Appearance
              </h2>

              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Switch between dark and light mode.
              </p>
            </div>

            <button
              onClick={toggleTheme}
              className="
                relative
                h-6
                w-11
                rounded-full
                bg-white/10
                transition
                data-[active=true]:bg-violet-600
              "
              data-active={isLight}
            >
              <span
                className="
                  absolute
                  left-1
                  top-1
                  h-4
                  w-4
                  rounded-full
                  bg-white
                  transition-transform
                  data-[active=true]:translate-x-5
                "
                data-active={isLight}
              />
            </button>
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}

export default Settings