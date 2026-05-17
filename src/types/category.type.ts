export type CategoryStatus = "ACTIVE" | "INACTIVE";

export interface Category {
    id: number;
    name: string;
    status: CategoryStatus;
}
