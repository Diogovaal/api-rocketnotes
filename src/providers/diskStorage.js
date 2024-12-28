const fs = require("fs")/**manipulação de arquivos */
const path = require("path")/**para navegar pelos diretorios */
const uploadConfig = require("../confings/upload")

class DiskStorage {
    async saveFile(file){
        await fs.promises.rename(
            path.resolve(uploadConfig.TMP_FOLDER, file),/**pega o arquivo da pasta temporaria */
            path.resolve(uploadConfig.UPLOADS_FOLDER, file)/**o arquivo vem do tmp e fica alocado aqui */
        )

        return file;
    }

    async deleteFile(file){
        const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file)

        try{
            await fs.promises.stat(filePath)
        } catch {return}
        
        await fs.promises.unlink(filePath)
    }
}

module.exports= DiskStorage