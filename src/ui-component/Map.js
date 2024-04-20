//google map
import GoogleMapReact from 'google-map-react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
const AnyReactComponent = ({ text }) => <div>{text}</div>;

const Map = (coords) => {
    return (
        <>
            <div style={{ height: '50vh', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: process.env.REACT_APP_MAP_API }}
                    defaultCenter={coords}
                    defaultZoom={15}
                    center={coords}
                >
                    <AnyReactComponent lat={coords?.lat} lng={coords?.lng} text={<LocationOnIcon color="error" />} />
                </GoogleMapReact>
            </div>
        </>
    );
};
export default Map;
