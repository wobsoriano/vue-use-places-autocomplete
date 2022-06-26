const getGeocode = (args: google.maps.GeocoderRequest): Promise<google.maps.GeocoderResult[]> => {
  const geocoder = new window.google.maps.Geocoder();
  const { OK } = window.google.maps.GeocoderStatus;

  return new Promise((resolve, reject) => {
    geocoder.geocode(
      args,
      (
        results: google.maps.GeocoderResult[] | null,
        status: google.maps.GeocoderStatus,
      ) => {
        if (status !== OK) return reject(status);

        return resolve(results || []);
      }
    );
  });
};

export default getGeocode;