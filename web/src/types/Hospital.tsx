import Place from "./Place.tsx";

export default interface Hospital extends Place {
    city: string,
    countyCode: string
    url: string
    safe: boolean
}