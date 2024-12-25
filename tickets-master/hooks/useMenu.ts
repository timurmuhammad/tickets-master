import { useRecommendedUserLocation } from "@/hooks/useUserLocation"
import { hotelsLinks } from "@/data/expedia"

const useMenu = ({ menu }) => {
  const { recommendedFlightLocation } = useRecommendedUserLocation()

  if (!recommendedFlightLocation) {
    return menu;
  }

  return menu?.map(item => {
    const newItem = { ...item };
    if (newItem.title === 'hotels') {
      newItem.link = hotelsLinks.find(hotelsLinkItem => 
        hotelsLinkItem.countryIds.includes(recommendedFlightLocation.parentId)
      )?.affiliateLink ?? item.link;
    }
    return newItem;
  });
};

export default useMenu;