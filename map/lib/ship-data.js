export const SHIPS = [
  {
    id: "ship-9",
    name: "GULF PIONEER",
    flag: "🇰🇼",
    flagCode: "KW",
    type: "Oil Tanker",
    lat: 29.15, // Current location: Just outside Kuwait Bay, starting the journey!
    lng: 48.35,
    course: 135, // Heading South-East down the Persian Gulf
    speed: "12.5 knots",
    latStr: "29°09′N",
    lngStr: "048°21′E",
    status: "Underway using Engine",
    origin: { 
      lat: 29.35, // Exact coordinate of Kuwait's Shuwaikh Port
      lng: 47.93, 
      label: "KUWAIT PORT", 
      time: "ATD: Apr 06, 08:00 UTC" 
    },
    destination: { 
      lat: 1.25,  
      lng: 103.85, 
      label: "SINGAPORE", 
      time: "ETA: Apr 20, 12:00 UTC" 
    },
    progress: 5, // Only 5% into the trip
    mmsi: "448000000",
    imo: "9123456",
    color: "#f59e0b", 
  },
  {
    id: "ship-8",
    name: "TAIPEI TRADER",
    flag: "🇹🇼",
    flagCode: "TW",
    type: "Container Ship",
    lat: 10.5, // Current location: South China Sea
    lng: 110.0,
    course: 210, // Heading South-West towards the Malacca Strait
    speed: "15.2 knots",
    latStr: "10°30′N",
    lngStr: "110°00′E",
    status: "Underway using Engine",
    origin: {
      lat: 22.61,
      lng: 120.28,
      label: "KAOHSIUNG",
      time: "ATD: Apr 01, 08:00 UTC"
    },
    destination: {
      lat: 18.95,
      lng: 72.83,
      label: "MUMBAI",
      time: "ETA: Apr 15, 12:00 UTC"
    },
    progress: 30,
    mmsi: "416000000",
    imo: "9876543",
    color: "#ec4899", // Bright pink so it stands out on the map
  },
{
    id: "ship-7",
    name: "NAGOYA EXPRESS",
    flag: "🇯🇵",
    flagCode: "JP",
    type: "Container Ship",
    lat: 34.0, // Current location: Just off the coast of Japan
    lng: 138.5,
    course: 220, 
    speed: "16.4 knots",
    latStr: "34°00′N",
    lngStr: "138°30′E",
    status: "Underway using Engine",
    origin: {
      lat: 35.44,
      lng: 139.65,
      label: "YOKOHAMA",
      time: "ATD: Apr 01, 10:00 UTC"
    },
    // NEW: The middle destination!
    waypoints: [
      {
        lat: 1.25, 
        lng: 103.85,
        label: "SINGAPORE (Bunkering Stop)"
      }
    ],
    destination: {
      lat: -6.82,
      lng: 39.28,
      label: "DAR ES SALAAM",
      time: "ETA: Apr 22, 14:00 UTC"
    },
    progress: 5, 
    mmsi: "431000000",
    imo: "9300000",
    color: "#ef4444", 
  },
  {
    id: "ship-1",
    name: "EVER GIVEN",
    flag: "🇵🇦",
    flagCode: "PA",
    type: "Container Ship",
    lat: 29.92,
    lng: 32.55,
    course: 145,
    speed: "14.2 knots",
    latStr: "29°55′N",
    lngStr: "32°33′E",
    status: "Underway using Engine",
    origin: { lat: 51.9, lng: 4.47, label: "ROTTERDAM", time: "ATD: Mar 15, 06:00 UTC" },
    destination: { lat: 1.29, lng: 103.85, label: "SINGAPORE", time: "ETA: Apr 02, 14:00 UTC" },
    progress: 63,
    mmsi: "353136000",
    imo: "9811000",
    color: "#3b82f6",
    forecastPath: [
      [29.92, 32.55],   // Current Location (Suez)
      [27.0, 34.5],     // Middle of Red Sea
      [12.5, 43.3],     // Bab-el-Mandeb Strait
      [10.0, 55.0],     // Arabian Sea
      [5.0, 80.0],      // Indian Ocean
      [6.0, 95.0],      // Andaman Sea
      [1.29, 103.85]    // Destination (Singapore)
    ]
  },
  {
    id: "ship-2",
    name: "MSC OSCAR",
    flag: "🇵🇦",
    flagCode: "PA",
    type: "Container Ship",
    lat: 48.2,
    lng: -12.73,
    course: 70,
    speed: "18.7 knots",
    latStr: "48°12′N",
    lngStr: "12°44′W",
    status: "Underway using Engine",
    origin: { lat: 40.71, lng: -74.0, label: "NEW YORK", time: "ATD: Mar 22, 09:00 UTC" },
    destination: { lat: 53.55, lng: 9.99, label: "HAMBURG", time: "ETA: Apr 01, 18:00 UTC" },
    progress: 41,
    mmsi: "215466000",
    imo: "9703291",
    color: "#06b6d4",
  },
  {
    id: "ship-3",
    name: "PIONEER SPIRIT",
    flag: "🇸🇬",
    flagCode: "SG",
    type: "Tanker",
    lat: 57.5,
    lng: 3.2,
    course: 340,
    speed: "11.3 knots",
    latStr: "57°30′N",
    lngStr: "3°12′E",
    status: "Underway using Engine",
    origin: { lat: 51.9, lng: 4.47, label: "ROTTERDAM", time: "ATD: Mar 28, 14:00 UTC" },
    destination: { lat: 59.91, lng: 10.75, label: "OSLO", time: "ETA: Mar 30, 08:00 UTC" },
    progress: 78,
    mmsi: "566914000",
    imo: "9732270",
    color: "#f97316",
  },
  {
    id: "ship-4",
    name: "OASIS OF SEAS",
    flag: "🇧🇸",
    flagCode: "BS",
    type: "Passenger",
    lat: 25.77,
    lng: -77.9,
    course: 200,
    speed: "22.1 knots",
    latStr: "25°46′N",
    lngStr: "77°54′W",
    status: "Underway using Engine",
    origin: { lat: 25.77, lng: -80.19, label: "MIAMI", time: "ATD: Mar 29, 16:00 UTC" },
    destination: { lat: 25.05, lng: -77.35, label: "NASSAU", time: "ETA: Mar 30, 08:00 UTC" },
    progress: 55,
    mmsi: "311046000",
    imo: "9383948",
    color: "#22c55e",
  },
  {
    id: "ship-5",
    name: "VALE BRASIL",
    flag: "🇧🇷",
    flagCode: "BR",
    type: "Bulk Carrier",
    lat: -8.5,
    lng: -25.0,
    course: 55,
    speed: "9.8 knots",
    latStr: "8°30′S",
    lngStr: "25°00′W",
    status: "At Anchor",
    origin: { lat: -23.96, lng: -46.33, label: "SANTOS", time: "ATD: Mar 20, 11:00 UTC" },
    destination: { lat: 14.69, lng: -17.44, label: "DAKAR", time: "ETA: Apr 05, 06:00 UTC" },
    progress: 29,
    mmsi: "710307000",
    imo: "9441710",
    color: "#eab308",
  },
  {
    id: "ship-6",
    name: "PACIFIC ARIA",
    flag: "🇵🇭",
    flagCode: "PH",
    type: "Cargo",
    lat: 20.5,
    lng: 118.3,
    course: 100,
    speed: "13.5 knots",
    latStr: "20°30′N",
    lngStr: "118°18′E",
    status: "Underway using Engine",
    origin: { lat: 22.3, lng: 114.17, label: "HONG KONG", time: "ATD: Mar 27, 08:00 UTC" },
    destination: { lat: 14.6, lng: 120.97, label: "MANILA", time: "ETA: Mar 31, 12:00 UTC" },
    progress: 47,
    mmsi: "548246000",
    imo: "9594111",
    color: "#a78bfa",
  },
];