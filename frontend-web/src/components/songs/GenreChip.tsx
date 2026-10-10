import type { UseFormRegisterReturn } from "react-hook-form"

type GenreChipProps = {
    label: string
    value: string
    registration: UseFormRegisterReturn
}

const GenreChip = ({ label, value, registration }: GenreChipProps) => {
    return (
        <label className="flex min-h-11 cursor-pointer items-center justify-center border-2 border-black bg-button px-3 py-2 text-center text-xs font-bold uppercase hover:bg-green has-checked:bg-black has-checked:text-button has-focus-visible:outline-4 has-focus-visible:outline-offset-2 has-focus-visible:outline-black">
            <input type="radio" value={value} {...registration} className="sr-only" />
            {label}
        </label>
    )
}

export default GenreChip
