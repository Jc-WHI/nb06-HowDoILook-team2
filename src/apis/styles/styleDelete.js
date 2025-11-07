import prisma from "./prismaClient.js";

const styleDelete = async (req,res)=>{
    const styleId = parseInt(req.params.styleId);
    await prisma.style.delete({
        where:{id:styleId}
    })
    console.log("sucessfully deleted!");
    res.status(200).send("deleted");


}

export default styleDelete