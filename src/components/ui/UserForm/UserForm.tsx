import { type User } from '@/stores/userStore'
import { Input } from '../input'
import { Button } from '../button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  website: z.string().optional(),
  company: z
    .object({
      name: z.string().optional(),
    })
    .optional(),
})

type FormData = z.infer<typeof userSchema>

interface UserFormProps {
  onSubmit: (data: Omit<User, 'id' | 'avatar'>) => void
  initialData?: Partial<User>
  onCancel?: () => void
}

export default function UserForm({ onSubmit, initialData, onCancel }: UserFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      username: initialData?.username ?? '',
      email: initialData?.email ?? '',
      phone: initialData?.phone ?? '',
      website: initialData?.website ?? '',
      company: {
        name: (initialData?.company as { name: string })?.name ?? '',
      },
    },
  })

  const handleSubmit = (data: FormData) => {
    onSubmit(data)
  }

  const handleKeyDown = (e: React.KeyboardEvent, fieldName: keyof FormData | 'company.name') => {
    const fields = ['name', 'username', 'email', 'phone', 'website', 'company.name']
    const currentIndex = fields.indexOf(fieldName)

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const nextField = fields[currentIndex + 1]
      if (nextField) {
        form.setFocus(nextField as keyof FormData)
      } else {
        form.handleSubmit(handleSubmit)()
      }
    } else if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault()
      const prevField = fields[currentIndex - 1]
      if (prevField) {
        form.setFocus(prevField as keyof FormData)
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => handleKeyDown(e, 'name')}
                  autoFocus
                  placeholder="Enter your name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => handleKeyDown(e, 'username')}
                  placeholder="Enter your username"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  {...field}
                  onKeyDown={(e) => handleKeyDown(e, 'email')}
                  placeholder="Enter your email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  {...field}
                  onKeyDown={(e) => handleKeyDown(e, 'phone')}
                  placeholder="Enter your phone number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => handleKeyDown(e, 'website')}
                  placeholder="Enter your website"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => handleKeyDown(e, 'company.name')}
                  placeholder="Enter company name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-4 flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">{initialData ? 'Update' : 'Add'} User</Button>
        </div>
      </form>
    </Form>
  )
}
