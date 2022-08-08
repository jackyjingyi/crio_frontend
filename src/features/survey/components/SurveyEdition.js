import React, {useEffect, useState} from 'react'
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import axios from "axios";
import {Box, Grid, Tab, Tabs} from "@mui/material";
import TabPanel, {allyProps} from "../../public/components/TabPanel";


function SurveyEdition() {
    const selector = useSelector(state => state.survey)
    const params = useParams()
    const currentSurveyID = params.surveyID
    const currentSurveyDetail = selector.surveyList.find(r => r.id = currentSurveyID)
    const [value, setValue] = useState(0)

    useEffect(() => {
        async function getSurvey(id) {
            const survey = await axios.get(`/api/survey/project/${id}`)
        }

        if (selector.currentSurvey === '') {
            // new refreshed page. redux is not loaded
            // set currentSurvey & add detail to page
            // need get survey detail first
        } else {
            if (selector.currentSurvey === params.surveyID) {
                // default path
            } else {
                // need set current Survey to this page
            }
        }

    }, [currentSurveyID])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }
    return (<>

            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
            >
                <Grid item xl={1} sx={{
                    backgroundColor: '#fff',
                    padding:'16px'
                }}>
                    <Box sx={{width: '100%'}}>
                        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>

                            <Tabs value={value}
                                  onChange={handleChange}
                                  aria-label={"edit tabs"}
                            >
                                <Tab label={"题型选择"} {...allyProps(0)}/>
                                <Tab label={"问卷大纲"} {...allyProps(1)}/>
                            </Tabs>
                        </Box>
                        <TabPanel value={value} index={0}>
                            提醒选择
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            问卷大纲
                        </TabPanel>
                    </Box>
                </Grid>
                <Grid item xl={11}>
                    右侧
                </Grid>
            </Grid>
        </>


    )


}


export default SurveyEdition;