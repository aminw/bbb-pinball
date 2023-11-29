export interface RegionData {
    id?: number;
    name?: string;
}
export interface PinballData {
    location?: {
        name?: string;
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
        lat?: string;
        lon?: string;
    }
}

export interface Error {
    message?: string;
    details?: string;
}