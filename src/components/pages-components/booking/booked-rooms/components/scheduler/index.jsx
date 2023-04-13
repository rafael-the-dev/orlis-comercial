import * as React from 'react';
import Paper from '@mui/material/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  DayView,
  Appointments,
  MonthView,
  WeekView
} from '@devexpress/dx-react-scheduler-material-ui';

import { getIsoDate } from "src/helpers"

const currentDate = '2018-11-01';
const schedulerData = [
  { startDate: '2018-11-01T09:45', endDate: '2018-11-01T11:00', title: 'Meeting' },
  { startDate: '2018-11-01T12:00', endDate: '2018-11-01T13:30', title: 'Go to a gym' },
];

const SchedulerContainer = ({ data }) => {
    const getSchedulerData = () => {
        return data.map(item => {
            
            return {
                endDate: getIsoDate(item.leaving),
                startDate: getIsoDate(item.entrance), 
                title: item.room.description
            }
        })
    };

    const scheduleData = getSchedulerData();
    //const min

    //console.log(getSchedulerData())
    return (
        <div>
            <Paper>
                <Scheduler
                    data={scheduleData}
                    >
                    <DayView
                        startDayHour={14}
                        endDayHour={23}
                    />
                    <MonthView />
                    <WeekView
                        startDayHour={9}
                        endDayHour={15}
                    />
                    <Appointments />
                </Scheduler>
            </Paper>
        </div>
    );
};

export default SchedulerContainer;

/** 
<ViewState
currentDate={currentDate}
/>*/