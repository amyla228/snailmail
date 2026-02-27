import { supabase } from "@/lib/supabase"

export default async function LetterPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data, error } = await supabase
    .from("letters")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) {
    return <div>Letter not found 💔</div>
  }

  const letter = JSON.parse(data.content)

  return (
    <div style={{ padding: 40 }}>
      <h1>My Pen Pal</h1>
      <pre>{JSON.stringify(letter, null, 2)}</pre>
    </div>
  )
}