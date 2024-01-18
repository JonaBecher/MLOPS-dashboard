export type Project = {
    "name": string,
    "current_modelId": string | null,
    "version": number | null,
    "id": string
}

export type Stats = {
    "timestamp": string,
    "label": number,
    "count": number
}