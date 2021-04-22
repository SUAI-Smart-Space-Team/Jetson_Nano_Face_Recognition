import React, { useState } from 'react'
import { Tab, Tabs, Box, Typography, Container } from '@material-ui/core'
import Link from '../components/ui/Link'
import { TabContext, TabList, TabPanel } from '@material-ui/lab'
import RecognizedUserList from '../components/RecognizedUserList'
import UndefinedUserList from '../components/UndefinedUserList'
import StatsUserList from '../components/StatsUserList'

export default function Index() {
  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Container maxWidth="md" style={{ marginTop: 60 }}>
      <Typography variant="h4" component="h1" style={{ marginBottom: 40 }} gutterBottom align="center">
        {'Jetson Face Recognition'} <img src="/icon.png" style={{ width: 30, marginBottom: -3 }} />
      </Typography>
      <TabContext value={value}>
        <TabList value={value} onChange={handleChange} centered>
          <Tab label="Recognized users" value="1" />
          <Tab label="Undefined users" value="2" />
          <Tab label="Log stats" value="3" />
        </TabList>
        <Box>
          <TabPanel value="1"><RecognizedUserList /></TabPanel>
          <TabPanel value="2"><UndefinedUserList /></TabPanel>
          <TabPanel value="3"><StatsUserList /></TabPanel>
        </Box>
      </TabContext>
    </Container >
  )
}
