import {prisma} from '../lib/prismaClient.js'
import {assert, string, object, array, enums, number, record, optional} from 'superstruct' // Import optional

//스타일 등록 매서드 
const styleRegistration = async(req,res) =>{
    const {nickname, title, content, password, categories, tag, imageUrls} = req.body; // Renamed tags to tag
    const data = {nickname, title, content, password, categories, tag, imageUrls}; // Use tag here
    const stringArray = array(string());
    const category = enums(["top","bottom","outer","dress","shoes","bag","accessory"]);
    const categoryAttribute = object({ name: string(), brand: string(), price: number() });
    const categoriesStruct = record(enums(["top", "bottom", "outer", "dress", "shoes", "bag", "accessory"]), categoryAttribute);

    const styleInformation = object({
        nickname: string(),
        title: string(),
        content: string(),
        password: string(),
        categories: categoriesStruct,
        tag: optional(stringArray), // Use tag consistently
        imageUrls: optional(stringArray) // Use optional helper
    });


    try {
        assert(data, styleInformation); // Validate the data
    } catch (error) {
        return res.status(400).send(`Validation Error: ${error.message}`);
    }

    try {
        const result = await prisma.style.create({
            data: { 
                nickname: nickname,
                title: title, 
                content: content, 
                password: password, 
                item: {
                    create: Object.entries(categories || {}).map(([categoryKey, categoryData]) => ({
                        name: categoryData.name,
                        brand: categoryData.brand,
                        price: categoryData.price,
                        categories: categoryKey // Use the key as the category
                    }))
                },
                tag: {
                    create: (tag || []).map(tag => ({ tags: tag })) // Use tag consistently
                },
                image: { // Map imageUrls to imageUrls in the Image model
                    create: (imageUrls || []).map(url => ({ imageUrls: url })) // Use imageUrls consistently
                }
            }
        });
        res.status(200).json(result); 
    } catch (error) {
        console.error(error);
        res.status(500).send("스타일 등록 중 오류가 발생했습니다.");
    }
}
export default styleRegistration