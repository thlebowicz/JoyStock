# JoyStock

Developed by Thomas Hlebowicz & Hubert Puszklewicz

A full stack mock portfolio tracker built with React, Express, Node JS, and Mongo DB. Auth is handled with Jsonwebtoken, notifications use Twilio, and 
the price graphs are implemented with Recharts. 

Sign up using a valid email address and then login to enter your portfolio. Once there, add a ticker/quantity pair to your portfolio to view the current 
price and fundamental data. Remove a ticker by clicking the 'x' button on the right or configure a notification to be sent to your login email 
by clicking the mailbox button directly adjacent. 

The graph tab will display price trends for stocks in your portfolio for the past specified days (default 10). 

The notification tab displays your current active notifications and allows for deletion. Notifications are sent once a day and when triggered by a data refresh.

Data is fetched from the Polygon finance API (https://polygon.io/) and cached for 2 hours at a time. 

