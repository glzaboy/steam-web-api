// app/FormComponent.tsx（客户端组件）
'use client'

export default function FormComponent({ action }: { action: (formData: FormData) => void }) {
  return (
    <form action={action}>
      <input type="text" name="name" />
      <button type="submit">Submit</button>
    </form>
  )
}
