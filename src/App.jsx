import { useState, useEffect, forwardRef } from "react";
import { styled } from "@mui/material/styles";
import logo from "./logo.svg";
import "./App.css";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "./utils/axios";
import { selectClasses } from "@mui/material";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Input = styled("input")({
  display: "none",
});

function App() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  useEffect(async () => {
    await axios
      .get("/all_employee ")
      .then((res) => {
        setFiles(res.data.data);
        console.log(files);
      })
      .catch((err) => {
        setError(err.data);
      });
  }, []);
  const insertfiles = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("textFile", selectedFile);
    console.log(formData);
    console.log(selectedFile);
    try {
      const response = await axios({
        method: "post",
        url: "/post_employee",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFiles(response.data.data);
      console.log(files);
    } catch (error) {
      setError(error.response.data.message);

      handleClick();
    }
  };
  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  return (
    <>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            {error ? error : "something wrong happened"}
          </Alert>
        </Snackbar>
      </Stack>
      <Box
        className="App.css"
        sx={{
          pt: 4,
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <form onSubmit={insertfiles}>
          <input type="file" onChange={handleFileSelect} />
          <input type="submit" value="Upload File" />
        </form>

        {/* {!files[0].message ? ( */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>employee</TableCell>
                <TableCell>files</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.map((card, i) => {
                return (
                  <TableRow key={card.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell>{card.name}</TableCell>
                    <TableCell>
                      {card.files.map((file, j) => {
                        return <span>{file.name + ", "}</span>;
                      })}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {/* ) : (
        <h1>{files[0].message}</h1>
      )} */}
      </Box>
    </>
  );
}

export default App;
