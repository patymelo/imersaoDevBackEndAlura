import express from "express";
import multer from "multer";
import { listAllPosts, sendNewPost, uploadImgPost, updatePostID, updateImgPost} from "../controllers/postsController.js";
import cors from "cors";
//>>>>> usar para windowns
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     }
// })

//const upload = multer({ dest: "./uploads" , storage});

const corsOptions = {
    origin: "http://localhost:8000",
    optionsSuccessStatus:200
}
const upload = multer({ dest: "./uploads"});

const routes = (app) => {
    app.use(express.json());
    app.use(cors(corsOptions));
    //Rota para buscar todos os posts
    app.get("/posts", listAllPosts);
    //Rota para criar um novo post
    app.post("/posts", upload.single("imagem") ,sendNewPost);
    //Rota para fazer upload de imagem
    app.post("/upload",upload.single("imagem"),uploadImgPost);
    //Rota para atualizar o post
    app.put("/posts/:id",updatePostID);
    //Rota para atualizar upload
    app.put("/upload/:id",updateImgPost);
};

export default routes;