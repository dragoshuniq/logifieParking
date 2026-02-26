import { Colors } from "@/constants/theme";

export const getDarkMapStyle = () => {
  return [
    {
      elementType: "geometry",
      stylers: [
        {
          color: Colors.dark.content1.DEFAULT, // #18181b
        },
      ],
    },
    {
      elementType: "labels.text.fill",
      stylers: [
        {
          color: Colors.dark.content4.DEFAULT, // #52525b
        },
      ],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: Colors.dark.background, // #000000
        },
      ],
    },
    {
      featureType: "administrative.country",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: Colors.dark.content3.DEFAULT, // #3f3f46
        },
      ],
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: Colors.dark.content4.DEFAULT,
        },
      ],
    },
    {
      featureType: "administrative.province",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: Colors.dark.content3.DEFAULT,
        },
      ],
    },
    {
      featureType: "landscape.man_made",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: Colors.dark.content2.DEFAULT, // #27272a
        },
      ],
    },
    {
      featureType: "landscape.natural",
      elementType: "geometry",
      stylers: [
        {
          color: Colors.dark.content1.DEFAULT,
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [
        {
          color: Colors.dark.content2.DEFAULT,
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: Colors.dark.content4.DEFAULT,
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: Colors.dark.background,
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "geometry.fill",
      stylers: [
        {
          color: Colors.dark.success[50], // #073c1e (Darkest Green)
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: Colors.dark.success[800], // #b9efd1 (Light Green)
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        {
          color: Colors.dark.content2.DEFAULT,
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: Colors.dark.content4.DEFAULT,
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: Colors.dark.background,
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [
        {
          color: Colors.dark.content3.DEFAULT,
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: Colors.dark.content3.DEFAULT,
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: Colors.dark.content4.foreground, // #fff
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: Colors.dark.background,
        },
      ],
    },
    {
      featureType: "transit",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: Colors.dark.content4.DEFAULT,
        },
      ],
    },
    {
      featureType: "transit",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: Colors.dark.background,
        },
      ],
    },
    {
      featureType: "transit.line",
      elementType: "geometry.fill",
      stylers: [
        {
          color: Colors.dark.content3.DEFAULT,
        },
      ],
    },
    {
      featureType: "transit.station",
      elementType: "geometry",
      stylers: [
        {
          color: Colors.dark.content3.DEFAULT,
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: Colors.dark.background,
        },
      ],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: Colors.dark.content4.DEFAULT,
        },
      ],
    },
  ];
};
