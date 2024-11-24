import {getAllPosts, createdNewPost, updatePost} from "../models/postModels.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

export async function listAllPosts(req, res) {
    // Busca todos os posts existentes no banco de dados
    const result = await getAllPosts();

    // Envia a lista de posts como resposta HTTP com código de status 200 (OK)
    res.status(200).json(result);
}

export async function sendNewPost(req, res) {
    const idImg= req.file.filename;
    const alt= req.body.alt;
    const urlImagem = `http://localhost:3000/${idImg}.png`;
    try {
        // Renomeia o arquivo da imagem para incluir o ID do post criado
        const imgLasted = `uploads/${idImg}.png`;
        fs.renameSync(req.file.path, imgLasted);

        const imagemBuffer = fs.readFileSync(`uploads/${idImg}.png`);
        const descricaoGemini = await gerarDescricaoComGemini(imagemBuffer);
       
        const post = {
            descricao: descricaoGemini,
            imagem: urlImagem,
            alt: req.body.alt
        }

        // Insere o novo post no banco de dados
        const postCreated = await createdNewPost(post);

        // Envia o ID do post criado como resposta HTTP com código de status 200 (OK)
        res.status(200).json(postCreated);
    } catch (error) {
        // Registra o erro no console
        console.error(error.message);

        // Envia uma mensagem de erro como resposta HTTP com código de status 500 (Internal Server Error)
        res.status(500).json("Erro: Falha na requisição");
    }
}

export async function uploadImgPost(req, res) {
    // Cria um objeto com os dados do novo post, incluindo o nome do arquivo da imagem
    const uploadImg = {
        descricao: "imagem gato",
        imagem: req.file.originalname,
        alt: ""
    };

    try {
        // Insere o novo post no banco de dados
        const uploadCreated = await createdNewPost(uploadImg);

        // Renomeia o arquivo da imagem para incluir o ID do post criado
        const imgLasted = `uploads/${uploadCreated.insertedId}.png`;
        fs.renameSync(req.file.path, imgLasted);

        // Envia o ID do post criado como resposta HTTP com código de status 200 (OK)
        res.status(200).json(uploadCreated);
    } catch (error) {
        // Registra o erro no console
        console.error(error.message);

        // Envia uma mensagem de erro como resposta HTTP com código de status 500 (Internal Server Error)
        res.status(500).json("Erro: Falha na requisição");
    }
}

export async function updatePostID(req, res) {
    const postId = req.params.id;
    const updatedData = req.body;
    try {
        const result = await updatePost(postId, updatedData);
        if (result.modifiedCount === 1) {
            res.status(200).json("Post atualizado com sucesso!");
        } else {
            res.status(500).json("Não foi possível atualizar o post.");
        }
    } catch (error) {
        res.status(500).json("Erro ao atualizar o post:", error);
    }
    
}

export async function updateImgPost(req, res) {
    const postId = req.params.id;
    const urlImagem = `http://localhost:3000/${postId}.png`;
    
    
    try {
        const imagemBuffer = fs.readFileSync(`uploads/${postId}.png`);
        const descricaoGemini = await gerarDescricaoComGemini(imagemBuffer);
       
        const updatedData = {
            descricao: descricaoGemini,
            imagem: urlImagem,
            alt: req.body.alt
        }

        const result = await updatePost(postId, updatedData);
        if (result.modifiedCount === 1) {
            res.status(200).json("Post atualizado com sucesso!");
        } else {
            res.status(500).json("Não foi possível atualizar o post.");
        }
    } catch (error) {
        res.status(500).json("Erro ao atualizar o post:", error);
    }
    
}