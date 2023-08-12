export const MapboxService = {
  /** thowaway token */
  token:
    "pk.eyJ1IjoiYXNkZmFzZGZkZmciLCJhIjoiY2xsNmxzdDF5MG43MjNxbWtuMDRqZ3F2ciJ9.kKJFcApNhpPfmUtXJiNgow",
  image: {
    size: "1280x720",
    bounds: [50, 50, 10], // lng, lat, zoom
    blobUrl: null as null | string,
    onBlobUrlListeners: [] as ((url: string) => void)[],
    getBlobUrl: async () => {
      if (MapboxService.image.blobUrl)
        URL.revokeObjectURL(MapboxService.image.blobUrl);

      // prepare url
      const prefix =
        "https://api.mapbox.com/styles/v1/mapbox/streets-v12/static";
      const { bounds, size } = MapboxService.image;
      const { token } = MapboxService;
      const imageURL = `${prefix}/${bounds}/${size}?access_token=${token}`;

      // request
      try {
        const response = await fetch(imageURL);
        if (!response.ok) throw new Error("Error Fetching");
        const imageData = await response.blob();
        const blobURL = URL.createObjectURL(imageData);
        MapboxService.image.blobUrl = blobURL;
        MapboxService.image.onBlobUrlListeners.forEach((f) => f(blobURL));
        return blobURL;
      } catch (error) {
        return null;
      }
    },
  },
};
