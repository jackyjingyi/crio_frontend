import {createSlice} from "@reduxjs/toolkit"


const initialState = {
    currentSurvey: '',
    surveyList: [],

}

export const surveySlice = createSlice({
    name: 'survey', initialState, reducers: {
        setCurrentSurvey: (state, action) => {
            state.currentSurvey = action.payload.id
        },
        addSurvey:(state, action) =>{
            state.surveyList.push(action.payload)
        },
    }
})

export const {setCurrentSurvey, addSurvey} = surveySlice.actions
export default surveySlice.reducer