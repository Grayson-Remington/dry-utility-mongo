import { useEffect } from "react";
import { loadModules } from "esri-loader";
import Upload from "./Upload";

const MapComponent = (data: any) => {
  let { projectNumber } = data;
  function replaceSpacesWithPluses(inputString: any) {
    // Use the replace method with a regular expression to replace all spaces with pluses
    return inputString.replace(/ /g, "+");
  }
  let updatedProjectNumber = replaceSpacesWithPluses(projectNumber);

  useEffect(() => {
    loadModules(["esri/Map", "esri/views/MapView", "esri/layers/KMLLayer"])
      .then(([Map, MapView, KMLLayer]) => {
        const map = new Map({
          basemap: "satellite",
        });

        const view = new MapView({
          container: "viewDiv",
          map,
          center: [-77.434769, 37.54129], // Replace with the desired center coordinates
          zoom: 5,
          ui: {
            components: [], // Remove all default UI components
          },
        });

        const kmlLayer = new KMLLayer({
          url: `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.amazonaws.com/${updatedProjectNumber}/${updatedProjectNumber}.kmz`, // Replace with the actual path to your KMZ file
        });

        map.add(kmlLayer);
        kmlLayer.load().then(function () {
          // Get the extent of the KML layer
          var extent = kmlLayer.fullExtent;

          // Zoom to the extent of the KML layer
          view.goTo(extent);
        });
      })
      .catch((err) => {});
  }, [updatedProjectNumber]);

  return (
    <div className='w-full max-w-4xl rounded-b-lg'>
      <Upload projectNumber={projectNumber} />
      <div id='viewDiv' className='h-[450px] w-full rounded-b-lg' />
    </div>
  );
};

export default MapComponent;
