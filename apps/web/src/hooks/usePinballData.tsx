import { useState, useEffect } from 'react';
import axios from 'axios';
import type { RegionData, PinballData, Error } from '../models/pinball';

const usePinballData = (
  lat: string,
  lon: string
): {
  closestRegion: RegionData | undefined;
  pinballMachines: PinballData[] | undefined;
  loading: boolean;
  error: Error | null; 
} => {
  const [closestRegion, setClosestRegion] = useState<RegionData | undefined>(undefined);
  const [pinballMachines, setPinballMachines] = useState<PinballData[] | undefined>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch closest region based on lat and lon
        const closestRegionResponse = await axios.get(
          `https://pinballmap.com/api/v1/regions/closest_by_lat_lon.json?lat=${lat}&lon=${lon}`
        );

        if((closestRegionResponse?.data as { errors?: string })?.errors){
            setError({
                message: (closestRegionResponse?.data as { errors?: string })?.errors,
                details: '',
              });
        }
        else{
            const closestRegionData: RegionData | undefined = (closestRegionResponse?.data as { region?: RegionData })?.region;

            setClosestRegion(closestRegionData);

            if(closestRegionData?.name){
                const pinballMachinesResponse = await axios.get(
                `https://pinballmap.com/api/v1/region/${closestRegionData?.name}/location_machine_xrefs`
                );
                console.log('wt4: ', pinballMachinesResponse);
                console.log('wt got here 4');

                const pinballMachinesData: PinballData[] | undefined = (pinballMachinesResponse?.data as { location_machine_xrefs?: PinballData[] })?.location_machine_xrefs

                setPinballMachines(pinballMachinesData);
                setError(null);
            }
            else
                setError({
                    message: 'No region found.',
                    details: '',
                })
            setLoading(false);
        }
      } catch (ueErr) {
        setError({message: JSON.stringify(ueErr)});
        setLoading(false);
      }
    };

    fetchData().then(() => console.log('success!')).catch((fderr) => console.log('Fetch Data error: ', fderr));
  }, [lat, lon]);

  return { closestRegion, pinballMachines, loading, error };
};

export default usePinballData;
