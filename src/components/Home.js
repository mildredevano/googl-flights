import { Autocomplete, Accordion, AccordionSummary, AccordionDetails, Box, Button, TextField, Typography, MenuItem, IconButton, Skeleton } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useEffect, useState } from 'react';
import { rqx } from '../core/request/API';
import moment from 'moment';
import dayjs from 'dayjs';
export default function Home() {
    const categories = [{value: 0, label: 'Round Trip'}, {value: 1, label: 'One Way'}, {value: 2, label: 'Multi-city'}]
    const [airports, setAirports] = useState([])
    const [input, setInput] = useState({category: 0, from: '', to: '', departure: '', return: ''})
    const [availableFlights, setavailableFlights] = useState({status: false, data: ''})
    const [loading, setLoading] = useState(false)
    const searchAirport = async() => {
        let fetch = await rqx.get(`https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport`, {query: 'new', locale: 'en-US'})
        console.log(fetch)
        if(fetch.data.length > 0){
            setAirports(fetch.data)
        }
    }
    const handleCategory = (e) => {
        setInput({...input, [e.target.name] : e.target.value})
    }
    const handleLocation = (e, val, name) => {
        setInput({...input, [name]: val.skyId})
    }
    const handleDate = (value, name) => {
        setInput({...input, [name] : moment(value.$d.toISOString()).format('YYYY-MM-DD')})
    }
    const handleSearch = async() => {
        setLoading(true)
        let origin = airports.filter(f => input.from === f.skyId)[0]
        let destination = airports.filter(f => input.to === f.skyId)[0]
        let fetch = await rqx.get(`https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights`, {'originSkyId': origin.skyId, 'destinationSkyId': destination.skyId, 'originEntityId': origin.entityId, 'destinationEntityId': destination.entityId, 'date': '2025-02-03', 'cabinClass': 'economy', 'adults': 1, 'sortBy': 'best', 'currency': 'USD', 'market': 'en-US', 'countryCode': 'US'})
        if(fetch.status){
            setavailableFlights({status: true, data: fetch.data})
            setLoading(false)
        }
        console.log(fetch.data)
    }
    useEffect(() => {
        searchAirport();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <Box display="flex" justifyContent="center">
            <Box p="20px" mt="20px" width="62%">
                <Typography variant="h3" mb="20px" textAlign="center">Flights</Typography>
                <Box borderRadius="10px" boxShadow="0 1px 3px 0 rgba(60,64,67,.3),0 4px 8px 3px rgba(60,64,67,.15)" p="20px" mb="20px">
                    <Box display="flex" mb="10px">
                        <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '15ch' } }}>
                            <TextField id="standard-select-currency" select defaultValue="0" variant="standard" name="category" onChange={(e)=>handleCategory(e)}>
                                {categories.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <Autocomplete disablePortal sx={{ width: 300, mt: '7px', mr: '20px' }} options={airports} getOptionLabel={(option) =>  option.presentation.title } onChange={(e, value) => handleLocation(e, value, 'from')}  renderInput={(params) => <TextField {...params} label="Where from?" />}/>
                        <Autocomplete disablePortal sx={{ width: 300, mt: '7px', mr: '20px' }} options={airports} getOptionLabel={(option) =>  option.presentation.title } onChange={(e, value) => handleLocation(e, value, 'to')} renderInput={(params) => <TextField {...params} label="Where to?" />}/>
                        <Box sx={{mr: '20px'}}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker label="Departure" minDate={dayjs(moment(new Date()).format('YYYY-MM-DD'))} onChange={(e)=>handleDate(e, 'departure')}/>
                                </DemoContainer>
                            </LocalizationProvider>
                        </Box>
                        {
                            input.category === 0 && 
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker label="Return" minDate={dayjs(moment(new Date()).format('YYYY-MM-DD'))} onChange={(e)=>handleDate(e, 'return')}/>
                                </DemoContainer>
                            </LocalizationProvider>
                        }
                    </Box>
                    <Box display="flex" justifyContent="flex-end" mt="20px">
                        <Button variant="contained" onClick={handleSearch}>Search</Button>
                    </Box>
                </Box>
                <Typography variant="h6" mb="20px">Top departing flights</Typography>
                {
                    loading ? (
                        <Skeleton variant="rounded" width="100%" height="300px" />
                    ) : (
                        availableFlights.status ? (
                            availableFlights.data.itineraries.map((a, i) => (
                                <Accordion key={i}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
                                        <Box display="flex" justifyContent="space-between" width="100%">
                                            <Box width="5%" display="flex" justifyContent="center" alignItems="center">
                                                <img src={a.legs[0].carriers.marketing[0].logoUrl} alt="icon" width={20} height={20}/>
                                            </Box>
                                            <Box width="20%">
                                                <Typography component="span">{moment(a.legs[0].departure).format('LT')} - {moment(a.legs[0].arrival).format('LT')}</Typography>
                                                <Box color="#70757a">{a.legs[0].carriers.marketing[0].name}</Box>
                                            </Box>
                                            <Box width="20%">
                                                <Typography component="span">{Math.floor(a.legs[0].durationInMinutes / 60)} hr {a.legs[0].durationInMinutes % 60} min</Typography>
                                                <Box></Box>
                                            </Box>
                                            <Box width="20%">
                                                <Typography component="span">---</Typography>
                                                <Box color="#70757a">Avg emissions</Box>
                                            </Box>
                                            <Box width="20%">
                                                <Typography component="span">{a.price.formatted}</Typography>
                                                <Box color="#70757a">{input.category === 0 ? 'round trip' : (input.category === 1 ? 'one way' : 'multi - city')}</Box>
                                            </Box>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Box pl="95px">
                                            <Box fontSize="17px" mb="10px">{moment(a.legs[0].departure).format('LT')} . {a.legs[0].origin.name}</Box>
                                            <Box color="#70757a" fontSize="14px" mb="10px">Travel time: {Math.floor(a.legs[0].durationInMinutes / 60)} hr {a.legs[0].durationInMinutes % 60} min</Box>
                                            <Box fontSize="17px" sx={{mb: '10px'}}>{moment(a.legs[0].arrival).format('LT')} . {a.legs[0].destination.name}</Box>
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            ))
                        ) : (
                            <></>
                        )
                    )
                }
            </Box>
        </Box>
    )
}