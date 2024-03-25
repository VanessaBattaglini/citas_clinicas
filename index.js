const express = require('express');
const app = express();
const PORT = 3003;
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const _ = require('loadsh');
const chalk = require('chalk');
const moment = require('moment');

const apiURL = "https://randomuser.me/api/";
const usuarios = [];
const formato = "MMMM Do YYYY: hh:mm:ss a";

app.get("/usuarios", async (req, res) => {
    //Consulta de la API con Axios
    try {
        const userApi = await axios.get(apiURL);
        // const data = userApi.data.results[0];
        const nombre = userApi.data.results[0].name.first;
        const apellido = userApi.data.results[0].name.last;
        const genero = userApi.data.results[0].gender;
        const id = uuidv4().slice(0, 8);
        const tiempo = moment().format(formato);
        usuarios.push({ nombre, apellido, genero, id, tiempo });
        console.log(usuarios)
        //Separar la lista de usuarios por genero
        const userPorGender = _.partition(usuarios, (user) => {
            return user.genero === 'female'
        });
        //Mostrar la plantilla de datos en el Navegador
        const template = `
        <div style="text-align: center;">
            <h3>Mujeres</h3>
            <table style="margin: 0 auto; border-collapse: collapse; border: 1px solid black;">
                <tr>
                    <th style="border: 1px solid black; background-color: #FFC0CB;">Nombre</th>
                    <th style="border: 1px solid black; background-color: #FFC0CB;">Apellido</th>
                    <th style="border: 1px solid black; background-color: #FFC0CB;">Género</th>
                    <th style="border: 1px solid black; background-color: #FFC0CB;">ID</th>
                    <th style="border: 1px solid black; background-color: #FFC0CB;">Fecha</th>
                </tr>
                ${userPorGender[0]
                  .map((user) => {
                    return `
                <tr>
                    <td style="border: 1px solid black; ">${user.nombre}</td>
                    <td style="border: 1px solid black;">${user.apellido}</td>
                    <td style="border: 1px solid black;">${user.genero}</td>
                    <td style="border: 1px solid black;">${user.id}</td>
                    <td style="border: 1px solid black;">${user.tiempo}</td>
                </tr>
            `;
                  })
                  .join("")}
    </table>

    <h3>Hombres</h3>
    <table style="margin: 0 auto; border-collapse: collapse; border: 1px solid black;">
        <tr>
            <th style="border: 1px solid black; background-color: #ADD8E6;">Nombre</th>
            <th style="border: 1px solid black; background-color: #ADD8E6;">Apellido</th>
            <th style="border: 1px solid black; background-color: #ADD8E6;">Género</th>
            <th style="border: 1px solid black; background-color: #ADD8E6;">ID</th>
            <th style="border: 1px solid black; background-color: #ADD8E6;">Fecha</th>
        </tr>
        ${userPorGender[1]
          .map((user) => {
            return `
                <tr>
                    <td style="border: 1px solid black; ">${user.nombre}</td>
                    <td style="border: 1px solid black;">${user.apellido}</td>
                    <td style="border: 1px solid black;">${user.genero}</td>
                    <td style="border: 1px solid black;">${user.id}</td>
                    <td style="border: 1px solid black;">${user.tiempo}</td>
                </tr>
            `;
          })
          .join("")}
        </table>
    </div>
`;

        //Mostrar resultados en la consola
        console.log(
            chalk.green.bgYellow(`
                Nombre: ${nombre} - 
                Apellido: ${apellido} - 
                Id: ${id} - 
                Hora: ${tiempo}\n 
                Nombre: ${nombre} - 
                Apellido: ${apellido} - 
                Id: ${id} - 
                Hora: ${tiempo}
                `));
        res.send(template)
    } catch (error) {
        console.error("Error al obtener usuario aleatorio:", error);
        res.status(500).json({ error: "Ocurrió un error al obtener usuario aleatorio" });
    }
});
    
app.listen(PORT, () => {
    console.log(`El servidor se ha levantado en el port http://localhost:${PORT}`)
});