import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import HelpOutlineRounded from '@mui/icons-material/HelpOutlineRounded';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlined from '@mui/icons-material/InfoOutlined';

import './App.css';
import { words } from './words';

const appBarStyle = {
	height: '56px',
	backgroundColor: '#121213',
};

const modalStyle = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	backgroundColor: 'white',
	boxShadow: 24,
	padding: '20px',
	borderRadius: '18px',
	overflow: 'scroll',
	width: '300px',
	maxHeight: '80vh',
};

const letterStyle = {
	width: '62px',
	height: '62px',
	border: '2px solid #3a3a3c',
	borderRadius: '0px',
	color: 'white',
	fontSize: '2rem',
	fontWeight: 'bold',
	userSelect: 'none',
};

const actionStyle = {
	height: '58px',
	backgroundColor: '#818384',
	border: '0px',
};

const idxs = [0, 1, 2, 3, 4];
const letterSpacing = 0.5;

const getColor = (i) => (i === 2 ? '#328332' : i === 1 ? '#b9b925' : '#3a3a3c');

function App() {
	const [open, setOpen] = React.useState(false);
	const [openHelp, setOpenHelp] = React.useState(false);
	const [openInfo, setOpenInfo] = React.useState(true);

	const [step, setStep] = React.useState(0);

	const [inputState, setInputState] = React.useState({
		0: { letter: '', color: 0 },
		1: { letter: '', color: 0 },
		2: { letter: '', color: 0 },
		3: { letter: '', color: 0 },
		4: { letter: '', color: 0 },
	});

	const [badLetters, setBadLetters] = React.useState([]);
	const [goodLetters, setGoodLetters] = React.useState([]);
	const [incorrectLetters, setIncorrectLetters] = React.useState([]);
	const [correctLetters, setCorrectLetters] = React.useState([]);

	const [foundWords, setFoundWords] = React.useState(words);

	const [checks, setChecks] = React.useState([]);
	const [error, setError] = React.useState(false);

	const changeInputColor = (i) => {
		let color = inputState[i].color < 2 ? inputState[i].color + 1 : 0;
		setInputState({ ...inputState, [i]: { ...inputState[i], color } });
	};

	const handleNextClick = () => {
		//check if the word exist
		const _word = `${inputState[0].letter}${inputState[1].letter}${inputState[2].letter}${inputState[3].letter}${inputState[4].letter}`;
		if (!foundWords.includes(_word))
			return setError(
				"There are no 5 letter words in this pattern! To know how to play this game, click on '?'"
			);
		setError(false);

		const bads = [...badLetters];
		const goods = [];

		const incorrects = [];
		const corrects = [];

		idxs.map((i) => {
			if (inputState[i].color === 0) return bads.push(inputState[i].letter);
			if (inputState[i].color > 0) goods.push(inputState[i].letter);
			if (inputState[i].color === 1) incorrects.push({ pos: i, letter: inputState[i].letter });
			if (inputState[i].color === 2) corrects.push({ pos: i, letter: inputState[i].letter });
			return false;
		});

		setBadLetters([...badLetters, bads]);
		setGoodLetters([...goodLetters, goods]);

		setIncorrectLetters([...incorrectLetters, corrects]);
		setCorrectLetters([...correctLetters, corrects]);

		//search words
		const results = [];

		for (let word of foundWords) {
			// check if the word has some incorrect letters
			const rs1 = incorrects.some((incorrect) => incorrect.letter === word[incorrect.pos]);
			if (rs1) continue;

			// check if the word has some of the bad letters
			const rs2 = bads.some((letter) => word.includes(letter));
			if (rs2) continue;

			// check if the word has all of the green letters in exact positions
			const rs3 = corrects.every((correct) => correct.letter === word[correct.pos]);
			if (!rs3) continue;

			// check if the word has all of the good letters
			const rs4 = goods.every((letter) => word.includes(letter));
			if (rs4) results.push(word);
		}

		//update possible words
		setFoundWords(results);
		if (results.length <= 1) return handleOpen();

		//add the word to checks with color
		const newCheck = {
			0: { letter: inputState[0].letter, color: inputState[0].color },
			1: { letter: inputState[1].letter, color: inputState[1].color },
			2: { letter: inputState[2].letter, color: inputState[2].color },
			3: { letter: inputState[3].letter, color: inputState[3].color },
			4: { letter: inputState[4].letter, color: inputState[4].color },
		};
		setChecks([...checks, newCheck]);

		//increase step count
		setStep(step + 1);

		//get new word
		const newWord = results[Math.floor(Math.random() * results.length)];
		if (newWord) addToInput(newWord);
	};

	const addToInput = (word) => {
		let newInputState = { ...inputState };
		console.log(word);
		idxs.map((i) => {
			newInputState[i].letter = word[i];
			newInputState[i].color = newInputState[i].color === 2 ? 2 : 0;
			return true;
		});
		setInputState(newInputState);
		handleClose();
	};

	const getRandomWord = () => {
		const newWord = foundWords[Math.floor(Math.random() * foundWords.length)];
		addToInput(newWord);

		//update step if its the first word
		if (step === 0) setStep(step + 1);
	};

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleOpenHelp = () => setOpenHelp(true);
	const handleCloseHelp = () => setOpenHelp(false);

	return (
		<div className="Root">
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position="static" style={appBarStyle}>
					<Toolbar>
						<IconButton
							size="large"
							edge="start"
							color="inherit"
							aria-label="menu"
							sx={{ mr: 2 }}
							onClick={handleOpenHelp}
						>
							<HelpOutlineRounded />
						</IconButton>
						<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
							Wordle Finder
						</Typography>
					</Toolbar>
				</AppBar>
			</Box>

			<Grid container mt={0} className="App">
				<Modal
					open={open}
					onClose={handleClose}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<div style={modalStyle}>
						<Stack spacing={2}>
							{foundWords.length === 0 ? (
								<Stack spacing={2} justifyContent="center" alignItems="center">
									<Typography sx={{ mt: 1 }}>Oops! No Words!.</Typography>
									<Typography sx={{ mt: 1 }}>
										There are no 5 letter words in this pattern! To know how to play this game, click on '?'
									</Typography>
									<Typography sx={{ mt: 1 }}>If it still happens, I need to fix some bugs ;)</Typography>
								</Stack>
							) : (
								<Stack spacing={2} justifyContent="center" alignItems="center">
									<Typography variant="h4" sx={{ mt: 1 }}>
										Hurray.. You've solved today's Wordle
									</Typography>
									<Typography variant="h5" sx={{ mt: 1 }}>
										Today's Wordle is
									</Typography>
									<Typography variant="h2" sx={{ mt: 1 }}>
										{foundWords[0]}
									</Typography>
								</Stack>
							)}
						</Stack>
					</div>
				</Modal>

				<Modal
					open={openHelp}
					onClose={handleCloseHelp}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<Box style={modalStyle}>
						<Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={1}>
							<Typography variant="h6" component="h2">
								How?
							</Typography>
							<Typography variant="body1" component="p">
								1. Click on 'GET FIRST RANDOM WORD' to get a new word.
							</Typography>
							<Typography variant="body1" component="p">
								2. Go to Wordle and submit the word you got.
							</Typography>
							<Typography variant="body1" component="p">
								3. Check colors of letters and come back here.
							</Typography>
							<Typography variant="body1" component="p">
								4. Change letter colors correspondingly by clicking on each letters.
							</Typography>
							<Typography variant="body1" component="p">
								5. Click on 'GET NEXT WORD'.
							</Typography>
							<Typography variant="body1" component="p">
								6. Repeat from step 2.
							</Typography>
							<Typography variant="body1" component="p">
								#It will find the word in less than 6 tries.
							</Typography>
							<Typography variant="body1" component="p">
								#The GET WORD function only finds the next possible words.
							</Typography>
						</Stack>
					</Box>
				</Modal>

				<Grid padding={2}>
					<Stack direction="column" spacing={2}>
						<Stack direction="column" justifyContent="center" alignItems="center" spacing={letterSpacing}>
							{checks.map((check, key) => (
								<Stack key={`check-${key}`} direction="row" spacing={letterSpacing}>
									{idxs.map((i) => (
										<Button
											key={`check-${key}-${i}`}
											variant="outlined"
											style={{ ...letterStyle, backgroundColor: getColor(check[i].color), border: '0px' }}
										>
											{check[i].letter}
										</Button>
									))}
								</Stack>
							))}

							{inputState[0].letter && (
								<Stack direction="row" spacing={letterSpacing}>
									{idxs.map((i) => (
										<Button
											key={`button-${i}`}
											variant="outlined"
											style={{
												...letterStyle,
												backgroundColor: getColor(inputState[i].color),
												border: '0px',
											}}
											onClick={() => changeInputColor(i)}
										>
											{inputState[i].letter || ' '}
										</Button>
									))}
								</Stack>
							)}

							{[...Array(6 - checks.length - (inputState[0].letter ? 1 : 0))].map((e, i) => (
								<Stack key={`empty-${i}`} direction="row" spacing={letterSpacing}>
									{idxs.map((i) => (
										<Button key={`empty-button-${i}`} variant="outlined" style={letterStyle}>
											{' '}
										</Button>
									))}
								</Stack>
							))}
						</Stack>

						<Stack direction="column" spacing={2}>
							<Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
								{step === 0 ? (
									<Button variant="contained" onClick={getRandomWord} style={actionStyle}>
										GET FIRST RANDOM WORD
									</Button>
								) : (
									<Button variant="contained" onClick={handleNextClick} style={actionStyle}>
										GET NEXT WORD
									</Button>
								)}
							</Stack>

							{error && (
								<Stack direction="column" spacing={2}>
									<Typography color="red" variant="caption" component="h6">
										{error}
									</Typography>
								</Stack>
							)}

							{[0, 1, 2, 3, 4].includes(step) && (
								<>
									<IconButton
										aria-label="close"
										color="inherit"
										size="small"
										disabled={openInfo}
										onClick={() => {
											setOpenInfo(true);
										}}
									>
										<InfoOutlined fontSize="inherit" />
									</IconButton>

									<Box sx={{ width: '100%' }}>
										<Collapse in={openInfo}>
											<Alert
												action={
													<IconButton
														aria-label="close"
														color="inherit"
														size="small"
														onClick={() => {
															setOpenInfo(false);
														}}
													>
														<CloseIcon fontSize="inherit" />
													</IconButton>
												}
												sx={{ mb: 2 }}
											>
												<Stack direction="column" spacing={2}>
													<Typography color="black" variant="caption" component="h6">
														{step === 0 && `Click on 'GET FIRST RANDOM WORD' to get your first lucky word.`}
														{[1, 2, 3, 4].includes(step) &&
															`Click on each letter to change its colors as in Wordle. But before, sumbit the word in Wordle and check letter colors.`}
													</Typography>
												</Stack>
											</Alert>
										</Collapse>
									</Box>
								</>
							)}
						</Stack>
					</Stack>
				</Grid>
			</Grid>
		</div>
	);
}

export default App;
