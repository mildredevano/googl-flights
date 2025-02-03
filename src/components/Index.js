import { BrowserRouter as Router } from 'react-router-dom';
import { Box } from '@mui/material/';
import { WebRoute } from "../core/webrouter/Route";
function Index() {
    return (
        <Box width="100%" height="100%">
            <Router>
                <WebRoute />
            </Router>
        </Box>
    );
}
  
export default Index;
  