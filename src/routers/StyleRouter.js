import {prisma} from '../../src/lib/prismaClient.js';
import {Router} from 'express';

const styleRouter = Router();

//style update 
styleRouter.put('/styles/:styleId',async(req,res)=>{
    const styleId = parseInt(req.params.styleId);
    const userPassword = req.body.password;

    
    try{
        const passwordChecking = await prisma.style.findMany({
            where:{id:styleId},
        });
        if(!passwordChecking){
            res.status(404).send("it's a not valid password.")
        }
        if(passwordChecking.password===userPassword){
            
        
                const {nickname,title,content,password,item,tag,image} = req.body;
                await prisma.style.upsert({
                    where:{id:styleId},
                    update:{nickname:nickname,title:title,content:content,password:password,item:item,tag:tag,image:image},
                    create:{nickname:nickname,title:title,content:content,password:password,item:item,tag:tag,image:image}
                });
                res.status(200).send("Successfully updated");


            }
            else{
            res.status(400).json(error);
            console.log("passwords are not same");
            }
    
        
        
    }catch(error){
        res.status(400).json(error);
        console.error(":update is failed, checkout password again");
    }

    

}
)


export default styleRouter;