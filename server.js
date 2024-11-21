import express from "express";

const app = express()

app.listen(3000,() => {
    console.log("Servidor escutando...");
});

app.get("/api",(req,res) =>{
    res.status(200).send("Bem vindo(a) à imersão Dev Back-End alura - Api e servidores");
});