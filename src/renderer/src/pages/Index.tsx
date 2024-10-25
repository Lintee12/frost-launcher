import Library from '@renderer/components/Library'

function Index() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        <h3>Your Library</h3>
        <div className="bg-zinc-800 w-full min-h-[calc(100vh-180px)] rounded-md p-4">
          <Library></Library>
        </div>
      </div>
    </div>
  )
}

export default Index
