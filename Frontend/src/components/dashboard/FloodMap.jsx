/* eslint-disable no-unused-vars */
import { useEffect, useRef } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Home from "@arcgis/core/widgets/Home";
import ScaleBar from "@arcgis/core/widgets/ScaleBar";
import Zoom from "@arcgis/core/widgets/Zoom";
import { zoomToCountry } from "../../utils/mapHelpers";
import "./FloodMap.css";
import "@arcgis/core/assets/esri/themes/light/main.css";
// import "@arcgis/core/assets/esri/themes/dark/main.css";

function FloodMap({ onLayerLoad, onViewLoad, onCountryClick, onPointSelect }) {
  const mapDiv = useRef(null);
  const viewRef = useRef(null);
  const mapRef = useRef(null);
  const isInitialized = useRef(false);
  const pointGraphicsLayerRef = useRef(null);

  useEffect(() => {
    if (!mapDiv.current || isInitialized.current) return;

    isInitialized.current = true;
    let isMounted = true;

    const map = new Map({
      basemap: "streets-vector",
    });

    mapRef.current = map;

    // Create a graphics layer for point markers
    const pointGraphicsLayer = new GraphicsLayer({
      id: "pointLayer",
      title: "Analysis Points",
    });
    map.add(pointGraphicsLayer);
    pointGraphicsLayerRef.current = pointGraphicsLayer;

    const view = new MapView({
      container: mapDiv.current,
      map: map,
      center: [0, 20],
      zoom: 2,
      ui: {
        components: ["attribution"],
      },
      constraints: {
        rotationEnabled: false,
        minZoom: 2,
        maxZoom: 18,
      },
    });

    viewRef.current = view;

    view
      .when(() => {
        // Remove default attribution
        view.ui.remove("attribution");

        // Add Zoom widget (+ and - buttons)
        const zoomWidget = new Zoom({
          view: view,
        });
        view.ui.add(zoomWidget, {
          position: "top-left",
        });

        // Add Home widget
        const homeWidget = new Home({
          view: view,
        });
        view.ui.add(homeWidget, {
          position: "top-left",
        });

        // Add Scale Bar widget
        const scaleBar = new ScaleBar({
          view: view,
          unit: "metric",
        });
        view.ui.add(scaleBar, {
          position: "bottom-left",
        });

        view.on("click", (event) => {
          // Get the coordinates from the click event
          const mapPoint = view.toMap({ x: event.x, y: event.y });
          const lat = mapPoint.latitude;
          const lon = mapPoint.longitude;

          // Check if user clicked on an existing feature or empty space
          view.hitTest(event).then((response) => {
            // Check if clicked on the graphics layer (analysis point)
            const pointLayerHit = response.results.find(
              (result) =>
                result.graphic.layer && result.graphic.layer.id === "pointLayer"
            );

            if (pointLayerHit) {
              // Clicked on existing point - do nothing or handle differently
              return;
            }

            // Check if clicked on a country feature
            if (response.results.length > 0) {
              const graphic = response.results[0].graphic;

              if (
                graphic.layer &&
                graphic.layer.title !== "World Hillshade" &&
                graphic.layer.id !== "pointLayer"
              ) {
                const countryName = graphic.attributes.COUNTRY;

                if (onCountryClick && countryName) {
                  onCountryClick(countryName);
                }

                zoomToCountry(view, graphic.geometry).catch((error) => {
                  console.error("Error zooming to clicked country:", error);
                });
                return;
              }
            }

            pointGraphicsLayer.removeAll();

            const haloSymbol = {
              type: "simple-marker",
              style: "circle",
              color: [0, 122, 194, 0.25],
              size: "32px",
              outline: null,
            };

            const pointSymbol = {
              type: "simple-marker",
              style: "circle",
              color: [0, 122, 194],
              size: "18px",
              outline: {
                color: [255, 255, 255],
                width: 1.5,
              },
            };

            const haloGraphic = new Graphic({
              geometry: mapPoint,
              symbol: haloSymbol,
            });

            const pointGraphic = new Graphic({
              geometry: mapPoint,
              symbol: pointSymbol,
              attributes: {
                latitude: lat,
                longitude: lon,
              },
            });

            pointGraphicsLayer.addMany([haloGraphic, pointGraphic]);

            if (onPointSelect) {
              onPointSelect({ latitude: lat, longitude: lon });
            }

            console.log(
              `Analysis point added at: Lat ${lat.toFixed(
                6
              )}, Lon ${lon.toFixed(6)}`
            );
          });
        });

        if (onViewLoad) {
          onViewLoad(view);
        }
      })
      .catch((error) => {
        console.error("Error initializing view:", error);
      });

    // TODO: Replace with flood-specific feature layer URL
    // const floodLayer = new FeatureLayer({
    //   url: "https://services3.arcgis.com/UDCw00RKDRKPqASe/arcgis/rest/services/WorldPopulationFrom_1970_To_2022/FeatureServer/0",
    //   outFields: ["*"],
    //   popupEnabled: false,
    // });

    // map.add(floodLayer);

    // floodLayer
    //   .when(() => {
    //     if (!isMounted) return;
    //     if (onLayerLoad) {
    //       onLayerLoad(floodLayer);
    //     }
    //   })
    //   .catch((error) => {
    //     if (!isMounted) return;
    //     console.error("Error loading layer:", error);
    //   });

    return () => {
      isMounted = false;
      isInitialized.current = false;

      if (viewRef.current) {
        viewRef.current.container = null;
        viewRef.current.destroy();
        viewRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mapDiv} className="map-view"></div>;
}

export default FloodMap;
