'use client'

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { FileAdd } from "@/modules/icons"

export default function Thumbnail({ thumbnail_url, userId, onlyView = false }) {
    const [isHovered, setIsHovered] = useState(false)
    const supabase = createClientComponentClient()

    const handleUpload = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        // Generar un nombre único para el archivo
        const filePath = `${userId}/${Date.now()}-${file.name}`

        // Intentar subir el archivo al bucket "thumbnails"
        const { data: storageData, error: storageError } = await supabase
            .storage
            .from('images')
            .upload(filePath, file)

        if (storageError) {
            console.error('Error uploading file:', storageError)
            return
        }

        // Obtener la URL pública del archivo subido
        const { data: publicUrlData, error: publicUrlError } = await supabase
            .storage
            .from('images')
            .getPublicUrl(filePath)

        if (publicUrlError) {
            console.error('Error getting public URL:', publicUrlError)
            return
        }

        const publicUrl = publicUrlData.publicUrl

        // Actualizar el usuario con la nueva URL de la miniatura
        const { data: updateData, error: updateError } = await supabase
            .from('users')
            .update({ thumbnail: publicUrl })
            .eq('id', userId)

        if (updateError) {
            console.error('Error updating thumbnail:', updateError)
            return
        }

        // Recargar la página para reflejar los cambios
        window.location.reload()
    }
    return (
        <div
            className={`w-full h-96 z-10 bg-no-repeat bg-center ${thumbnail_url ? '' : 'bg-brand'} bg-cover`}
            style={{ backgroundImage: `url(${thumbnail_url})` }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isHovered & onlyView === false && (
                <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
                    <label className="cursor-pointer flex flex-col items-center text-white gap-2">
                        <FileAdd color="#ffffff" size="36" />
                        <span className="text-sm text-lightgray">We recommend a 385x720 px photo.</span>
                        <input type="file" className="hidden" onChange={handleUpload} />
                    </label>
                </div>
            )}
        </div>
    )
}
