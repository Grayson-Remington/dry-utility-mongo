import { useEffect } from "react";
import { loadModules } from "esri-loader";
import Upload from "./Upload";

const MapComponent = ({ projectNumber, files }: any) => {
  function replaceSpacesWithPluses(inputString: any) {
    // Use the replace method with a regular expression to replace all spaces with pluses
    return inputString.replace(/ /g, "+");
  }
  console.log(files);
  function replaceSpacesWithPlus(inputString: any) {
    // Use the replace() method with a regular expression to replace spaces with "+"
    var replacedString = inputString.replace(/ /g, "+");
    return replacedString;
  }
  let updatedProjectNumber = replaceSpacesWithPluses(projectNumber);
  function findFirstKmzFile(files: any) {
    for (const file of files) {
      if (file.Key.includes(".kmz")) {
        return file;
      }
    }
    return null; // Return null if no .kmz file is found
  }
  useEffect(() => {
    loadModules([
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/KMLLayer",
      "esri/layers/GraphicsLayer",
      "esri/Graphic",
      "esri/symbols/TextSymbol",
      "esri/Color",
    ])
      .then(
        ([
          Map,
          MapView,
          KMLLayer,
          GraphicsLayer,
          Graphic,
          TextSymbol,
          Color,
        ]) => {
          const map = new Map({
            basemap: "satellite",
          });

          const view = new MapView({
            container: "viewDiv",
            map: map, // Pass the map instance
            center: [-77.434769, 37.54129],
            zoom: 5,
            ui: {
              components: [],
            },
          });

          // Create a GraphicsLayer for labels

          const kmlLayer = new KMLLayer({
            url: `https://${
              process.env.NEXT_PUBLIC_S3_BUCKET_NAME
            }.s3.amazonaws.com/${replaceSpacesWithPlus(
              findFirstKmzFile(files).Key
            )}`,
          });

          map.add(kmlLayer);

          kmlLayer.load().then(() => {
            // Get the extent of the KML layer
            var extent = kmlLayer.fullExtent;

            view.goTo(extent);
          });
        }
      )
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
