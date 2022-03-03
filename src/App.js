import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Paper';
import './App.css';
import { Typography } from '@mui/material';
import { words } from './words';

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

const letterButtonStyle = { width: '60px', height: '60px', color: 'black' };
const checkCardStyle = {
	width: '60px',
	height: '40px',
	color: 'black',
	fontSize: 'medium',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
};

const idxs = [0, 1, 2, 3, 4];

function App() {
	const [open, setOpen] = React.useState(false);
	const [openHelp, setOpenHelp] = React.useState(false);

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

	const getColor = (i) => (i === 2 ? '#328332' : i === 1 ? '#b9b925' : '#505050');

	const handleNextClick = () => {
		//check if the word exist
		const _word = `${inputState[0].letter}${inputState[1].letter}${inputState[2].letter}${inputState[3].letter}${inputState[4].letter}`;
		if (!foundWords.includes(_word)) return setError('Please Chose A Word');
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
		if (results.length <= 1) handleOpen();

		//add the word to checks with color
		const newCheck = {
			0: { letter: inputState[0].letter, color: inputState[0].color },
			1: { letter: inputState[1].letter, color: inputState[1].color },
			2: { letter: inputState[2].letter, color: inputState[2].color },
			3: { letter: inputState[3].letter, color: inputState[3].color },
			4: { letter: inputState[4].letter, color: inputState[4].color },
		};
		setChecks([...checks, newCheck]);
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

	const handleRandomClick = () => {
		const word = foundWords[Math.floor(Math.random() * foundWords.length)];
		addToInput(word);
	};

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleOpenHelp = () => setOpenHelp(true);
	const handleCloseHelp = () => setOpenHelp(false);

	return (
		<div>
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
									<Typography sx={{ mt: 1 }}>If this is mistake, I need to fix some bugs ;)</Typography>
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
								1. Click on GET WORD to get a new word.
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
								5. Click NEXT.
							</Typography>
							<Typography variant="body1" component="p">
								6. Repeat from step 1.
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

				<Stack direction="column" justifyContent="center" alignItems="center" spacing={20}>
					<Stack direction="column" spacing={2}>
						<Stack direction="row" spacing={2}>
							{idxs.map((i) => (
								<Button
									key={`button-${i}`}
									id={`button-${i}`}
									variant="outlined"
									style={{ ...letterButtonStyle, backgroundColor: getColor(inputState[i].color) }}
									onClick={() => changeInputColor(i)}
								>
									{inputState[i].letter || '_'}
								</Button>
							))}
						</Stack>

						<Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
							<Button variant="contained" onClick={handleRandomClick}>
								GET WORD
							</Button>
							<Button variant="outlined" onClick={handleOpenHelp}>
								HELP
							</Button>
							<Button variant="contained" onClick={handleNextClick}>
								NEXT
							</Button>
						</Stack>

						{error && (
							<Stack direction="column" spacing={2}>
								<Typography color="red" variant="caption" component="h6">
									{error}
								</Typography>
							</Stack>
						)}
					</Stack>

					<Stack direction="column" spacing={2}>
						<Typography>Checks</Typography>
						{checks.map((check) => (
							<Stack key={check} direction="row" spacing={2}>
								{idxs.map((i) => (
									<Card
										key={`${check}${i}`}
										style={{ ...checkCardStyle, backgroundColor: getColor(check[i].color) }}
									>
										{check[i].letter}
									</Card>
								))}
							</Stack>
						))}
					</Stack>
				</Stack>
			</Grid>
		</div>
	);
}

export default App;
