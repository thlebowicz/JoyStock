import * as React from "react";
import { useState, useEffect, useContext} from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "../Header/Header.js";
import StockCard from "./StockCard.js";
import "./ListTab.css";
import Dialog from "@mui/material/Dialog";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DialogContentText from "@mui/material/DialogContentText";
import InputLabel from "@mui/material/InputLabel";
import { Context } from "../Context/Context.js";

function ListTab({ data, addTickerToData, deleteTickerFromData, readData, readNotifications }) {
  const [tickerToAdd, setTickerToAdd] = useState("");
  const [quantityToAdd, setQuantityToAdd] = useState(0);
  const [notifToggle, setNotifToggle] = useState("");
  const [notifTicker, setNotifTicker] = useState("");
  const context = useContext(Context);

  const authToken = sessionStorage.getItem("joystockToken");

  const handleClick = async (e) => {
    await addTickerToData(tickerToAdd, quantityToAdd);
  };

  const addNotification = (e) => {
    e.preventDefault();
    const price = e.target.notifPrice.value;
    const condition = e.target.notifCondition.value;
    setNotifToggle(false);
    setNotifTicker("");
    fetch("http://localhost:3000/add-notification", {
      method: "POST",
      headers: {
        Accept: "application.json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
      body: JSON.stringify({
        notifTicker: notifTicker,
        notifPrice: price,
        notifCondition: condition,
        notifUser: context.username,
      }),
      cache: "default",
    })
      .then((response) => response.json())
      .then(readNotifications);
  };

  const round = (num) => {
    if (parseInt(num)) {
      return num.toFixed(2);
    } else return num;
  };

  return (
    <body>
      <Header />
      <div style={{ marginTop: 100 }}>
        <Container maxWidth="lg">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TextField
              onChange={(e) => setTickerToAdd(e.target.value)}
              placeholder="Type a ticker to add to your portfolio"
              style={{
                width: "35%",
                position: "relative",
                right: "5em",
              }}
            />
            <TextField
              onChange={(e) => setQuantityToAdd(e.target.value)}
              placeholder="Quantity to add"
              style={{
                width: "20%",
                position: "relative",
                right: "2em",
              }}
            />
            <Button
              variant="contained"
              style={{ marginRight: "2em" }}
              onClick={handleClick}
            >
              Add to Portfolio
            </Button>
            <Button variant="outlined" onClick={readData}>
              Refresh
            </Button>
          </div>
          <div
            style={{
              marginTop: "2em",
              marginBottom: "2em",
              position: "relative",
              left: "5em",
            }}
          >
            <Typography variant="h5">
              Portfolio value: $
              {data.length
                ? round(data.reduce((a, b) => a + b.currPrice * b.quantity, 0))
                : 0.0}
            </Typography>
          </div>
          {data.map((stock) => (
            <StockCard
              stock={stock}
              deleteTickerFromData={deleteTickerFromData}
              setNotifToggle={setNotifToggle}
              setNotifTicker={setNotifTicker}
            />
          ))}
        </Container>

        <Dialog open={notifToggle} onClose={() => setNotifToggle("")} sx={{}}>
          <Box
            component="form"
            onSubmit={addNotification}
            sx={{
              padding: "3em",
              borderRadius: "4em",
              width: "80%",
            }}
          >
            <Typography
              variant="h4"
              sx={{ userSelect: "none", textAlign: "center" }}
            >
              Set Notification for {notifTicker}
            </Typography>
            <DialogContentText sx={{ textAlign: "center", userSelect: "none" }}>
              Select price and condition below
            </DialogContentText>
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <TextField
                margin="normal"
                name="notifPrice"
                label="Price"
                autoFocus
              />
              <InputLabel id="condition-label">Condition</InputLabel>
              <Select
                sx={{
                  marginTop: ".5em",
                  marginLeft: "2em",
                  flexGrow: "1",
                }}
                margin="normal"
                autoFocus
                required
                name="notifCondition"
                label="Condition"
                labelId="condition-label"
              >
                <MenuItem value={"<="}>Less than</MenuItem>
                <MenuItem value={">="}>Greater than</MenuItem>
              </Select>
            </div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Dialog>
      </div>
    </body>
  );
}

export default ListTab;
