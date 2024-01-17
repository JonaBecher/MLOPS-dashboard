export type Device = {
    id: string
    last_online: string | null
    created_at: string
    needsUpdate: boolean | null
    modelId: number | null
    online: boolean
}