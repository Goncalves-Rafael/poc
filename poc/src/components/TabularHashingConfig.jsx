import * as React from 'react';
import { Avatar, Button, Divider, FormControl, FormControlLabel, FormLabel, List, ListItem, ListItemAvatar, ListItemText, ListSubheader, Radio, RadioGroup, TextField, Tooltip } from '@mui/material';
import TableRowsIcon from '@mui/icons-material/TableRows';
import Box from '@mui/material/Box';
import { green } from '@mui/material/colors';


import { getLuckyNumber, getMegasenaNumbers, getRandomNumbersTableByIndex } from '../utils/tabularHashing';
import TabularHashingTutorial from './TabularHashingTutorial';

const TabularHashingConfig = ({ setGeneratedValues, getInputItems }) => {
    const [megasenaResult, setMegasenaResult] = React.useState([]);
    const [tableIndexes, setTableIndexes] = React.useState([]);
    const [tablesMap, setTablesMap] = React.useState({});
    const [selectedOption, setSelectedOption] = React.useState("megasena");

    React.useEffect(() => {
        if (selectedOption === "megasena") {
            getMegasenaNumbers()
                .then(megasenaNumbers => {
                    setMegasenaResult(megasenaNumbers.slice(0, 3));
                    setTableIndexes(megasenaNumbers.slice(0, 3).map(el => 1 + ((el - 1) % 20)));
                });
        }
    }, [selectedOption])

    React.useEffect(() => {
        const newLoadedTables = {};
        const loadTablePromises = tableIndexes.map(index => {
            return new Promise(async (res, rej) => {
                if (tablesMap[index] === undefined) {
                    newLoadedTables[index] = await getRandomNumbersTableByIndex(index);
                }
                res(newLoadedTables[index]);
            })
        })

        Promise.all(loadTablePromises)
            .then(() => {
                if (Object.keys(newLoadedTables).length !== 0) {
                    setTablesMap(prevState => ({
                        ...prevState,
                        ...newLoadedTables
                    }));
                }
            })
    }, [tableIndexes, selectedOption])

    const generateLuckyNumbers = () => {
        const currentItems = getInputItems();
        const currentTables = tableIndexes.map(index => tablesMap[index]);
        const luckyNumbers = currentItems.map(item => `${item}    ⇒    ${getLuckyNumber(item, currentTables)}`);
        setGeneratedValues(luckyNumbers);
    }

    return <Box>
        <Box>
        <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Fonte de Aleatoriedade</FormLabel>
            <RadioGroup
                defaultValue="megasena"
                name="radio-buttons-group"
                onChange={ev => setSelectedOption(ev.target.value)}
            >
                <FormControlLabel value="megasena" control={<Radio />} label="Megasena" />
                <FormControlLabel value="manual" control={<Radio />} label="Manual" />
            </RadioGroup>
            </FormControl>
        </Box>
        {
            selectedOption === "megasena" &&
                <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-evenly',
                        p: 1,
                        m: 1,
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                    }}
                >
                    {megasenaResult.length > 0 && 
                        megasenaResult.map((el, index) => <Avatar key={index} sx={{ bgcolor: green[700] }}>{el}</Avatar>)
                    }
                </Box>
        }
        {
            selectedOption === "manual" && 
                [1, 2, 3].map((el, index) => <TextField helperText={`Tabela #${el}`}
                    required
                    inputProps={{
                        step: 1,
                        min: 1,
                        max: 20,
                        type: 'number',
                        required: true
                    }}
                    key={el}
                    defaultValue={tableIndexes[index]}
                    onChange={ev => setTableIndexes(prevState => {
                        const newState = [...prevState];
                        newState[index] = ev.target.value;
                        return newState;
                    })}
                />)
        }
        <Divider />
        <List
            sx={{ width: '100%', bgcolor: 'background.paper' }}
            subheader={<ListSubheader>Tabelas Selecionadas</ListSubheader>}
        >
            {
                tableIndexes.map((tableIndex, index) => 
                    <ListItem key={index}>
                        <ListItemAvatar>
                        <Avatar sx={{ bgcolor: green[700] }}>
                            <TableRowsIcon />
                        </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={`Tabela Aleatória: ${tableIndex}`} />
                    </ListItem>
                )
            }
        </List>
        <Tooltip title="Gerar Números da Sorte">
            <Button
                variant="contained"
                onClick={generateLuckyNumbers}
            >
                Gerar
            </Button>
        </Tooltip>
        <TabularHashingTutorial />
    </Box>
}

export default TabularHashingConfig;