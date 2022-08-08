import React, {useEffect, useState} from 'react'
import {Grid} from "@mui/material";
import SurveyCardAdd from "./SurveyCardAdd";


function SurveyCenter(){

    return (
        <Grid container
              direction={`row`}
              justifyContent={`flex-start`}
              alignItems={`flex-start`}
              spacing={2}
        >

            <Grid item>
                <SurveyCardAdd/>
            </Grid>
            <Grid item>
                <SurveyCardAdd/>
            </Grid>
            <Grid item>
                <SurveyCardAdd/>
            </Grid>
        </Grid>
    )
}

export default SurveyCenter;