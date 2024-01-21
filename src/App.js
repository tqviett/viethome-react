import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';
import { ProtectedRoute } from 'hooks/protectedRoute';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer } from 'react-notifications';
import 'styles/_global.scss';
// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';

// ==============================|| APP ||============================== //

const App = () => {
    const customization = useSelector((state) => state.customization);

    return (
        <ProtectedRoute>
            <HelmetProvider>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={themes(customization)}>
                        <CssBaseline />
                        <NavigationScroll>
                            <Routes />
                            <NotificationContainer />
                        </NavigationScroll>
                    </ThemeProvider>
                </StyledEngineProvider>
            </HelmetProvider>
        </ProtectedRoute>
    );
};

export default App;
