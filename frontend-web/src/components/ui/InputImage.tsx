import { useEffect, useRef, useState, type ChangeEvent } from "react"

type InputImageProps = {
  id: string
  name: string
  label: string
  maxSizeMB?: number
  error?: string
  onChange?: (file: File | null) => void
}

const btn = "cursor-pointer rounded-full border-2 border-black bg-green px-3 py-1 text-xs font-bold focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black"

const InputImage = ({ id, name, label, maxSizeMB = 5, error, onChange }: InputImageProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [localError, setLocalError] = useState("")

  // libera la URL del preview al cambiarla o desmontar
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  const pick = (file: File | null) => {
    setPreview(file ? URL.createObjectURL(file) : null)
    onChange?.(file)
  }

  const clear = () => {
    if (inputRef.current) inputRef.current.value = "" // el input nativo también se vacía (FormData)
    pick(null)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return clear()

    if (!file.type.startsWith("image/")) {
      clear()
      return setLocalError("El archivo tiene que ser una imagen")
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      clear()
      return setLocalError(`La imagen no puede pesar más de ${maxSizeMB} MB`)
    }
    setLocalError("")
    pick(file)
  }

  const shownError = error || localError

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-bold tracking-wide uppercase">{label}</label>
      <div className="flex items-center gap-3 rounded-xl border-2 border-black bg-button px-3 py-2 shadow-hard">
        <input ref={inputRef} id={id} name={name} type="file" accept="image/*" tabIndex={-1} onChange={handleChange} className="sr-only" />
        {preview
          ? <img src={preview} alt="Vista previa" className="size-10 shrink-0 rounded-full border-2 border-black object-cover" />
          : <span className="text-xs">Ninguna imagen</span>}
        <div className="ml-auto flex gap-2">
          <button type="button" onClick={() => inputRef.current?.click()} className={btn}>{preview ? "Cambiar" : "Elegir"}</button>
          {preview && <button type="button" onClick={clear} className={btn}>Quitar</button>}
        </div>
      </div>
      {shownError && <p role="alert" className="text-xs font-bold">{shownError}</p>}
    </div>
  )
}

export default InputImage
