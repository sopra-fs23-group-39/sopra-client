import {createSlice} from "@reduxjs/toolkit";

export const gameSlice = createSlice({
    name: 'game',
    initialState: {
        gameStompClient: null,
        gameId: null
    },
    reducers: {
        setGameStompClient: (state, action) => {
            state.gameStompClient = action.payload;
        },
        setGameId: (state, action) => {
            state.gameId = action.payload;
        }
    }
})

export const {setGameStompClient, setGameId} = gameSlice.actions;
export default gameSlice.reducer;