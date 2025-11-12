import {prisma} from '../lib/prismaClient'
import {assert,string,object,array,enums,number} from 'superstruct'

//스타일 등록 매서드 
const styleRegistration = async(req,res) =>{
    const {nickname,title,content,password,categories,tag,image} = req.body;
    const data = {nickname,title,content,password,categories,tag,image}
    const stringArray = array(string())
    const category = enums(["top","bottom","outer","dress","shoes","bag","accessory"])
    const categoryAttribute = object({"name":string(),"brand":string(),"price":number()})
    const cate = object({categories:categoryAttribute})

    const styleInformation = object({
        nickname:string(),
        title:string(),
        content:string(),
        password:string(),
        categories:cate(),
        tag:stringArray(),
        image:stringArray()

    })
    if(!assert(data,styleInformation)){
        res.status(300).send("모든 값을 채웠는지 확인하십시오");
    }
    else{
        try {
            const result = await prisma.style.create({
                data: { 
                    nickname: nickname,
                    title: title, 
                    content: content, 
                    password: password, 
                    categories: categories 
                }
            });
            res.status(200).json(result); 
        } catch (error) {
            console.error(error);
            res.status(500).send("스타일 등록 중 오류가 발생했습니다.");
        }
    }
}