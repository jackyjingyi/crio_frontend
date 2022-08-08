import {configureStore} from '@reduxjs/toolkit'
import userReducer from '../features/user/userSlice'
import surveyReducer from '../features/survey/surveySlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        survey: surveyReducer,
    },
})