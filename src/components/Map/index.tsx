import React from 'react';
import { GoogleMap, LoadScript, InfoWindow } from '@react-google-maps/api';
import { Box, Stack } from '@mui/material';
import {
	MarkerClusterer,
	Cluster,
	ClusterStats,
	DefaultRenderer,
} from '@googlemaps/markerclusterer';

export interface UIMarker {
	id: string | number;
	lat: number;
	lng: number;
	title?: string;
	icon?: string;
	click?: () => void;
}

// Coordinates of Seattle, avoid having the map centered in the middle of the sea
const DEFAULT_LATLNG = {
	lat: 47.6062,
	lng: -122.3321,
};
const DEFAULT_ZOOM_LEVEL = 3;
const DETAIL_ZOOM_LEVEL = 12;

const defaultMapOptions: google.maps.MapOptions = {
	controlSize: 32,
	scrollwheel: false,
	disableDefaultUI: true,
	zoomControl: true,
	mapTypeControl: false,
	mapTypeControlOptions: {
		mapTypeIds: ['roadmap', 'hybrid'],
	},
	styles: [
		{
			elementType: 'all',
			featureType: 'all',
			stylers: [{ saturation: -50 }],
		},
		{
			elementType: 'all',
			featureType: 'administrative.country',
			stylers: [{ gamma: 2 }],
		},
		{
			elementType: 'all',
			featureType: 'administrative.locality',
			stylers: [{ gamma: 1.5 }],
		},
	],
};

// Return map bounds based on list of markers
const getMapBounds = (markers: UIMarker[]) => {
	const bounds = new google.maps.LatLngBounds();

	markers.forEach((marker) => {
		bounds.extend(
			new google.maps.LatLng(
				isNaN(marker.lat) ? 0 : marker.lat,
				isNaN(marker.lng) ? 0 : marker.lng,
			),
		);
	});
	return bounds;
};

// Fit map to its bounds after the API is loaded
const onGoogleMapsApiLoad = (map: google.maps.Map, markers: UIMarker[]) => {
	if (!markers.length) {
		map.setCenter(DEFAULT_LATLNG);
		map.setZoom(DEFAULT_ZOOM_LEVEL);
	} else {
		const bounds = getMapBounds(markers);
		map.fitBounds(bounds);
	}

	// These options depend on the global "google" object, so we set it once the API has loaded.
	map.setOptions({
		zoomControlOptions: {
			position: google.maps.ControlPosition.TOP_RIGHT,
		},
	});

	// If we run `setZoom` right after `fitBounds` the map won't refresh. With this we first wait for the map to be idle (from fitBounds), and then set the zoom level.
	const listener = google.maps.event.addListenerOnce(map, 'idle', () => {
		// Don't allow to zoom closer than the default detail zoom level on initial load.
		const currentZoom = map.getZoom();
		if (currentZoom != null && currentZoom > DETAIL_ZOOM_LEVEL) {
			map.setZoom(DETAIL_ZOOM_LEVEL);
		}

		google.maps.event.removeListener(listener);
	});
};

const getFieldFromMap = <T extends any>(
	entry: T,
	fieldName: keyof MapProps<T>['dataMap'],
	dataMap: MapProps<T>['dataMap'],
) => {
	if (!dataMap[fieldName]) {
		return undefined;
	}

	if (typeof dataMap[fieldName] === 'string') {
		return entry[dataMap[fieldName] as keyof T];
	}

	if (typeof dataMap[fieldName] === 'function') {
		return (dataMap[fieldName] as (entry: T) => any)(entry);
	}
};

