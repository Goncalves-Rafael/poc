import { Button, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { DateTimePicker } from '@mui/x-date-pickers';
import * as React from 'react';



const TabularHashingConfig = ({ setGeneratedValues, getInputItems }) => {
    const [selectedOption, setSelectedOption] = React.useState("nist");
    const [selectedPulse, setSelectedPulse] = React.useState("last");
    const [seed, setSeed] = React.useState(null);
    const [dateTime, setDateTime] = React.useState(null);


    const generateLuckyNumbers = () => {
        const currentItems = getInputItems();
        setGeneratedValues(currentItems);
    }

    return <Box>
        <Box>
            <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">Fonte de Aleatoriedade</FormLabel>
                <RadioGroup
                    defaultValue="nist"
                    name="radio-buttons-group"
                    onChange={ev => setSelectedOption(ev.target.value)}
                    value={selectedOption}
                >
                    <FormControlLabel value="nist" control={<Radio />} label="Farol de aleatoriedade - NIST" />
                    <FormControlLabel value="uchile" control={<Radio />} label="Farol de aleatoriedade - Universidade do Chile" />
                    <FormControlLabel value="inmetro" control={<Radio />} label="Farol de aleatoriedade - INMETRO" />
                    <FormControlLabel value="user" control={<Radio />} label="Inserir manualmente" />
                </RadioGroup>
            </FormControl>
        </Box>
        {
            selectedOption !== "user" &&
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-evenly',
                p: 1,
                m: 1,
                bgcolor: 'background.paper',
                borderRadius: 1,
            }}
            >

            </Box>
        }
        <Divider />
        <Box>
        {
            selectedOption === "user" &&
            <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">Inserir semente manualmente</FormLabel>
                <TextField helperText={"Inserir valor"}
                    defaultValue={seed}
                    value={seed}
                    onChange={ev => setSeed(ev.target.value)}
                />
            </FormControl>
        }
        {
            selectedOption !== "user" &&
                
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">Selecionar pulso</FormLabel>
                        <RadioGroup
                            defaultValue="last"
                            value={selectedPulse}
                            name="radio-buttons-group"
                            onChange={ev => setSelectedPulse(ev.target.value)}
                        >
                            <FormControlLabel value="last" control={<Radio />} label="Usar último pulso" />
                            <FormControlLabel value="future" control={<Radio />} label="Usar próximo pulso" />
                            <FormControlLabel value="past" control={<Radio />} label="Escolher pulso já gerado" />
                        </RadioGroup>
                    </FormControl>
        }
        {
            selectedPulse === 'past' &&
                <DateTimePicker
                    label="Escolher data e hora"
                    value={dateTime}
                    onChange={setDateTime}
                    renderInput={(params) => <TextField {...params} />}
                />
        }
        </Box>
        <Button
            variant="contained"
            onClick={generateLuckyNumbers}
        >
            Sortear
        </Button>
    </Box>
}

export default TabularHashingConfig;