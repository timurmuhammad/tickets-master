import { Itineraries, IDeal } from '../structure/itineraries'
import { getCookie } from 'cookies-next'
import cloneDeep from 'lodash/cloneDeep'

// Function to process tracking IDs
function generateTrackingData({ trackingId }) {
    const params = new URLSearchParams();
    // Assume trackingId could be comma-separated for multiple subids
    const trackingIds = trackingId.split(',').slice(0, 3); // Limit to 3 ids, as its an impact subid limit
    trackingIds.forEach((id, index) => {
        params.set(`subid${index + 1}`, id);
    });
    return '&' + params.toString()
}

function leg(legID: string, {legs, segments, places, carriers}: any) {
    const leg = legs[legID];
    if (!leg) {
        return undefined;
    }

    leg.segments = leg.segmentIds.map((segmentId: string) => ({...segments[segmentId], segmentId}));
    leg.segments = leg.segments.map((segment: any) => {
        segment.originPlace = places[segment.originPlaceId];
        segment.destinationPlace = places[segment.destinationPlaceId];
        segment.carrier = carriers[segment.operatingCarrierId];
        return segment;
    });
    leg.originPlace = places[leg.originPlaceId];
    leg.destinationPlace = places[leg.destinationPlaceId];
    leg.carriers = leg.operatingCarrierIds.map((operatingCarrierId: string) => ({...carriers[operatingCarrierId], operatingCarrierId}));
    leg.steps = [];

    if (leg.stopCount > 0) {
        for (let i = 0; i < leg.segments.length; i++) {
            const step = leg.segments[i]
            if (leg.segments[i + 1]) {
                const nextStep = leg.segments[i + 1]

                leg.steps.push(step)
                const newLeg = {
                    originPlace: step.destinationPlace,
                    transferPlace: null,
                    departureDateTime: nextStep.departureDateTime,
                    arrivalDateTime: step.arrivalDateTime,
                    transfer: true,
                }
                if (nextStep.originPlaceId != step.destinationPlaceId) {
                    newLeg.transferPlace = nextStep.originPlace
                }
                leg.steps.push(newLeg)
            } else {
                leg.steps.push(step);
            }
        }
    } else {
        leg.steps = [...leg.segments];
    }

    return leg;
}

function getMinPrice(itineraryId: string, {itineraries, agents}: any, filteredAgents: string[], trackingId: string | null) {
    const deals = []
    const dealsRaw = itineraries[itineraryId].pricingOptions;
    dealsRaw.map((deal: any, index: number) => {
        //filter out combined tickets and airlines
        if (deal.items.length == 1 && deal.price.amount) {
            const newDeal = { ... deal }
            newDeal.agents = deal.agentIds.map((agentId: string) => agents[agentId])
            newDeal.priceAmount = parseFloat(deal.price.amount) / 1000

            //add tracking ids to deep link
            if (trackingId) {
                const trackingData = generateTrackingData({ trackingId })
                newDeal.items[0].deepLink = deal.items[0].deepLink + trackingData
            }

            //filter out agents
            if (index == 0 || filteredAgents.length == 0 || filteredAgents.includes(newDeal.agents[0].name)) {
                deals.push(newDeal)
            }
        }
    })
    const minPrice = deals.length > 0 ? Math.min(...deals.map((deal: any) => deal.priceAmount)) : 0

    return { deals, minPrice }
}

export interface ParsedData {
    itineraryId: string
    outbound: Itineraries
    inbound?: Itineraries
    deals: IDeal[]
    minPrice: number
    durationInMinutes: number
    bestScore: number
}

export const parseSearchResults = (rawData: any, filterAgents: boolean = false): ParsedData[] => {
    const newRawData = cloneDeep(rawData)
    const source = newRawData.content.results
    const sorting = newRawData.content.sortingOptions
    
    const filteredAgentsInitial = process.env.NEXT_PUBLIC_FILTERED_AGENTS ? JSON.parse(process.env.NEXT_PUBLIC_FILTERED_AGENTS) : []
    const filteredAgentsAdditional = process.env.NEXT_PUBLIC_ADDITIONAL_FILTERED_AGENTS ? JSON.parse(process.env.NEXT_PUBLIC_ADDITIONAL_FILTERED_AGENTS) : []
    const filteredAgents = filterAgents ? [...filteredAgentsInitial, ...filteredAgentsAdditional] : []

    const trackingIdCookie = getCookie('trackingId')
    const trackingId = trackingIdCookie ? JSON.parse(trackingIdCookie) : null

    const data: ParsedData[] = []
    for (const itineraryId in source.itineraries) {
        const { legIds } = source.itineraries[itineraryId];
        const [outboundLegId, inboundLegId] = legIds;

        const outbound = leg(outboundLegId, source)
        const inbound = leg(inboundLegId, source)
        const { deals, minPrice } = getMinPrice(itineraryId, source, filteredAgents, trackingId)

        const inboundDurationInMinutes = inbound ? inbound.durationInMinutes : 0
        const durationInMinutes = outbound.durationInMinutes + inboundDurationInMinutes

        const bestScore = sorting.best.find(item => item.itineraryId === itineraryId)?.score
        if (minPrice > 0) {
            data.push({ itineraryId, outbound, inbound, deals, minPrice, durationInMinutes, bestScore })
        }
    }
    return data;
}