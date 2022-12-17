import { Box, Grid, TextField } from "@mui/material";
import { useContext } from "react";

import AppContext from '../utils/AppContext';

const ItemsContainer = () => {
    const [appState, setAppState] = useContext(AppContext);

    const updateInputItems = (ev) => {
        setAppState(prevState => {
            return {
                ...prevState,
                inputItems: ev.target.value.split('\n')
            }
        })
    }

    return <Box sx={{
        width: '100%',
        py: 3
    }}>
        <Grid
            container
            sx={{
                display: 'flex',
                justifyContent: 'space-around'
            }}
        >
            <Grid item xs={4}>
                <TextField
                    id="outlined-multiline-static"
                    label="Itens - Um Por Linha"
                    multiline
                    minRows={20}
                    sx={{ width: '80%' }}
                    placeholder="Preencher um item por linha"
                    onChange={updateInputItems}
                />
            </Grid>
            <Grid item xs={8}>
                <TextField
                    id="outlined-multiline-static"
                    label="Números da Sorte Gerados - Preenchimento Automático"
                    multiline
                    minRows={20}
                    sx={{ width: '80%' }}
                    disabled
                    value={appState.generatedValues.join('\n')}
                />
            </Grid>
        </Grid> 
    </Box>
}

export default ItemsContainer;