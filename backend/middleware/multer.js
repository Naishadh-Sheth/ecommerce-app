import multer from 'multer'

const storage = multer.diskStorage({
    filename:function(req,file,callback){
        callback(null, file.originalname)
    }
})

const upload = multer({storage}) //upload is the middleware created using the storage functionality of multer

export default upload