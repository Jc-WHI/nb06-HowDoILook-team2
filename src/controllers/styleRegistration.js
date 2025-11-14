import {prisma} from '../lib/prismaClient.js'
import {assert, string, object, array, enums, number, record, optional} from 'superstruct' // Import optional

//스타일 등록 매서드 
const styleRegistration = async(req,res) =>{
    // Add alternative field names
    const {nickname, title, content, password, categories, tags, tag, imageUrls, imgUrls} = req.body;
    const reqTags = tags ?? tag ?? [];
    const reqImageUrls = imageUrls ?? imgUrls ?? [];
    const data = {nickname, title, content, password, categories, tags: reqTags, imageUrls: reqImageUrls};
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
        tags: optional(stringArray), // Use tag consistently
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
                    connectOrCreate: (reqTags || []).map(t => ({
                        where:{tags:t},
                        create:{tags:t}
                    }))
                },
                image: { // Map imageUrls to imageUrls in the Image model
                    create: (reqImageUrls || []).map(url => ({ imageUrls: url }))
                }
            },
            include:{
                item:true,
                tag:true,
                image:true
            }
        });

        const response = {};
        response.nickname = result.nickname;
        response.title = result.title;
        response.content = result.content;
        response.password = result.password;
    

        // Build desired categories structure:
        // categories: { [categoryKey]: { [object_name]: { name, brand, price } } }
        const categoriesObj = {};
        (result.item || []).forEach(it => {
            if (!categoriesObj[it.categories]) categoriesObj[it.categories] = {};
            categoriesObj[it.categories][it.name] = {
                name: it.name,
                brand: it.brand,
                price: it.price
            };
        });
        response.categories = categoriesObj;

        // Ensure tags is a string[] and not undefined
        response.tag = (result.tag || []).map(t => t.tags);

        // Ensure imageUrls is a string[] and not undefined
        response.imgUrls = (result.image|| []).map(img => img.imageUrls);

        res.status(200).json(response); 
    } catch (error) {
        console.error(error);
        res.status(500).send("스타일 등록 중 오류가 발생했습니다.");
    }
}
export default styleRegistration