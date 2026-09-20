const Logo = () => {
  return (
    <div className="relative aspect-square w-full rounded-full bg-black">
      <div className="absolute inset-[10%] rounded-full border-2 border-button" />
      <div className="absolute inset-[32%] grid place-items-center rounded-full bg-coral">
        <div className="size-1/4 rounded-full bg-background" />
      </div>
    </div>
  )
}

export default Logo
