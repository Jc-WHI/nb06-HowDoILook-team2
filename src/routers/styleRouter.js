import {prisma} from '../apis/prismaClient';
import {Router} from 'express';

const router = Router();

//style update 
router.route('/style:styleId')
.get((req,res,next)=>{
    const styleId = parseInt(req.params.styleId);
    const userPassword = req.body.password;

    
    try{
        const passwordChecking = prisma.style.get({
            where:{id:styleId},
        });
        if(passwordChecking.password===userPassword){
            next()
            .put((req,res)=>{
                const {nickname,title,content,password,item,tag,imgUrls} = req.body;
                prisma.style.upsert({
                    where:{id:styleId},
                    update:{nickname:nickname,title:title,content:content,password:password,item:item,tag:tag,imgUrls:imgUrls},
                    create:{nickname:nickname,title:title,content:content,password:password,item:item,tag:tag,imgUrls:imgUrls}
                });
                res.status(200).send("Successfully updated");


            })
        }
        
    }catch(error){
        res.status(400).json(error);
        console.error(":update is failed, checkout password again");
    }

    

}
)


