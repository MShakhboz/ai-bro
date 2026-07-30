// src/app/chat/[id]/page.tsx
import Chatmenu from '@/features/chatmenu/ui/Chatmenu'

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function Page({ params }: Props) {
  const { id } = await params

  return <Chatmenu id={id} />
}
