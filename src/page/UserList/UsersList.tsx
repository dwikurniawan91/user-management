import { useEffect, useState } from 'react'
import useUserStore from '@/stores/userStore'
import type { User } from '@/stores/userStore'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'motion/react'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { toast, Toaster } from 'sonner'
import { Button } from '@/components/ui/button'
import UserForm from '@/components/ui/UserForm/UserForm'
import { Skeleton } from '@/components/ui/skeleton'

export default function UsersList() {
  const users = useUserStore((s) => s.users)
  const loading = useUserStore((s) => s.loading)
  const error = useUserStore((s) => s.error)
  const fetchUsers = useUserStore((s) => s.fetchUsers)

  useEffect(() => {
    if (users.length === 0) fetchUsers()
  }, [fetchUsers, users.length])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const addUser = useUserStore((s) => s.addUser)
  const updateUser = useUserStore((s) => s.updateUser)
  const deleteUser = useUserStore((s) => s.deleteUser)

  return (
    <main>
      <Toaster position="top-right" richColors />
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">User Management</h1>
        <Button onClick={() => setShowAddDialog(true)} variant="default">
          Add User
        </Button>
      </header>

      {error ? (
        <p role="alert" className="text-red-600">
          Error: {error}
        </p>
      ) : null}

      <AlertDialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add New User</AlertDialogTitle>
            <AlertDialogDescription>Fill in the details for the new user</AlertDialogDescription>
          </AlertDialogHeader>
          <UserForm
            onSubmit={(data) => {
              addUser(data)
              setShowAddDialog(false)
              toast.success('User added successfully')
            }}
            onCancel={() => setShowAddDialog(false)}
          />
        </AlertDialogContent>
      </AlertDialog>

      <section aria-labelledby="users-heading">
        <h3 id="users-heading" className="sr-only">
          User list
        </h3>

        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 md:grid-cols-3">
          {loading &&
            Array.from({ length: 10 }).map((_, index) => (
              <li key={index} className="list-none">
                <Card className="p-3">
                  <CardContent>
                    <article>
                      <header className="flex items-center gap-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="mb-1 h-5 w-24" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </header>
                      <div className="mt-2">
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </article>
                  </CardContent>
                </Card>
              </li>
            ))}{' '}
          {!loading &&
            users.length > 0 &&
            users.map((u: User) => (
              <motion.li
                key={u.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                whileHover={{ scale: 1.02 }}
                layout
                className="list-none"
              >
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Card className="p-3" role="button" tabIndex={0}>
                      <CardContent>
                        <article aria-labelledby={`user-${u.id}-name`}>
                          <div className="flex gap-3">
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="h-20 w-20 rounded-full border"
                              loading="lazy"
                            />
                            <div className="flex flex-col items-start text-left">
                              <h3 id={`user-${u.id}-name`} className="text-base font-semibold">
                                {u.name}
                              </h3>
                              <p className="text-sm text-gray-500">@{u.username}</p>
                              <p className="mt-2 text-sm text-gray-700">
                                <a href={`mailto:${u.email}`} className="text-inherit">
                                  {u.email}
                                </a>
                                {u.website ? (
                                  <>
                                    <a
                                      href={`https://${u.website.replace(/^https?:\/\//, '')}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-block text-blue-500"
                                    >
                                      {u.website}
                                    </a>
                                  </>
                                ) : null}
                              </p>
                            </div>
                          </div>
                        </article>
                      </CardContent>
                    </Card>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    {editingUser?.id === u.id ? (
                      <>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Edit User</AlertDialogTitle>
                          <AlertDialogDescription>Update user details</AlertDialogDescription>
                        </AlertDialogHeader>
                        <UserForm
                          initialData={u}
                          onSubmit={(data) => {
                            updateUser(u.id, data)
                            setEditingUser(null)
                            toast.success('User updated successfully')
                          }}
                          onCancel={() => setEditingUser(null)}
                        />
                      </>
                    ) : (
                      <>
                        <AlertDialogHeader>
                          <img
                            src={u.avatar}
                            alt={u.name}
                            width={48}
                            height={48}
                            className="flex-none rounded-full border"
                            loading="lazy"
                          />
                          <AlertDialogTitle>{u.name}</AlertDialogTitle>
                          <AlertDialogDescription className="text-muted-foreground text-sm">
                            @{u.username}
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <div className="mt-2 grid gap-2">
                          <p>
                            <strong>Email: </strong>
                            <a href={`mailto:${u.email}`}>{u.email}</a>
                          </p>
                          {u.phone ? (
                            <p>
                              <strong>Phone: </strong>
                              <a href={`tel:${u.phone}`}>{u.phone}</a>
                            </p>
                          ) : null}
                          {u.website ? (
                            <p>
                              <strong>Website: </strong>
                              <a
                                href={`https://${u.website.replace(/^https?:\/\//, '')}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {u.website}
                              </a>
                            </p>
                          ) : null}
                          {u.company ? (
                            <p>
                              <strong>Company: </strong>
                              {(u.company as { name: string }).name || String(u.company)}
                            </p>
                          ) : null}
                        </div>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Close</AlertDialogCancel>
                          <Button
                            variant="outline"
                            onClick={() => setEditingUser(u)}
                            className="mr-2"
                          >
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive">Delete</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this user? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white"
                                  onClick={() => {
                                    deleteUser(u.id)
                                    toast.success('User deleted successfully')
                                  }}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </AlertDialogFooter>
                      </>
                    )}
                  </AlertDialogContent>
                </AlertDialog>
              </motion.li>
            ))}
        </ul>
      </section>
    </main>
  )
}
