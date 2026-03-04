export interface IService {
    id: string;
    name: string;
    price: number;
    duration: number;
    barberIds?: string[];
    barbers?: {
        id: string;
        name: string;
    }[];
}