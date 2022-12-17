import * as React from 'react';
import {
	Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography,
	StepLabel, Step, Stepper, Grid, Divider, Avatar, TextField, Tooltip
} from '@mui/material';
import SouthIcon from '@mui/icons-material/South';
import AddIcon from '@mui/icons-material/Add';
import { green } from '@mui/material/colors';

import { getMegasenaNumbers, getRandomNumbersTableByIndex } from '../utils/tabularHashing';


const steps = ['Explicação Geral do Método', 'Definição do Operador Módulo', 'Selecionar Tabelas', 'Selecionar Entradas das Tabelas', 'Combinar Entradas'];

function HorizontalLinearStepper() {
	const [activeStep, setActiveStep] = React.useState(0);
	const [megasenaResult, setMegasenaResult] = React.useState([]);
	const [cpf, setCpf] = React.useState("");
	const [tablesMap, setTablesMap] = React.useState([]);
	const [dividend, setDividend] = React.useState(0);
	const [divisor, setDivisor] = React.useState(1);
	let tableIndexes = [0, 0, 0];

	if (cpf.length > 0) {
		tableIndexes = cpf.substring(0, 9).match(/.{1,3}/g);
	}

	React.useEffect(() => {
		getMegasenaNumbers()
			.then(setMegasenaResult);
	}, [])

	React.useEffect(() => {
		const newLoadedTables = [];
		const loadTablePromises = megasenaResult.slice(0, 3).map(index => {
			return new Promise(async (res, rej) => {
				newLoadedTables.push(await getRandomNumbersTableByIndex(1 + ((index - 1) % 20)));
				res(newLoadedTables[index]);
			})
		})

		Promise.all(loadTablePromises)
			.then(() => {
				if (newLoadedTables.length !== 0) {
					setTablesMap(newLoadedTables);
				}
			})
	}, [megasenaResult])

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleReset = () => {
		setActiveStep(0);
		setCpf("");
	};

	let luckyNumbers = null;
	if (cpf !== null && cpf.length >= 9) {
		luckyNumbers = tableIndexes.map((el, index) => tablesMap[index][el].split('').slice(0, 10))
			.reduce((agg, cur) => {
				for (let i = 0; i < cur.length; i++) {
					agg[i] += parseInt(cur[i]);
				}
				return agg;
			}, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
			.map(el => el % 10)
	}

	return (
		<Box sx={{ width: '100%' }}>
			<Stepper activeStep={activeStep} sx={{ pb: 5 }}>
				{steps.map((label, index) => {
					const stepProps = {};
					const labelProps = {};
					return (
						<Step key={label} {...stepProps}>
							<StepLabel {...labelProps}>{label}</StepLabel>
						</Step>
					);
				})}
			</Stepper>
			{/* -------------- Step 1 ---------------- */}
			{activeStep === 0 &&
				<Grid container spacing={2}>
					<Grid xs={12}>
						<Box>
							<Typography sx={{ mt: 2, mb: 1, px: 1 }}>
								<b>Tabular Hashing</b> para a geração de números aleatórios, ou números da sorte neste contexto, consiste em basicamente selecionar <b>X</b> tabelas
								cada uma composta por números aleatórios, e então é definido um mecanismo que controla como selecionar diferentes elementos das tabelas disponíveis.
								Com os elementos selecionados o mecanismo deve também prover uma forma de combinar todas entradas escolhidas para assim gerar o número aleatório final.
							</Typography>
							<Typography sx={{ mt: 2, mb: 1, px: 1 }}>
								Para este projeto foram construídas 20 tabelas de números aleatórios, cada tabela com 1000 entradas e cada entrada contendo uma sequência de 50 dígitos.
								Estas tabelas foram construídas utilizando os números aleatórios disponibilizados <a target="_blank" href='https://www.rand.org/pubs/monograph_reports/MR1418.html'>neste trabalho</a>,
								e as tabelas resultantes podem ser visualizadas neste <a target="_blank" href='https://docs.google.com/spreadsheets/d/1L247P26PeZjGAgVsQvXfyr1V6THZ0Wfx_OxLuj7pW40/edit#gid=514036898'>link</a>.
								Neste trabalho porém apenas os 10 primeiros dígitos de cada entrada serão utilizados por fornecerem um nível satisfatório de entropia nos números gerados.
							</Typography>
							<Typography sx={{ mt: 2, mb: 1, px: 1 }}>
								O mecanismo aqui definido gera um número da sorte a partir de um CPF de entrada e do último resultado da Megasena. 
								Os três primeiros números do resultado da Megasena definem quais tabelas serão utilizadas e em qual ordem. Então podemos pegar os noves primeiros dígitos do CPF de entrada,
								e quebrar em três sequências de três dígitos, indo de 000-999, que é justamente a capacidade das tabelas geradas. Assim serão selecionados elementos de cada tabela e combinados
								para gerar o número da sorte final, mais detalhes serão dados nos próximos passos. Antes disso é importante definir o operador Módulo que será utilizado em alguns dos passos.
							</Typography>
						</Box>
					</Grid>
				</Grid>
			}
			{/* -------------- Step 2 ---------------- */}
			{activeStep === 1 &&
				<Grid container spacing={2}>
					<Grid xs={5}>
						<Box>
							<Typography sx={{ mt: 2, mb: 1, px: 1 }}>
							A operação módulo, ou mod, encontra o resto da divisão de um número por outro. Dados dois números a (o dividendo) e b (o divisor), a módulo b (a mod b) é o resto da divisão de a por b.
							Por exemplo, 7 mod 3 seria 1, enquanto 9 mod 3 seria 0. <br/>Esta é uma operação bastante utilizada nos próximos passos, por isso é interessante que seja completamente compreendida.
							Caso seja necessário existe uma aula completa sobre assunto disponível na <a target="_blank" href='https://pt.khanacademy.org/computing/computer-science/cryptography/modarithmetic/a/what-is-modular-arithmetic'>KhanAcademy</a>
							</Typography>
							<Typography sx={{ mt: 2, mb: 1, px: 1 }}>
								Ao lado é possível preencher diferentes valores para o divisor e dividendo, e então observar o quociente e resto resultantes.
								A operação mod terá como resultado o resto da divisão, pratique ao lado para garantir que entendeu o funcionamento do operador e então siga para o próximo passo.
							</Typography>
						</Box>
					</Grid>
					<Divider orientation="vertical" flexItem />
					<Grid xs={6}>
						<Box sx={{
							display: 'flex',
							justifyContent: 'space-evenly',
							p: 1,
							m: 1,
							bgcolor: 'background.paper',
							borderRadius: 1,
							width: '100%'
						}}>
							<TextField helperText="Dividendo"
								inputProps={{
									step: 1,
									type: 'number'
								}}
								defaultValue={dividend}
								onChange={ev => setDividend(ev.target.value)}
							/>
							<TextField helperText="Divisor"
								inputProps={{
									step: 1,
									min: 1,
									type: 'number'
								}}
								defaultValue={divisor}
								onChange={ev => setDivisor(ev.target.value)}
							/>
						</Box>
						<Box sx={{
							display: 'flex',
							justifyContent: 'space-evenly',
							p: 1,
							m: 1,
							bgcolor: 'background.paper',
							borderRadius: 1,
							width: '100%'
						}}>
							<TextField helperText={`Resto (Resultado ${dividend} mod ${divisor})`}
								inputProps={{
									type: 'number'
								}}
								disabled
								value={dividend % divisor}
							/>
							<TextField helperText="Quociente"
									inputProps={{
										type: 'number'
									}}
									disabled
									value={Math.floor(dividend/divisor)}
								/>
						</Box>
					</Grid>
				</Grid>
			}
			{/* -------------- Step 3 ---------------- */}
			{activeStep === 2 &&
				<Grid container spacing={2}>
					<Grid xs={5}>
						<Box>
							<Typography sx={{ mt: 2, mb: 1, px: 1 }}>
								Para selecionar as tabelas é sugerido utilizar como fonte de aleatoriedade os três primeiros números do último resultado da Megasena da Loteria Federal.
								<br />
								Ao lado podemos observar os 6 números do último resultado, com os 3 números que serão utilizados em verde.
								<br />
								Para selecionar a tabela referente a cada número, basta subtrair 1 do número, realizar a operação módulo descrita anteriormente com 20, já que são apenas
								20 tabelas, e ao final somar 1, esses passos são necessários para realizar uma correção de índice para que iniciem em 1 e não em 0.
							</Typography>
						</Box>
					</Grid>
					<Divider orientation="vertical" flexItem />
					<Grid xs={6}>
						<Box sx={{
							display: 'flex',
							justifyContent: 'space-evenly',
							p: 1,
							m: 1,
							bgcolor: 'background.paper',
							borderRadius: 1,
							width: '100%'
						}}
						>
							{megasenaResult.length > 0 &&
								megasenaResult.map((el, index) => <Avatar key={index} sx={{ bgcolor: index < 3 ? green[700] : 0 }}>{el}</Avatar>)
							}
						</Box>
						<Box sx={{
							display: 'flex',
							justifyContent: 'space-evenly',
							flexDirection: 'column',
							alignItems: 'center',
							width: '100%'
						}}
						>
							<Typography>Resultado: 1 + ((Número - 1) Mod 20)</Typography>
							<SouthIcon />
						</Box>
						<Box sx={{
							display: 'flex',
							justifyContent: 'space-evenly',
							p: 1,
							m: 1,
							bgcolor: 'background.paper',
							borderRadius: 1,
							width: '100%'
						}}
						>
							{megasenaResult.length > 0 &&
								megasenaResult.map((el, index) =>
									<Avatar key={index} sx={{ bgcolor: index < 3 ? green[700] : 0 }}>
										{1 + ((el - 1) % 20)}
									</Avatar>)
							}
						</Box>
					</Grid>
				</Grid>
			}

			{/* -------------- Step 4 ---------------- */}
			{activeStep === 3 &&
				<Grid container spacing={2}>
					<Grid xs={5}>
						<Box>
							<Typography sx={{ mt: 2, mb: 1, px: 1 }}>
								Com as tabelas selecionadas, podemos utilizar para selecionar os índices em cada tabela.
								Para isso o processo pode ser quebrado nos seguintes passos:
							</Typography>
							<ol>
								<li>
									Selecionar apenas os números do CPF.
								</li>
								<li>
									Remover os últimos 2 dígitos, ficando assim apenas com os 9 primeiros números do CPF.
								</li>
								<li>
									Quebrar a sequência de 9 dígitos em 3 tuplas de 3 dígitos.
								</li>
								<li>
									Utilizar cada tupla para selecionar um item da tabela na mesma ordem.
								</li>
							</ol>
							<Typography sx={{ mt: 2, mb: 1, px: 1 }}>
								Preencha o campo com um CPF para prosseguir.
							</Typography>
						</Box>
					</Grid>
					<Divider orientation="vertical" flexItem />
					<Grid xs={6}>
						<Box sx={{
							display: 'flex',
							justifyContent: 'space-evenly',
							p: 1,
							m: 1,
							bgcolor: 'background.paper',
							borderRadius: 1,
							width: '100%'
						}}
						>
							<TextField helperText="CPF"
								inputProps={{ maxLength: 11 }}
								value={cpf}
								onChange={ev => setCpf(ev.target.value)}
							/>
						</Box>
						<Box sx={{
							display: 'flex',
							justifyContent: 'space-evenly',
							flexDirection: 'column',
							alignItems: 'center',
							width: '100%'
						}}
						>
							<SouthIcon />
						</Box>
						<Box sx={{
							display: 'flex',
							justifyContent: 'space-evenly',
							p: 1,
							m: 1,
							bgcolor: 'background.paper',
							borderRadius: 1,
							width: '100%'
						}}
						>
							{
								[1, 2, 3].map((el, index) => <TextField helperText={`Índice na Tabela #${el}`}
									inputProps={{
										step: 1,
										min: 1,
										max: 999,
										type: 'number'
									}}
									key={el}
									disabled
									value={tableIndexes[index]}
								/>)
							}
						</Box>
					</Grid>
				</Grid>
			}

			{/* -------------- Step 5 ---------------- */}
			{activeStep === 4 &&
				<Grid container spacing={2}>
					<Grid xs={5}>
						<Box>
							<Typography sx={{ mt: 2, mb: 1, px: 1 }}>
								Agora para gerar o número da sorte final, basta realizar uma soma elemento a elemento com todas as entradas selecionadas no passo anterior.
								Então basta realizar a operação Mod 10 para cada elemento resultante, e então teremos o número da sorte final para o CPF selecionado ao agrupar todos os resultados finais.
							</Typography>
							<Typography sx={{ mt: 2, mb: 1, px: 1 }}>
								Caso queira verificar que os dados ao lado foram realmente gerados a partir das tabelas, basta acessar este <a target="_blank" href='https://docs.google.com/spreadsheets/d/1L247P26PeZjGAgVsQvXfyr1V6THZ0Wfx_OxLuj7pW40/edit#gid=514036898'>link </a> 
								e verificar nas respectivas tabelas os índices baseados no CPF fornecido.
							</Typography>
						</Box>
					</Grid>
					<Divider orientation="vertical" flexItem />
					<Grid xs={6}>
						{/* First entry */}
						<Box sx={{
							display: 'flex',
							justifyContent: 'space-evenly',
							p: 1,
							m: 1,
							bgcolor: 'background.paper',
							borderRadius: 1,
							width: '100%'
						}}
						>
							{
								tableIndexes[0] !== 0 &&
								tablesMap[0][tableIndexes[0]].split('').slice(0, 10).map(el => <TextField
									key={el}
									disabled
									value={el}
								/>)
							}
						</Box>
						<Box sx={{
							display: 'flex',
							justifyContent: 'space-evenly',
							flexDirection: 'column',
							alignItems: 'center',
							width: '100%'
						}}
						>
							<AddIcon />
						</Box>
						{/* Second entry */}
						<Box sx={{
							display: 'flex',
							justifyContent: 'space-evenly',
							p: 1,
							m: 1,
							bgcolor: 'background.paper',
							borderRadius: 1,
							width: '100%'
						}}
						>
							{
								tableIndexes[1] !== 0 &&
								tablesMap[1][tableIndexes[1]].split('').slice(0, 10).map(el => <TextField
									key={el}
									disabled
									value={el}
								/>)
							}
						</Box>
						<Box sx={{
							display: 'flex',
							justifyContent: 'space-evenly',
							flexDirection: 'column',
							alignItems: 'center',
							width: '100%'
						}}
						>
							<AddIcon />
						</Box>
						{/* Third entry */}
						<Box sx={{
							display: 'flex',
							justifyContent: 'space-evenly',
							p: 1,
							m: 1,
							bgcolor: 'background.paper',
							borderRadius: 1,
							width: '100%'
						}}
						>
							{
								tableIndexes[2] !== 0 &&
								tablesMap[2][tableIndexes[2]].split('').slice(0, 10).map(el => <TextField
									key={el}
									disabled
									value={el}
								/>)
							}
						</Box>
						<Box sx={{
							display: 'flex',
							justifyContent: 'space-evenly',
							flexDirection: 'column',
							alignItems: 'center',
							width: '100%'
						}}
						>
							<Typography>Resultado: Soma Elemento a Elemento e Mod 10</Typography>
							<SouthIcon />
						</Box>
						{/* Sum and modulus result */}
						<Box sx={{
							display: 'flex',
							justifyContent: 'space-evenly',
							p: 1,
							m: 1,
							bgcolor: 'background.paper',
							borderRadius: 1,
							width: '100%'
						}}
						>
							{luckyNumbers !== null &&
								luckyNumbers.map((el, index) => <TextField
									key={index}
									disabled
									value={el}
								/>)
							}
						</Box>
					</Grid>
				</Grid>
			}

			{activeStep === steps.length ? (
				<React.Fragment>
					<Typography sx={{ mt: 2, mb: 1 }}>
						Parabéns, você passou por todos os passos do guia!
					</Typography>
					<Typography sx={{ mt: 2, mb: 1 }}>
						CPF informado: {cpf}
					</Typography>
					<Typography sx={{ mt: 2, mb: 1 }}>
						Número da sorte gerado: {luckyNumbers.join('')}
					</Typography>
					<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
						<Box sx={{ flex: '1 1 auto' }} />
						<Button onClick={handleReset} variant="contained">Reiniciar</Button>
					</Box>
				</React.Fragment>
			) : (
				<React.Fragment>
					<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
						<Button
							variant="contained"
							disabled={activeStep === 0}
							onClick={handleBack}
							sx={{ mr: 1 }}
						>
							Voltar
						</Button>
						<Box sx={{ flex: '1 1 auto' }} />

						<Button onClick={handleNext} variant="contained" disabled={activeStep === 3 && (cpf === null || cpf.length < 9)}>
							{activeStep === steps.length - 1 ? 'Terminar' : 'Próximo'}
						</Button>
					</Box>
				</React.Fragment>
			)}
		</Box>
	);
}


export default function TabularHashingTutorial() {
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Box sx={{ mt: 2 }}>
			<Tooltip title="Guia Passo a Passo">
				<Button variant="contained" color="secondary" onClick={handleClickOpen}>
					Guia
				</Button>
			</Tooltip>
			<Dialog
				fullWidth
				maxWidth="lg"
				onClose={handleClose}
				open={open}
			>
				<DialogTitle id="customized-dialog-title" onClose={handleClose}>
					Tabular Hashing - Guia Passo a Passo
				</DialogTitle>
				<DialogContent dividers>

					<Box>
						<HorizontalLinearStepper />
					</Box>
				</DialogContent>
				<DialogActions>
					<Button autoFocus onClick={handleClose} color="secondary" variant="contained">
						Fechar
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}