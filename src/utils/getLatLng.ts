import type { LatLng } from '../types'

function getLatLng(result: google.maps.GeocoderResult): Promise<LatLng> {
  return new Promise((resolve, reject) => {
    try {
      const latLng = {
        lat: result.geometry.location.lat(),
        lng: result.geometry.location.lng(),
      }
      return resolve(latLng)
    }
    catch (e) {
      return reject(e)
    }
  })
}

export default getLatLng
