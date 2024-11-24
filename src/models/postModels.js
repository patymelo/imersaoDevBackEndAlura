import 'dotenv/config';
import conectarAoBanco from "../config/dbConfig.js";
import { ObjectId } from 'mongodb';

const conexao = await conectarAoBanco( process.env.STRING_CONEXAO);

export async function getAllPosts() {
    // Conecta ao banco de dados 'imersao-instabytes'
    const db = conexao.db("imersao-instabytes");

    // Seleciona a coleção 'posts'
    const colecao = db.collection("posts");

    // Busca todos os documentos da coleção 'posts' e retorna um array
    return colecao.find().toArray();
}

export async function createdNewPost(newPost) {
    // Conecta ao banco de dados 'imersao-instabytes'
    const db = conexao.db("imersao-instabytes");

    // Seleciona a coleção 'posts'
    const colecao = db.collection("posts");

    // Insere um novo documento na coleção 'posts'
    return colecao.insertOne(newPost);
}

export async function updatePost(postId,updatedData) {
   try{
    const db = conexao.db("imersao-instabytes");
    const colecao = db.collection("posts"); // Corrigido para 'posts'

    const objectID = {_id: new ObjectId(ObjectId.createFromHexString(postId))};
    const updateDoc = { $set: updatedData };

    const result = await colecao.updateOne(objectID, updateDoc);

    return result;
  } catch (error) {
    console.error("Erro ao atualizar o post:", error);
    throw error;
  } finally {
    // Feche a conexão com o banco de dados
    //await conexao.close();
  }
}
