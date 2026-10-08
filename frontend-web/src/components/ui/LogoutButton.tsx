import { useLogout } from "../../hooks/auth/useLogout"

const LogoutButton = () => {
  const { mutate: logout, isPending } = useLogout()

  return (
    <button
      type="button"
      onClick={() => logout()}
      disabled={isPending}
      className="flex w-full cursor-pointer items-center gap-3 border-2 border-black bg-coral px-3 py-3 text-left text-xs leading-tight uppercase shadow-hard transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black disabled:pointer-events-none disabled:opacity-60 md:text-[13px] xl:max-2xl:py-2"
    >
      <i className="bi bi-box-arrow-right text-base" aria-hidden="true" />
      {isPending ? "Saliendo..." : "Cerrar sesión"}
    </button>
  )
}

export default LogoutButton
