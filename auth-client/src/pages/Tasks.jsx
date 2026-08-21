import { useEffect, useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import Card from '../components/ui/Card'
import { useTasks } from '../hooks/useTasks'
import { useAuth } from '../hooks/useAuth'
import { getTeamMembers } from '../services/team.api'

function Tasks() {
  const { user } = useAuth()

  const {
    tasks,
    loading,
    error,
    createNewTask,
    changeTaskStatus
  } = useTasks()

  const [members, setMembers] = useState([])
  const [membersLoading, setMembersLoading] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assignedToId, setAssignedToId] = useState('')

  const [creating, setCreating] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    const loadMembers = async () => {
      if (user?.role !== 'manager' || !user?.teamId) {
        return
      }

      try {
        setMembersLoading(true)

        const data = await getTeamMembers(user.teamId)

        setMembers(
          data.filter(member => member.role === 'MEMBER')
        )
      } catch {
        setFormError('Error al cargar los miembros del equipo')
      } finally {
        setMembersLoading(false)
      }
    }

    loadMembers()
  }, [user])

  const handleCreateTask = async (event) => {
    event.preventDefault()

    if (!title.trim() || !assignedToId) {
      setFormError('Title and assignee are required')
      return
    }

    try {
      setCreating(true)
      setFormError('')

      await createNewTask({
        title: title.trim(),
        description: description.trim() || undefined,
        assignedToId
      })

      setTitle('')
      setDescription('')
      setAssignedToId('')
    } catch (error) {
      setFormError(
        error.response?.data?.error ||
        'Error al crear la tarea'
      )
    } finally {
      setCreating(false)
    }
  }

  const handleStatusChange = async (taskId, status) => {
    await changeTaskStatus(taskId, status)
  }

  const getNextAction = (task) => {
    if (user?.role === 'MEMBER') {
      if (task.status === 'SENT') {
        return {
          label: 'Start task',
          status: 'WORKING'
        }
      }

      if (task.status === 'WORKING') {
        return {
          label: 'Submit task',
          status: 'SUBMITTED'
        }
      }
    }

    if (
      user?.role === 'manager' &&
      task.status === 'SUBMITTED'
    ) {
      return {
        label: 'Complete task',
        status: 'DONE'
      }
    }

    return null
  }

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-6xl space-y-6">

        <div>
          <p className="text-sm text-[var(--text-secondary)]">
            Tasks
          </p>

          <h1 className="mt-1 text-3xl font-semibold">
            {user?.role === 'manager'
              ? 'Team Tasks'
              : 'My Tasks'}
          </h1>
        </div>

        {user?.role === 'manager' && (
          <Card>
            <form
              onSubmit={handleCreateTask}
              className="space-y-4"
            >
              <div>
                <h2 className="text-lg font-semibold">
                  Create task
                </h2>

                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Assign a new task to a team member.
                </p>
              </div>

              {formError && (
                <p className="text-sm text-red-400">
                  {formError}
                </p>
              )}

              <div className="grid gap-4 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm">
                    Title
                  </label>

                  <input
                    value={title}
                    onChange={(event) =>
                      setTitle(event.target.value)
                    }
                    placeholder="Task title"
                    className="
                      w-full
                      rounded-lg
                      border
                      border-white/10
                      bg-white/5
                      px-3
                      py-2
                      text-sm
                      outline-none
                      focus:border-white/20
                    "
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm">
                    Assign to
                  </label>

                  <select
                    value={assignedToId}
                    onChange={(event) =>
                      setAssignedToId(event.target.value)
                    }
                    disabled={membersLoading}
                    className="
                      w-full
                      rounded-lg
                      border
                      border-white/10
                      bg-[var(--bg-secondary)]
                      px-3
                      py-2
                      text-sm
                      outline-none
                      focus:border-white/20
                    "
                  >
                    <option value="">
                      {membersLoading
                        ? 'Loading members...'
                        : 'Select a member'}
                    </option>

                    {members.map(member => (
                      <option
                        key={member.id}
                        value={member.id}
                      >
                        {member.username}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              <div>
                <label className="mb-2 block text-sm">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Task description"
                  rows={4}
                  className="
                    w-full
                    rounded-lg
                    border
                    border-white/10
                    bg-white/5
                    px-3
                    py-2
                    text-sm
                    outline-none
                    focus:border-white/20
                  "
                />
              </div>

              <button
                type="submit"
                disabled={creating || membersLoading}
                className="
  rounded-lg
  bg-gradient-to-r
  from-violet-600/80
  to-purple-600/80
  px-4
  py-2
  text-sm
  font-medium
  text-[var(--text-primary)]
  shadow-lg
  shadow-violet-900/20
  transition
  hover:opacity-90
  disabled:cursor-not-allowed
  disabled:opacity-50
"
              >
                {creating ? 'Creating...' : 'Create task'}
              </button>
            </form>
          </Card>
        )}

        {error && (
          <Card>
            <p className="text-sm text-red-400">
              {error}
            </p>
          </Card>
        )}

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-sm text-[var(--text-secondary)]">
              Loading tasks...
            </p>
          </div>
        ) : tasks.length === 0 ? (
          <Card>
            <p className="text-sm text-[var(--text-secondary)]">
              No tasks found.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => {
              const nextAction = getNextAction(task)

              return (
                <Card key={task.id}>
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div className="space-y-2">

                      <div>
                        <h2 className="text-lg font-semibold">
                          {task.title}
                        </h2>

                        {task.description && (
                          <p className="mt-1 text-sm text-[var(--text-secondary)]">
                            {task.description}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm">

                        <p>
                          <span className="text-[var(--text-secondary)]">
                            Status:
                          </span>{' '}
                          {task.status}
                        </p>

                        {user?.role === 'manager' && (
                          <p>
                            <span className="text-[var(--text-secondary)]">
                              Assigned to:
                            </span>{' '}
                            {task.assignedTo?.username || 'Unknown'}
                          </p>
                        )}

                        {task.team && (
                          <p>
                            <span className="text-[var(--text-secondary)]">
                              Team:
                            </span>{' '}
                            {task.team.name}
                          </p>
                        )}

                      </div>
                    </div>

                    {nextAction && (
                      <button
                        type="button"
                        onClick={() =>
                          handleStatusChange(
                            task.id,
                            nextAction.status
                          )
                        }
                        className="
                          rounded-lg
                          bg-[var(--text-primary)]
                          px-4
                          py-2
                          text-sm
                          font-medium
                          text-[var(--bg-primary)]
                          transition-opacity
                          hover:opacity-80
                        "
                      >
                        {nextAction.label}
                      </button>
                    )}

                  </div>
                </Card>
              )
            })}
          </div>
        )}

      </div>
    </AppLayout>
  )
}

export default Tasks