const BaseMap = <T extends any>({
	className,
	data = [],
	dataMap,
	getIcon,
	onItemClick,
	apiKey,
	mapClick,
}: MapProps<T>) => {
	const markersData = React.useMemo(
		() =>
			data
				.map((entry) => {
					const marker: Partial<UIMarker> = {
						lng: getFieldFromMap(entry, 'lng', dataMap),
						lat: getFieldFromMap(entry, 'lat', dataMap),
						id: getFieldFromMap(entry, 'id', dataMap),
						title: getFieldFromMap(entry, 'title', dataMap),
						icon: getIcon ? getIcon(entry) : undefined,
						click: onItemClick ? () => onItemClick(entry) : undefined,
					};

					if (
						isNaN(Number(marker.lng)) ||
						isNaN(Number(marker.lat)) ||
						!marker.id
					) {
						return null;
					}

					return marker as UIMarker;
				})
				.filter((x): x is UIMarker => !!x),
		[data, dataMap, getIcon, onItemClick],
	);

	const mapRef = React.useRef<google.maps.Map | null>(null);
	const markerClustererRef = React.useRef<MarkerClusterer | null>(null);
	const markersRef = React.useRef<google.maps.Marker[]>([]);

	const [infoWindowData, setInfoWindowData] = React.useState<{
		position: google.maps.LatLng | google.maps.LatLngLiteral;
		content: React.ReactNode;
	} | null>(null);

	const onMapLoad = React.useCallback(
		(map: google.maps.Map) => {
			onGoogleMapsApiLoad(map, markersData);
			mapRef.current = map;

			const googleMarkers = markersData.map((marker) => {
				const googleMarker = new google.maps.Marker({
					position: { lat: marker.lat, lng: marker.lng },
					title: marker.title,
					icon: marker.icon,
				});

				if (marker.click) {
					googleMarker.addListener('click', marker.click);
				}

				return googleMarker;
			});

			markersRef.current = googleMarkers;

			markerClustererRef.current = new MarkerClusterer({
				markers: googleMarkers,
				map,
				renderer: {
					render(
						cluster: Cluster,
						stats: ClusterStats,
						map: google.maps.Map,
					): google.maps.Marker {
						const defaultRenderer = new DefaultRenderer();
						const marker = defaultRenderer.render(
							cluster,
							stats,
							map,
						) as google.maps.Marker;
						marker.addListener('mouseover', () => {
							setInfoWindowData({
								position: cluster.position,
								content: (
									<Box p="2">
										{cluster.markers?.map((marker: any) => {
											const onClick = markersData.find(
												(m) => m.title === marker.title,
											)?.click;
											return (
												<Stack
													direction="row"
													alignItems="center"
													sx={{ cursor: onClick ? 'pointer' : 'inherit' }}
													onClick={onClick}
												>
													<img src={marker.icon} />
													{marker.title}
												</Stack>
											);
										})}
									</Box>
								),
							});
						});

						return marker;
					},
				},
			});
		},
		[markersData, onItemClick],
	);

	React.useEffect(() => {
		if (mapRef.current && markerClustererRef.current) {
			markerClustererRef.current.clearMarkers();

			const newGoogleMarkers = markersData.map((marker) => {
				const googleMarker = new google.maps.Marker({
					position: { lat: marker.lat, lng: marker.lng },
					title: marker.title,
					icon: marker.icon,
				});

				if (marker.click) {
					googleMarker.addListener('click', marker.click);
				}

				return googleMarker;
			});

			markersRef.current = newGoogleMarkers;

			markerClustererRef.current.addMarkers(newGoogleMarkers);
		}
	}, [markersData]);

	React.useEffect(() => {
		return () => {
			if (markerClustererRef.current) {
				markerClustererRef.current.clearMarkers();
			}
			markersRef.current.forEach((marker) => marker.setMap(null));
		};
	}, []);

	if (!data.length || !markersData.length) {
		return null;
	}

	return (
		<Box height="100%" className={className}>
			{apiKey && (
				<LoadScript googleMapsApiKey={apiKey} version="3" language="en">
					<GoogleMap
						mapContainerStyle={{
							height: '100%',
							minHeight: '300px',
							opacity: 1,
						}}
						options={defaultMapOptions}
						onLoad={onMapLoad}
						onClick={mapClick}
					>
						{infoWindowData && (
							<InfoWindow
								position={infoWindowData.position}
								onCloseClick={() => setInfoWindowData(null)}
							>
								{infoWindowData.content}
							</InfoWindow>
						)}
					</GoogleMap>
				</LoadScript>
			)}
		</Box>
	);
};

// Make name optional, and override onChange to not be of `any` type.
export interface MapProps<T> extends React.HTMLAttributes<HTMLElement> {
	/** Google maps API key */
	apiKey: string;
	/** Passes the data that you wish to be used as a basis for rendering the map pins */
	data: T[];
	/** A mapping object between your data and location-specific fields (like latitude) */
	dataMap: {
		lat: keyof T | ((item: T) => number | undefined);
		lng: keyof T | ((item: T) => number | undefined);
		id: keyof T | ((item: T) => number | string | undefined);
		title: keyof T | ((item: T) => string | undefined);
	};
	/** Function that returns an icon based on the data entry */
	getIcon?: (item: T) => string | undefined;
	/** Callback function when an item on the map was clicked */
	onItemClick?: (item: T) => void;
	/** Event triggered on map click that includes the clicked location's longitude and latitude */
	mapClick?: (e: google.maps.MapMouseEvent) => void;
}

/** [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Map/Map.stories.tsx) */
export const Map = BaseMap;
