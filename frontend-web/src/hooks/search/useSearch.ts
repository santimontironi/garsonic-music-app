import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { searchService } from "../../services/search.service";

export const useSearch = (term: string) => {
    const [q, setQ] = useState(term.trim())

    useEffect(() => {
        const timeout = setTimeout(() => setQ(term.trim()), 300)
        return () => clearTimeout(timeout)
    }, [term])

    return useQuery({
        queryKey: ["search", q],
        queryFn: () => searchService(q),
        enabled: q.length > 0, // esto hace que la query solo se ejecute si el termino de busqueda tiene al menos 1 caracter
        placeholderData: keepPreviousData, //esto hace que se mantenga la data anterior mientras se hace la nueva busqueda
    });
}
