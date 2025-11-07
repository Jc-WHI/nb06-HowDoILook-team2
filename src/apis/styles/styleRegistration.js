
import prisma from "./prismaClient.js"


const item={
    		top: {
			"name": "string",
			"brand": "string",
			"price": 0
		},
		bottom: {
			"name": "string",
			"brand": "string",
			"price": 1
		},
		outer: {name: "string",
			brand: "string",
			price: 0
},
		dress: {name: "string",
			brand: "string",
			price: 0
},
		shoes: {name: "string",
			brand: "string",
			price: 0
        },
		bag: {name: "string",
			brand: "string",
			price: 0

}
}
        


export async function styleRegistration(obj){
    try{
const req = await prisma.style.create({
    data:{
        nickname:obj.name,
        title:obj.title,
        content:obj.content,
        password:obj.password,
        item:obj.item,
        tag:obj.tag,
        imgUrls:obj.imgUrls,
        
    }

    
})
console.log('Sucessfully Created');
return req;
    }catch(err){
        console.error(err);
        prisma.$disconnect();
    }
}


const object = {
    name: "Jo",
    title: "This is a title",
    content: "this is a content",
    password:"1234",
    categories: {  
         		top: {
			name: "string",
			brand: "string",
			price: 0},
 
},
   tags:[],
    image:[ ],
}
