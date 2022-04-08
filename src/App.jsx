import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import logo from "./logo.svg";
import "./App.css";
import Button from "@mui/material/Button";
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
const Input = styled("input")({
  display: "none",
});

function App() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

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
      console.log(error);
    }
  };
  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  return (
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
  );
}

export default App;
