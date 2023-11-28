import { useState, useEffect } from 'react';
import axios from 'axios';
import { RegionData, PinballData } from '../models/pinball';

const usePinballData = (
  lat: string,
  lon: string
): {
  closestRegion: RegionData | null;
  pinballMachines: PinballData[];
  loading: boolean;
  error: any; // replace 'any' with the actual error type if you have it
} => {
  const [closestRegion, setClosestRegion] = useState<RegionData | null>(null);
  const [pinballMachines, setPinballMachines] = useState<PinballData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('wt got here 1');
        // Fetch closest region based on lat and lon
        const closestRegionResponse = await axios.get(
          `https://pinballmap.com/api/v1/regions/closest_by_lat_lon.json?lat=${lat}&lon=${lon}`
        );
        console.log('wt3.0: ', closestRegionResponse);
        console.log('wt3: ', closestRegion);
        const closestRegionData: RegionData = closestRegionResponse.data.region;
        console.log('wt got here 2: ', closestRegionData);

        setClosestRegion(closestRegionData);

        if(closestRegionData?.name){
            console.log('wt got here 3');
            // Fetch pinball machines for the closest region
            const pinballMachinesResponse = await axios.get(
            `https://pinballmap.com/api/v1/region/${closestRegionData?.name}/location_machine_xrefs`
            );
            console.log('wt4: ', pinballMachinesResponse);
            console.log('wt got here 4');

            const pinballMachinesData: PinballData[] = pinballMachinesResponse.data.location_machine_xrefs;

            setPinballMachines(pinballMachinesData);
        }
        else
            setError({
                message: 'No region found.',
                details: 'Closest region data: ' + closestRegionData,
              })
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [lat, lon]);

  return { closestRegion, pinballMachines, loading, error };
};

export default usePinballData;
