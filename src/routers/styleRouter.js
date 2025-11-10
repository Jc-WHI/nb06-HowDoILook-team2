import prisma from '../apis/prismaClient.js';
import {Router} from 'express';

const styleRouter = Router();

//style update 
styleRouter.put('styles/:styleId',async(req,res)=>{
    const styleId = parseInt(req.params.styleId);
    const userPassword = req.body.password;

    
    try{
        const passwordChecking = await prisma.style.get({
            where:{id:styleId},
        });
        if(passwordChecking.password===userPassword){
            
        
                const {nickname,title,content,password,item,tag,imgUrls} = req.body;
                await prisma.style.upsert({
                    where:{id:styleId},
                    update:{nickname:nickname,title:title,content:content,password:password,item:item,tag:tag,imgUrls:imgUrls},
                    create:{nickname:nickname,title:title,content:content,password:password,item:item,tag:tag,imgUrls:imgUrls}
                });
                res.status(200).send("Successfully updated");


            }
        
    
        
        
    }catch(error){
        res.status(400).json(error);
        console.error(":update is failed, checkout password again");
    }

    

}
)


export default styleRouter;