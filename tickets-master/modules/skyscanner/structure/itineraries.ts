export interface ICarrier {
    allianceId: string;
    iata: string;
    imageUrl: string;
    name: string;
    operatingCarrierId: string;
}

export interface IDateTime {
    day: number;
    hour: number;
    minute: number;
    month: number;
    second: number;
    year: number;
}

export interface IPlace {
    entityId: string;
    iata: string;
    name: string;
    parentId: string;
    type: string;
}

export interface IStep {
    arrivalDateTime: IDateTime;
    departureDateTime: IDateTime;
    durationInMinutes: number;
    originPlace: IPlace;
    transferPlace?: IPlace;
    destinationPlace: IPlace;
    transfer?: boolean;
}

export interface IAgent {
    feedbackCount: number;
    imageUrl: string;
    name: string;
    rating: number;
}

export interface IDealItem {
    deepLink: string;
}

export interface IDeal {
    priceAmount: string;
    agents: IAgent;
    items: IDealItem[];
}

export interface Itineraries {
    arrivalDateTime: IDateTime;
    carriers: ICarrier[];
    departureDateTime: IDateTime;
    destinationPlace: IPlace;
    durationInMinutes: number;
    originPlace: IPlace;
    steps: IStep[];
    stopCount: number;
}