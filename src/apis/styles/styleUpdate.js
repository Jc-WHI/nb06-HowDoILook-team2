import prisma from "./prismaClient.js";


const styleUpdate =  async (req,res)=>{
    const styleId = parseInt(req.params.styleId);
    const {nickname,title,content,password,item,tag,imgUrls} = req.body;
    const searchResult = await prisma.style.upsert({
        where:{id:styleId},
        update:{nickname:nickname,title:title,content:content,password:password,item:item,tag:tag,imgUrls:imgUrls},
        create:{nickname:nickname,title:title,content:content,password:password,item:item,tag:tag,imgUrls:imgUrls}
    });
    try{
        res.status(200).json(searchResult);
        console.log("Update is succeed");
    }catch(error){
        res.status(400).json(error);
        console.error(":update is failed");
    }



} 



export default styleUpdate;