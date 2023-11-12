'use client'

import { Suspense } from "react"

export default function Error(){
    return <Suspense fallback={<p>cargando error</p>}><p>Hay un error</p></Suspense>
}