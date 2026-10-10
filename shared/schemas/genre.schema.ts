import { z } from "zod";

// Debe coincidir con el enum GenreName de backend/prisma/schema.prisma
export const genreLabels = {
    ROCK: 'Rock',
    POP: 'Pop',
    HIP_HOP: 'Hip hop',
    TRAP: 'Trap',
    REGGAETON: 'Reggaetón',
    CUMBIA: 'Cumbia',
    CUARTETO: 'Cuarteto',
    TANGO: 'Tango',
    FOLK: 'Folklore',
    ELECTRONIC: 'Electrónica',
    JAZZ: 'Jazz',
    BLUES: 'Blues',
    RNB: 'R&B',
    SOUL: 'Soul',
    FUNK: 'Funk',
    METAL: 'Metal',
    PUNK: 'Punk',
    INDIE: 'Indie',
    CLASSICAL: 'Clásica',
    REGGAE: 'Reggae',
    OTHER: 'Otro',
}

export const genreNameSchema = z.enum(Object.keys(genreLabels) as [keyof typeof genreLabels], { message: 'El género es inválido' })

export const genreSchema = z.object({
    id: z.uuid(),
    name: genreNameSchema,
})
